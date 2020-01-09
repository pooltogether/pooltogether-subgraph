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
const NEGATIVE_ONE = BigInt.fromI32(-1)
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

function findPlayerEntryWithPlayerId(playerId: string, draw: Draw | null): PlayerEntry | null {
  const index = findPlayerEntryIndexWithPlayerId(playerId, draw);
  if (index.notEqual(NEGATIVE_ONE)) {
    const arr = draw.entryIds.slice(0)
    const entryId = arr[index.toI32()]
    return PlayerEntry.load(entryId)
  }
  return null
}

function formatPlayerEntryId(playerId: string, drawEntityId: string): string {
  return 'player-' + playerId + '_draw-' + drawEntityId
}

function removePlayerEntryFromDraw(playerId: string, draw: Draw | null): void {
  const oldPlayerEntryIndex = findPlayerEntryIndexWithPlayerId(playerId, draw)

  log.warning('----------- removePlayerEntryFromDraw({}, {}): findPlayerEntryIndexWithPlayerId: {}', [
    playerId,
    draw.drawId.toString(),
    oldPlayerEntryIndex.toString()
  ])

  if (oldPlayerEntryIndex.gt(NEGATIVE_ONE)) {
    const entryIds = draw.entryIds.slice(0)
    entryIds.splice(oldPlayerEntryIndex.toI32(), 1)

    draw.entryIds = entryIds
    draw.entries = entryIds.slice(0)

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
  playerEntry.balance = ZERO
  playerEntry.sponsorshipBalance = ZERO

  addPlayerEntryToDraw(draw, playerEntry)

  return playerEntry
}

function addPlayerEntryToDraw(draw: Draw | null, playerEntry: PlayerEntry | null): void {
  const entryIds = draw.entryIds.slice(0)

  log.warning("+++++++++++++ addPlayerEntryToDraw: playerId: {}", [playerEntry.id.toString()])

  entryIds.push(playerEntry.id)
  draw.entryIds = entryIds
  draw.entries = entryIds.slice(0)
  draw.entriesCount = BigInt.fromI32(entryIds.length)

  draw.save()

  log.warning(`addPlayerEntryToDraw complete`, [])
}

export function handleDepositedAndCommitted(event: DepositedAndCommitted): void {
  const playerAddress = event.params.sender
  const amount = event.params.amount
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const committedDrawId = pool.currentCommittedDrawId()

  // if (event.address.equals(KOVAN_POOL_SAI_ADDRESS)) {
    handleDepositedEvent(playerAddress, poolAddress, committedDrawId, amount)
  // }
}

export function handleDeposited(event: Deposited): void {
  const playerAddress = event.params.sender
  const amount = event.params.amount
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const openDrawId = pool.currentOpenDrawId()

  // if (event.address.equals(KOVAN_POOL_SAI_ADDRESS)) {
    handleDepositedEvent(playerAddress, poolAddress, openDrawId, amount)
  // }
}

function increasePlayerEntryBalance(draw: Draw | null, playerId: string, amount: BigInt | null): PlayerEntry {

  log.warning(`increasePlayerEntryBalance({}, {}, {})`, [
    draw.id.toString(),
    playerId,
    amount ? amount.toString() : 'UH OH'
  ])

  const playerEntryId = formatPlayerEntryId(playerId, draw.id)
  let playerEntry = PlayerEntry.load(playerEntryId)

  const castAmount: BigInt = amount as BigInt

  if (playerEntry) {
    playerEntry.balance = playerEntry.balance.plus(castAmount)
    playerEntry.save()
  } else {
    const oldPlayerEntry = findPlayerEntryWithPlayerId(playerId, draw)

    // remove the old entry, if it exists when copied from previous committed draw
    removePlayerEntryFromDraw(playerId, draw)

    playerEntry = createPlayerEntry(playerId, draw)

    log.warning(`increasePlayerEntryBalance(): about to update playerEntry.balance: {}`, [castAmount.toString()])

    if (oldPlayerEntry) {
      log.warning(`increasePlayerEntryBalance(): adding to existing balance`, [])
      playerEntry.balance = oldPlayerEntry.balance.plus(castAmount)
    } else {
      log.warning(`increasePlayerEntryBalance(): new balance`, [])
      playerEntry.balance = castAmount
    }
    playerEntry.save()

    log.warning(`increasePlayerEntryBalance(): updated playerEntry.balance`, [])
  }

  draw.balance = draw.balance.plus(castAmount)
  draw.save()

  log.warning(`increasePlayerEntryBalance(): updated draw`, [])

  return playerEntry as PlayerEntry
}

export function handleDepositedEvent(playerAddress: Address, poolAddress: Address, drawId: BigInt, amount: BigInt): void {
  const poolId = poolAddress.toHex()
  let playerId = playerAddress.toHex()
  let player = Player.load(playerId)

  log.error('############## handleDeposited for playerId: {}, to drawId: {}', [playerId, drawId.toString()])

  if (!player) {
    player = new Player(playerId)
    player.save()
  }

  const drawEntityId = formatDrawEntityId(poolId, drawId)
  const draw = Draw.load(drawEntityId)

  increasePlayerEntryBalance(draw, playerId, amount)
}

export function handleSponsorshipDeposited(event: SponsorshipDeposited): void {
  // let playerAddress = event.params.sender
  // let playerId = playerAddress.toHex()
  // let player = Player.load(playerId)

  // if (!player) {
  //   player = new Player(playerId)
  //   player.save()
  // }

  // let pool = Pool.bind(event.address)
  // let balance = pool.balanceOf(playerAddress)
  // let committedBalance = pool.committedBalanceOf(playerAddress)
  // let openBalance = pool.openBalanceOf(playerAddress)
  // let sponsorshipBalance = balance.minus(committedBalance.plus(openBalance))
}

export function handleWithdrawn(event: Withdrawn): void {
  // if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
  //   return
  // }

  const playerAddress = event.params.sender
  const playerId = playerAddress.toHex()

  const pool = Pool.bind(event.address)
  const poolId = event.address.toHex()

  const openDrawId = pool.currentOpenDrawId()
  const openDrawEntityId = formatDrawEntityId(poolId, openDrawId)
  const openDraw = Draw.load(openDrawEntityId)

  log.error('))))))))))))) handleWithdrawn from openDraw {}, sender/player: {}', [openDrawId.toString(), playerId])

  const committedDrawId = pool.currentCommittedDrawId()
  const committedDrawEntityId = formatDrawEntityId(poolId, committedDrawId)
  const committedDraw = Draw.load(committedDrawEntityId)

  const openPlayerEntryId = formatPlayerEntryId(playerId, openDrawEntityId)
  removePlayerEntryFromDraw(playerId, openDraw)
  store.remove('PlayerEntry', openPlayerEntryId)

  openDraw.balance = pool.committedSupply().plus(pool.openSupply())
  openDraw.save()

  if (committedDraw) {
    committedDraw.balance = pool.committedSupply()
    committedDraw.save()

    log.warning('_________ also processing committed draw: {}', [committedDrawId.toString()])
    // Removes whatever entry from draw; regardless if it's copied from previous
    removePlayerEntryFromDraw(playerId, committedDraw)

    // Destroy the exact committed entry if it exists
    const committedPlayerEntryId = formatPlayerEntryId(playerId, committedDrawEntityId)
    store.remove('PlayerEntry', committedPlayerEntryId)
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
  // if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
  //   return
  // }

  const poolId = event.address.toHex()
  const committedDrawId = event.params.drawId

  const committedDraw = Draw.load(
    formatDrawEntityId(poolId, committedDrawId)
  )

  log.error('@@@@@@@@@@@@ handleRewarded for committedDrawId: {}, and winner: {}', [
    committedDraw.drawId.toString(),
    // committedDrawId.toHex(),
    event.params.winner.toHexString()
  ])

  committedDraw.state = 'Rewarded'
  committedDraw.winner = event.params.winner
  committedDraw.winnings = event.params.winnings
  committedDraw.fee = event.params.fee
  committedDraw.entropy = event.params.entropy
  committedDraw.rewardedAt = event.block.timestamp
  committedDraw.save()

  const winnerId = committedDraw.winner.toHex()

  if (committedDraw.winner.notEqual(ZERO_ADDRESS)) {
    log.warning("committedDraw.winner IS NOT ZERO ADDRESS!", [committedDraw.winner.toHexString()])
    const openDrawEntityId = formatDrawEntityId(poolId, committedDraw.drawId.plus(ONE))
    const openDraw = Draw.load(openDrawEntityId)
    const playerEntry = increasePlayerEntryBalance(openDraw, winnerId, committedDraw.winnings)
    committedDraw.winnerEntry = playerEntry.id
    committedDraw.save()
  }
}

export function handleCommitted(event: Committed): void {
  // if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
  //   return
  // }

  log.error('+++++++++++ handleCommitted for drawId: {}', [event.params.drawId.toHex()])

  const poolId = event.address.toHex()
  const openDrawEntityId = formatDrawEntityId(poolId, event.params.drawId)
  const openDraw = Draw.load(openDrawEntityId)

  openDraw.state = 'Committed'
  openDraw.committedAt = event.block.timestamp
  openDraw.save()
}

export function handleOpened(event: Opened): void {
  // if (event.address.notEqual(KOVAN_POOL_SAI_ADDRESS)) {
  //   return
  // }

  log.error('~~~~~~~~~~~~~ handleOpened for drawId: {}', [event.params.drawId.toHex()])

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

  let committedDrawEntityId = formatDrawEntityId(poolId, event.params.drawId.minus(ONE))
  let committedDraw = Draw.load(committedDrawEntityId)
  if (committedDraw) {
    draw.balance = committedDraw.balance
    draw.entryIds = committedDraw.entryIds.slice(0)
    draw.entries = committedDraw.entryIds.slice(0)
    draw.entriesCount = BigInt.fromI32(draw.entryIds.length)
  } else {
    draw.balance = ZERO
    draw.entryIds = []
    draw.entries = []
    draw.entriesCount = ZERO
  }

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
  draw.poolContract = poolId

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
