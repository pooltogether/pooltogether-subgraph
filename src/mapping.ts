import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { store, log } from '@graphprotocol/graph-ts'
import {
  Pool,
  Deposited,
  DepositedAndCommitted,
  SponsorshipDeposited,
  AdminAdded,
  AdminRemoved,
  Withdrawn,
  Opened,
  Committed,
  Rewarded,
  NextFeeFractionChanged,
  NextFeeBeneficiaryChanged,
  Paused,
  Unpaused
} from "../generated/PoolTogether/Pool"
import {
  PoolContract, 
  Draw,
  PlayerEntry,
  Player,
  Admin
} from '../generated/schema'

const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)
const ZERO_ADDRESS = Address.fromString('0x0000000000000000000000000000000000000000')

const KOVAN_POOL_SAI_ADDRESS = Address.fromString('0xf6e245adb2d4758fc180dab8b212316c8fba3c02')

function formatDrawEntityId(contractAddress: string, drawId: BigInt): string {
  return contractAddress + '-' + drawId.toString()
}

function formatAdminEntityId(contractAddress: string, adminId: string): string {
  return contractAddress + '-' + adminId
}

function matchPlayerEntryIdPlayer(playerEntryId: string, playerId: string): boolean {
  const start = 'player-' + playerId// + '_draw-'
  // log.warning('????????????? checking if {} starts with {} from {}', [playerEntryId, start, playerId])
  return playerEntryId.startsWith(start)
}

function findPlayerEntryIndexWithPlayerId(playerId: string, draw: Draw | null): BigInt {
  // log.warning('+++++++++++ findPlayerEntryIndexWithPlayerId {}', [playerId])
  const arr = draw.entryIds.slice(0)
  let result = -1;

  for (let i = 0; i < arr.length; i++) {
    if (matchPlayerEntryIdPlayer(arr[i], playerId)) {
      result = i;
    }
  }

  // THIS WARNING DOES NOT WORK (for some reason):
  // log.warning('----------- result is: ', [BigInt.fromI32(result).toString()])

  return BigInt.fromI32(result);
}

function formatPlayerEntryId(playerId: string, drawEntityId: string): string {
  return 'player-' + playerId + '_draw-' + drawEntityId
}

function removePlayerEntryFromDraw(playerId: string, draw: Draw | null): void {
  const oldPlayerEntryIndex = findPlayerEntryIndexWithPlayerId(playerId, draw)

  log.warning('----------- remove playerId: {}, with oldPlayerEntryIndex: {} from draw: {}', [
    playerId,
    oldPlayerEntryIndex.toString(),
    draw.drawId.toString()
  ])

  if (oldPlayerEntryIndex.gt(BigInt.fromI32(-1))) {
    const entryIds = draw.entryIds.slice(0)
    entryIds.splice(oldPlayerEntryIndex.toI32(), 1)

    draw.entryIds = entryIds
    draw.entries = entryIds

    draw.entriesCount = BigInt.fromI32(entryIds.length)
    log.warning("- new entriesCount: {}", [BigInt.fromI32(entryIds.length).toString()])
  }
}

function createPlayerEntry(playerId: string, draw: Draw | null): PlayerEntry {
  const playerEntryId = formatPlayerEntryId(playerId, draw.id)
  const playerEntry = new PlayerEntry(playerEntryId)

  playerEntry.player = playerId
  playerEntry.draw = draw.id
  playerEntry.drawId = draw.drawId

  return playerEntry
}

function addEntry(draw: Draw | null, playerEntry: PlayerEntry | null): void {
  const entryIds = draw.entryIds.slice(0)

  log.warning("+++++++++++++ addEntry: playerId: {}", [playerEntry.id.toString()])

  entryIds.push(playerEntry.id)
  
  draw.entryIds = entryIds
  draw.entries = entryIds.slice(0)
  draw.entriesCount = BigInt.fromI32(entryIds.length)

  // log.warning("+ new entriesCount: {}", [BigInt.fromI32(entryIds.length).toString()])
}

