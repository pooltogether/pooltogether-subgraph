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

function formatDrawEntityId(contractAddress: string, drawId: BigInt): string {
  return contractAddress + '-' + drawId.toString()
}

function matchPlayerEntryIdPlayer(playerEntryId: string, playerId: string): boolean {
  const start = 'player-' + playerId + '_draw-'
  // log.info('????????????? checking if {} starts with {} from {}', [playerEntryId, start, playerId])
  return playerEntryId.startsWith(start)
}

function findPlayerEntryIndexWithPlayerId(playerId: string, draw: Draw | null): BigInt {
  // log.info('+++++++++++ findPlayerEntryIndexWithPlayerId {}', [playerId])
  const arr = draw.entryIds.slice(0)
  let result = -1;
  for (let i = 0; i < arr.length; i++) {
    if (matchPlayerEntryIdPlayer(arr[i], playerId)) {
      result = i;
    }
  }
  // log.info('+++++++++++ result is: ', [result.toString()])
  return BigInt.fromI32(result);
}

function formatPlayerEntryId(playerId: string, drawEntityId: string): string {
  return 'player-' + playerId + '_draw-' + drawEntityId
}

function removePlayerId(playerId: string, draw: Draw | null): void {
  // log.info('----- removePlayerId: playerId: {}', [playerId])
  const oldPlayerEntryIndex = findPlayerEntryIndexWithPlayerId(playerId, draw)
  // log.info('----- removePlayerId: oldPlayerEntryIndex: {}', [oldPlayerEntryIndex.toString()])
  if (oldPlayerEntryIndex.gt(BigInt.fromI32(-1))) {
    const entryIds = draw.entryIds.slice(0)
    entryIds.splice(oldPlayerEntryIndex.toI32(), 1)
    draw.entryIds = entryIds
    draw.entries = entryIds
    draw.entriesCount = BigInt.fromI32(entryIds.length)
  }
}

function createPlayerEntry(playerId: string, draw: Draw): PlayerEntry {
  const playerEntryId = formatPlayerEntryId(playerId, draw.id)
  const playerEntry = new PlayerEntry(playerEntryId)
  playerEntry.player = playerId
  playerEntry.draw = draw.id
  playerEntry.drawId = draw.drawId
  return playerEntry
}

function addEntry(draw: Draw | null, playerEntry: PlayerEntry | null): void {
  const entryIds = draw.entryIds.slice(0)
  // log.debug("------------------ addEntry: playerId: {}", [playerEntry.id.toString()])
  entryIds.push(playerEntry.id)
  draw.entryIds = entryIds
  draw.entries = entryIds.slice(0)
  draw.entriesCount = BigInt.fromI32(entryIds.length)
}

function removeEntry(draw: Draw | null, playerEntryId: string): void {
  let entryIds = draw.entryIds.slice(0)
  const index = entryIds.indexOf(playerEntryId)
  if (index !== -1) {
    entryIds.splice(index, 1)
    draw.entryIds = entryIds
    draw.entries = entryIds.slice(0)
    draw.entriesCount = BigInt.fromI32(entryIds.length)
  }
}

export function handleDepositedAndCommitted(event: DepositedAndCommitted): void {
  const playerAddress = event.params.sender
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const committedDrawId = pool.currentCommittedDrawId()
  handleDepositedEvent(playerAddress, poolAddress, committedDrawId)
}

export function handleDeposited(event: Deposited): void {
  const playerAddress = event.params.sender
  const poolAddress = event.address
  const pool = Pool.bind(poolAddress)
  const openDrawId = pool.currentOpenDrawId()
  handleDepositedEvent(playerAddress, poolAddress, openDrawId)
}

