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
  Player,
  Admin
} from '../generated/schema'

export function handleDeposited(event: Deposited): void {
  let playerId = event.params.sender.toHex()
  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.sponsorshipBalance = BigInt.fromI32(0)
  }
  let pool = Pool.bind(event.address)
  player.balance = pool.balanceOf(event.params.sender)
  player.save()
}

export function handleSponsorshipDeposited(event: SponsorshipDeposited): void {
  let playerAddress = event.params.sender
  let playerId = playerAddress.toHex()
  let player = Player.load(playerId)
  if (!player) {
    player = new Player(playerId)
    player.balance = BigInt.fromI32(0)
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
  player.balance = BigInt.fromI32(0)
  player.sponsorshipBalance = BigInt.fromI32(0)
  player.save()
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
  
  draw.drawId = event.params.drawId
  draw.winner = new Bytes(32)
  draw.entropy = new Bytes(32)
  draw.winnings = BigInt.fromI32(0)
  draw.fee = BigInt.fromI32(0)
  draw.state = 'Open'
  draw.feeBeneficiary = event.params.feeBeneficiary
  draw.secretHash = event.params.secretHash
  draw.feeFraction = event.params.feeFraction

  draw.save()
}

export function handleCommitted(event: Committed): void {
  let draw = new Draw(event.params.drawId.toString())
  draw.state = 'Committed'
  draw.save()
}

export function handleRewarded(event: Rewarded): void {
  let draw = new Draw(event.params.drawId.toString())
  
  draw.state = 'Rewarded'
  draw.winner = event.params.winner
  draw.winnings = event.params.winnings
  draw.fee = event.params.fee
  draw.entropy = event.params.entropy

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