function removeEntry(draw: Draw | null, playerEntryId: string): void {
  let entryIds = draw.entryIds.slice(0)
  const index = entryIds.indexOf(playerEntryId)

  if (index !== -1) {
    entryIds.splice(index, 1)

    draw.entryIds = entryIds
    draw.entries = entryIds.slice(0)
    draw.entriesCount = BigInt.fromI32(entryIds.length)
    // log.warning("- new entriesCount: {}", [BigInt.fromI32(entryIds.length).toString()])
  }
}

export function handleDepositedAndCommitted(event: DepositedAndCommitted): void {
  const playerAddress = event.params.sender
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const committedDrawId = pool.currentCommittedDrawId()

  if (event.address.equals(KOVAN_POOL_SAI_ADDRESS)) {
    handleDepositedEvent(playerAddress, poolAddress, committedDrawId)
  }
}

export function handleDeposited(event: Deposited): void {
  const playerAddress = event.params.sender
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const openDrawId = pool.currentOpenDrawId()

  if (event.address.equals(KOVAN_POOL_SAI_ADDRESS)) {
    handleDepositedEvent(playerAddress, poolAddress, openDrawId)
  }
}

export function handleDepositedEvent(playerAddress: Address, poolAddress: Address, drawId: BigInt): void {
  const poolId = poolAddress.toHex()
  let playerId = playerAddress.toHex()
  let player = Player.load(playerId)

  log.error('############## handleDeposited for playerId: {}, to drawId: {}', [playerId, drawId.toString()])

  if (!player) {
    player = new Player(playerId)
    player.sponsorshipBalance = ZERO
  }

  let pool = Pool.bind(poolAddress)
  player.balance = pool.committedBalanceOf(playerAddress).plus(pool.openBalanceOf(playerAddress))
  player.save()

  const openDrawEntityId = formatDrawEntityId(poolId, drawId)
  const openDraw = Draw.load(openDrawEntityId)

  openDraw.balance = pool.committedSupply().plus(pool.openSupply())
  openDraw.save()

  const playerEntryId = formatPlayerEntryId(playerId, openDrawEntityId)
  let playerEntry = PlayerEntry.load(playerEntryId)

  if (playerEntry) {
    playerEntry.balance = player.balance
    playerEntry.save()
  } else {
    // remove the old entry, if it exists when copied from previous committed draw
    removePlayerEntryFromDraw(playerId, openDraw)

    playerEntry = createPlayerEntry(player.id, openDraw)
    playerEntry.balance = player.balance
    playerEntry.save()

    addEntry(openDraw, playerEntry)
    openDraw.save()
  }
}

export function handleSponsorshipDeposited(event: SponsorshipDeposited): void {
  let playerAddress = event.params.sender
  let playerId = playerAddress.toHex()
  let player = Player.load(playerId)

  if (!player) {
    player = new Player(playerId)
    player.balance = ZERO
  }

  let pool = Pool.bind(event.address)
  let balance = pool.balanceOf(playerAddress)
  let committedBalance = pool.committedBalanceOf(playerAddress)
  let openBalance = pool.openBalanceOf(playerAddress)
  let sponsorshipBalance = balance.minus(committedBalance.plus(openBalance))

  player.sponsorshipBalance = sponsorshipBalance
  player.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
    return
  }

  const playerAddress = event.params.sender
  const playerId = playerAddress.toHex()
  let player = new Player(playerId)

  const pool = Pool.bind(event.address)
  const poolId = event.address.toHex()

  const openDrawId = pool.currentOpenDrawId()
  const openDrawEntityId = formatDrawEntityId(poolId, openDrawId)
  const openDraw = Draw.load(openDrawEntityId)

  log.error('))))))))))))) handleWithdrawn from openDraw {}, sender/player: {}', [openDrawId.toString(), playerId])

  const committedDrawId = pool.currentCommittedDrawId()
  const committedDrawEntityId = formatDrawEntityId(poolId, committedDrawId)
  const committedDraw = Draw.load(committedDrawEntityId)

  player.balance = ZERO
  player.sponsorshipBalance = ZERO
  player.save()

  const openPlayerEntryId = formatPlayerEntryId(playerId, openDrawEntityId)
  removeEntry(openDraw, openPlayerEntryId)
  removePlayerEntryFromDraw(playerId, openDraw)

  openDraw.balance = pool.committedSupply().plus(pool.openSupply())
  openDraw.save()

  store.remove('PlayerEntry', openPlayerEntryId)

  if (committedDraw) {
    log.warning('_________ also processing committed draw: {}', [committedDrawId.toString()])
    removePlayerEntryFromDraw(playerId, committedDraw)

    const committedPlayerEntryId = formatPlayerEntryId(playerId, committedDrawEntityId)
    const committedPlayerEntry = PlayerEntry.load(committedPlayerEntryId)

    if (committedPlayerEntry) {
      removeEntry(committedDraw, committedPlayerEntryId)
      
      committedDraw.balance = pool.committedSupply()
      committedDraw.save()
      
      store.remove('PlayerEntry', committedPlayerEntryId)
    }
  }
}