export function handleDepositedEvent(playerAddress: Address, poolAddress: Address, drawId: BigInt): void {
  const poolId = poolAddress.toHex()
  let playerId = playerAddress.toHex()
  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.sponsorshipBalance = ZERO
  }
  let pool = Pool.bind(poolAddress)
  player.balance = pool.committedBalanceOf(playerAddress).plus(pool.openBalanceOf(playerAddress))
  player.save()

  const drawEntityId = formatDrawEntityId(poolId, drawId)
  const draw = Draw.load(drawEntityId)
  draw.balance = pool.committedSupply().plus(pool.openSupply())
  draw.save()

  const playerEntryId = formatPlayerEntryId(playerId, drawEntityId)
  let playerEntry = PlayerEntry.load(playerEntryId)
  if (!playerEntry) {
    // remove the old entry, if it exists
    // log.info('handleDeposited: {} ', [playerId])
    removePlayerId(playerId, draw)

    playerEntry = createPlayerEntry(player.id, draw)
    playerEntry.balance = player.balance
    playerEntry.save()
    addEntry(draw, playerEntry)
    draw.save()
  } else {
    playerEntry.balance = player.balance
    playerEntry.save()
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
  let playerAddress = event.params.sender
  // log.debug('handleWithdrawn for tx {}, sender: {}', [event.transaction.hash.toHex(), playerAddress.toHex()])
  let playerId = playerAddress.toHex()
  let player = new Player(playerId)
  player.balance = ZERO
  player.sponsorshipBalance = ZERO
  player.save()

  let pool = Pool.bind(event.address)
  let poolId = event.address.toHex()
  const openDrawId = pool.currentOpenDrawId()
  const openDrawEntityId = formatDrawEntityId(poolId, openDrawId)
  const openDraw = Draw.load(openDrawEntityId)

  const openPlayerEntryId = formatPlayerEntryId(playerId, openDrawEntityId)
  removeEntry(openDraw, openPlayerEntryId)
  removePlayerId(playerId, openDraw)
  openDraw.balance = pool.committedSupply().plus(pool.openSupply())
  openDraw.save()
  store.remove('PlayerEntry', openPlayerEntryId)

  const committedDrawId = pool.currentCommittedDrawId()
  const committedDrawEntityId = formatDrawEntityId(poolId, committedDrawId)
  const committedDraw = Draw.load(committedDrawEntityId)
  if (committedDraw) {
    removePlayerId(playerId, committedDraw)
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
  let admin = new Admin(adminId)
  admin.addedAt = event.block.timestamp
  admin.save()
}

export function handleAdminRemoved(event: AdminRemoved): void {
  let adminId = event.params.admin.toHex()
  store.remove('Admin', adminId)
}

export function handleOpened(event: Opened): void {
  const poolId = event.address.toHex()
  const drawEntityId = formatDrawEntityId(poolId, event.params.drawId)
  const draw = new Draw(drawEntityId)

  let poolContract = PoolContract.load(poolId)
  if (!poolContract) {
    poolContract = new PoolContract(poolId)
    poolContract.save()
  }

  let pool = Pool.bind(event.address)  

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

  draw.save()

  let committedDrawId = pool.currentCommittedDrawId()
  
  if (!committedDrawId.isZero()) {
    const committedDraw = Draw.load(formatDrawEntityId(poolId, committedDrawId))
    const entryIds = committedDraw.entryIds.slice(0)
    draw.entryIds = entryIds
    draw.entries = entryIds
    draw.entriesCount = BigInt.fromI32(entryIds.length)
  }
  draw.save()
}

export function handleCommitted(event: Committed): void {
  const poolId = event.address.toHex()
  const openDrawEntityId = formatDrawEntityId(poolId, event.params.drawId)
  const openDraw = Draw.load(openDrawEntityId)
  openDraw.state = 'Committed'
  openDraw.committedAt = event.block.timestamp
  openDraw.save()

  const rewardedDrawId = event.params.drawId.minus(ONE)
  const rewardedDrawEntityId = formatDrawEntityId(poolId, rewardedDrawId)
  const rewardedDraw = Draw.load(rewardedDrawEntityId)
  if (rewardedDraw) {
    const winnerId = rewardedDraw.winner.toHex()
    const pool = Pool.bind(event.address)

    const committedPlayerEntryId = formatPlayerEntryId(winnerId, openDrawEntityId)
    const committedPlayerEntry = PlayerEntry.load(committedPlayerEntryId)
    if (committedPlayerEntry) { // if they have an active deposit
      // update the balance to include the winnings
      committedPlayerEntry.balance = pool.committedBalanceOf(Address.fromString(winnerId))
      committedPlayerEntry.save()
    } else { // we need to remove the old one, if any, and update the balance
      removePlayerId(winnerId, openDraw)
      const playerEntry = createPlayerEntry(winnerId, openDraw)
      playerEntry.balance = pool.committedBalanceOf(Address.fromString(winnerId))
      playerEntry.save()
      addEntry(openDraw, playerEntry)
      openDraw.save()
    }
  }
}

export function handleRewarded(event: Rewarded): void {
  let poolId = event.address.toHex()
  let draw = Draw.load(formatDrawEntityId(poolId, event.params.drawId))

  draw.state = 'Rewarded'
  draw.winner = event.params.winner

  log.info('handleRewarded: {}', [draw.winner.toHex()])

  if (draw.winner !== ZERO_ADDRESS) {
    const winnerEntryIndex = findPlayerEntryIndexWithPlayerId(draw.winner.toHex(), draw)

    log.info('draw.winner.toHex():', [draw.winner.toHex()])

    if (winnerEntryIndex.toI32() !== -1) {
      log.info('XX Found winner entry index: {}', [winnerEntryIndex.toString()])

      const niceArray = draw.entryIds.slice(0)
      draw.winnerEntry = niceArray[winnerEntryIndex.toI32()]

      const pool = Pool.bind(event.address)
      const committedDrawId = pool.currentCommittedDrawId()
      const committedDraw = Draw.load(formatDrawEntityId(event.address.toHex(), committedDrawId))
      const playerEntry = createPlayerEntry(draw.winner.toHex(), committedDraw)

      playerEntry.balance = pool.committedBalanceOf(event.params.winner)
      playerEntry.save()
    }
  }

  draw.winnings = event.params.winnings
  draw.fee = event.params.fee
  draw.entropy = event.params.entropy
  draw.rewardedAt = event.block.timestamp

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


/*


When a draw is rewarded:





*/