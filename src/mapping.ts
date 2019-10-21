import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { store } from '@graphprotocol/graph-ts'
import {
  Pool,
  Deposited,
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
  Draw,
  PlayerEntry,
  Player,
  Admin
} from '../generated/schema'

const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)

function formatPlayerEntryId(playerId: string, drawId: BigInt): string {
  return 'player-' + playerId + '_draw-' + drawId.toString()
}

function createPlayerEntry(playerId: string, drawId: BigInt): PlayerEntry {
  const playerEntryId = formatPlayerEntryId(playerId, drawId)
  const playerEntry = new PlayerEntry(playerEntryId)
  playerEntry.player = playerId
  playerEntry.draw = drawId.toString()
  playerEntry.drawId = drawId
  return playerEntry
}

export function handleDeposited(event: Deposited): void {
  let playerId = event.params.sender.toHex()
  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.sponsorshipBalance = ZERO
  }
  let pool = Pool.bind(event.address)
  player.balance = pool.balanceOf(event.params.sender)
  player.save()

  const openDrawId = pool.currentOpenDrawId()
  const openDraw = new Draw(openDrawId.toString())
  openDraw.balance = pool.openSupply()
  openDraw.save()

  const playerEntryId = formatPlayerEntryId(playerId, openDrawId)
  let playerEntry = PlayerEntry.load(playerEntryId)
  if (!playerEntry) {
    playerEntry = createPlayerEntry(player.id, openDrawId)
    playerEntry.balance = player.balance
    playerEntry.save()
    player.entries.push(playerEntry.id)
    player.save()
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
  let playerId = playerAddress.toHex()
  let player = new Player(playerId)
  player.balance = ZERO
  player.sponsorshipBalance = ZERO
  player.save()

  let pool = Pool.bind(event.address)
  const openDrawId = pool.currentOpenDrawId()

  const openPlayerEntryId = formatPlayerEntryId(player.id, openDrawId)
  let openPlayerEntry = PlayerEntry.load(openPlayerEntryId)

  // if the player does not have an open entry create one
  if (!openPlayerEntry) {
    openPlayerEntry = createPlayerEntry(player.id, openDrawId)
  }
  openPlayerEntry.balance = ZERO
  openPlayerEntry.save()

  // update the open draw id balance
  const openDraw = new Draw(openDrawId.toString())
  openDraw.balance = pool.openSupply()
  openDraw.save()
  
  const committedDrawId = pool.currentCommittedDrawId()
  // if there is a committed draw
  if (!committedDrawId.isZero()) {
    const committedDraw = new Draw(committedDrawId.toString())
    committedDraw.balance = pool.committedSupply()
    committedDraw.save()

    const committedPlayerEntryId = formatPlayerEntryId(player.id, committedDrawId)
    let committedPlayerEntry = PlayerEntry.load(committedPlayerEntryId)
    if (!committedPlayerEntry) {
      committedPlayerEntry = createPlayerEntry(player.id, committedDrawId)
    }
    committedPlayerEntry.balance = ZERO
    committedPlayerEntry.save()
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
  let draw = new Draw(event.params.drawId.toString())
  
  draw.balance = ZERO
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

  draw.save()
}

export function handleCommitted(event: Committed): void {
  let openDraw = new Draw(event.params.drawId.toString())
  openDraw.state = 'Committed'
  openDraw.committedAt = event.block.timestamp
  openDraw.save()
}

export function handleRewarded(event: Rewarded): void {
  let draw = new Draw(event.params.drawId.toString())
  
  draw.state = 'Rewarded'
  draw.winner = event.params.winner
  draw.winnings = event.params.winnings
  draw.fee = event.params.fee
  draw.entropy = event.params.entropy
  draw.rewardedAt = event.block.timestamp

  draw.save()

  const pool = Pool.bind(event.address)
  const committedDrawId = pool.currentCommittedDrawId()
  const playerEntry = createPlayerEntry(event.params.winner.toString(), committedDrawId)
  playerEntry.balance = pool.committedBalanceOf(event.params.winner)
  playerEntry.save()
}

export function handleNextFeeFractionChanged(
  event: NextFeeFractionChanged
): void {}

export function handleNextFeeBeneficiaryChanged(
  event: NextFeeBeneficiaryChanged
): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