export function handleAdminAdded(event: AdminAdded): void {
  let adminId = event.params.admin.toHex()
  let poolId = event.address.toHex()
  let adminEntityId = formatAdminEntityId(poolId, adminId)
  let admin = new Admin(adminEntityId)
  admin.addedAt = event.block.timestamp
  admin.address = event.params.admin

  let poolContract = PoolContract.load(poolId)
  if (!poolContract) {
    poolContract = new PoolContract(poolId)
    poolContract.drawsCount = ZERO
    poolContract.save()
  }

  admin.poolContract = poolContract.id
  admin.save()
}

export function handleAdminRemoved(event: AdminRemoved): void {
  let adminId = event.params.admin.toHex()
  let poolId = event.address.toHex()
  let adminEntityId = formatAdminEntityId(poolId, adminId)
  store.remove('Admin', adminEntityId)
}

export function handleRewarded(event: Rewarded): void {
  if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
    return
  }

  const poolId = event.address.toHex()
  const committedDrawId = event.params.drawId

  const rewardedDraw = Draw.load(
    formatDrawEntityId(poolId, committedDrawId)
  )


  log.error('@@@@@@@@@@@@ handleRewarded for committedDrawId: {}, and winner: {}', [
    rewardedDraw.drawId.toString(),
    // committedDrawId.toHex(),
    event.params.winner.toHexString()
  ])

  rewardedDraw.state = 'Rewarded'
  rewardedDraw.winner = event.params.winner

  rewardedDraw.winnings = event.params.winnings
  rewardedDraw.fee = event.params.fee
  rewardedDraw.entropy = event.params.entropy
  rewardedDraw.rewardedAt = event.block.timestamp
  
  rewardedDraw.save()

  processRewardedPlayer(event, rewardedDraw)
}

function processRewardedPlayer(event: Rewarded, rewardedDraw: Draw | null): void {
  const pool = Pool.bind(event.address)
  const rewardedDrawWinnerAddress = Address.fromString(rewardedDraw.winner.toHexString())
  const winnerId = event.params.winner.toHex()
  const poolId = event.address.toHex()

  if (rewardedDraw.winner.notEqual(ZERO_ADDRESS)) {
    log.warning("rewardedDraw.winner IS NOT ZERO ADDRESS!", [rewardedDraw.winner.toHexString()])
    const openDrawEntityId = formatDrawEntityId(poolId, rewardedDraw.drawId.plus(ONE))
    const openPlayerEntryId = formatPlayerEntryId(winnerId, openDrawEntityId)

    let openPlayerEntry = PlayerEntry.load(openPlayerEntryId)

    const newPlayerEntryBalance = pool.committedBalanceOf(rewardedDrawWinnerAddress).plus(
      pool.openBalanceOf(rewardedDrawWinnerAddress)
    )

    if (openPlayerEntry) { // if they have an active deposit
      // update the balance to include the winnings
      openPlayerEntry.balance = newPlayerEntryBalance
      openPlayerEntry.save()

      rewardedDraw.winnerEntry = openPlayerEntryId
      rewardedDraw.save()
    } else { // we need to remove the old one, if any, and update the balance
      const openDraw = Draw.load(openDrawEntityId)
      removePlayerEntryFromDraw(winnerId, openDraw)

      const openPlayerEntry = createPlayerEntry(winnerId, openDraw)
      openPlayerEntry.balance = newPlayerEntryBalance
      openPlayerEntry.save()

      addEntry(openDraw, openPlayerEntry)
      openDraw.save()
      rewardedDraw.winnerEntry = openPlayerEntryId
      rewardedDraw.save()
    }
  }
}

export function handleCommitted(event: Committed): void {
  if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
    return
  }

  log.error('+++++++++++ handleCommitted for drawId: {}', [event.params.drawId.toHex()])

  const poolId = event.address.toHex()
  const openDrawEntityId = formatDrawEntityId(poolId, event.params.drawId)
  const openDraw = Draw.load(openDrawEntityId)

  openDraw.state = 'Committed'
  openDraw.committedAt = event.block.timestamp
  openDraw.save()

  // const rewardedDrawId = event.params.drawId.minus(ONE)
  // const rewardedDrawEntityId = formatDrawEntityId(poolId, rewardedDrawId)
  // const rewardedDraw = Draw.load(rewardedDrawEntityId)

  // if (rewardedDraw) {
  //   const winnerId = rewardedDraw.winner.toHex()

  //   if (rewardedDraw.winner.notEqual(ZERO_ADDRESS)) {
  //     const pool = Pool.bind(event.address)

  //     const committedPlayerEntryId = formatPlayerEntryId(winnerId, openDrawEntityId)
  //     const committedPlayerEntry = PlayerEntry.load(committedPlayerEntryId)

  //     if (committedPlayerEntry) { // if they have an active deposit
  //       // update the balance to include the winnings
  //       committedPlayerEntry.balance = pool.committedBalanceOf(Address.fromString(winnerId))
  //       committedPlayerEntry.save()
  //     } else { // we need to remove the old one, if any, and update the balance
  //       removePlayerEntryFromDraw(winnerId, openDraw)

  //       const playerEntry = createPlayerEntry(winnerId, openDraw)
  //       playerEntry.balance = pool.committedBalanceOf(Address.fromString(winnerId))
  //       playerEntry.save()

  //       addEntry(openDraw, playerEntry)
  //       openDraw.save()
  //     }
  //   }
  // }
}

export function handleOpened(event: Opened): void {
  if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
    return
  }

  log.error('~~~~~~~~~~~~~ handleOpened for drawId: {}', [event.params.drawId.toHex()])

  const pool = Pool.bind(event.address)

  const poolId = event.address.toHex()
  const drawEntityId = formatDrawEntityId(poolId, event.params.drawId)
  const draw = new Draw(drawEntityId)

  let poolContract = PoolContract.load(poolId)

  if (!poolContract) {
    poolContract = new PoolContract(poolId)
    poolContract.drawsCount = ONE
  } else {
    poolContract.drawsCount = poolContract.drawsCount.plus(ONE)
  }

  poolContract.save()


  draw.balance = pool.committedSupply().plus(pool.openSupply())
  draw.drawId = event.params.drawId
  draw.winner = new Bytes(32)
  draw.entropy = new Bytes(32)
  draw.winnings = ZERO
  draw.fee = ZERO
  draw.state = 'Open'
  draw.feeBeneficiary = event.params.feeBeneficiary
  draw.secretHash = event.params.secretHash
  draw.feeFraction = event.params.feeFraction
  draw.openedAt = event.block.timestamp
  draw.committedAt = ZERO
  draw.rewardedAt = ZERO
  draw.entriesCount = ZERO
  draw.entryIds = []
  draw.entries = []
  draw.poolContract = poolId

  // Start clone of previous committed draw's playerEntries to new openDraw
  let committedDrawId = pool.currentCommittedDrawId()

  if (!committedDrawId.isZero()) {
    const committedDraw = Draw.load(formatDrawEntityId(poolId, committedDrawId))
    const entryIds = committedDraw.entryIds.slice(0)

    draw.entryIds = entryIds
    draw.entries = entryIds
    draw.entriesCount = BigInt.fromI32(entryIds.length)
    // log.warning("= new open draw has same entries as committed draw: {}", [BigInt.fromI32(entryIds.length).toString()])
  }

  draw.save()
}

export function handleNextFeeFractionChanged(
  event: NextFeeFractionChanged
): void {}

export function handleNextFeeBeneficiaryChanged(
  event: NextFeeBeneficiaryChanged
): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
