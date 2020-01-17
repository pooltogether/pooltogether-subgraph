import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { store, log } from '@graphprotocol/graph-ts'
import {
  AdminAdded,
  AdminRemoved,
  Committed,
  CommittedDepositWithdrawn,
  Deposited,
  DepositedAndCommitted,
  FeeCollected,
  NextFeeBeneficiaryChanged,
  NextFeeFractionChanged,
  OpenDepositWithdrawn,
  Opened,
  Paused,
  Rewarded,
  RolledOver,
  SponsorshipAndFeesWithdrawn,
  SponsorshipDeposited,
  Unpaused,
  Withdrawn
} from "../generated/MCDAwarePool"
import {
  PoolContract,
  Draw,
  Admin
} from '../generated/schema'
import { loadOrCreatePlayer } from './helpers/loadOrCreatePlayer'
import { consolidateBalance } from './helpers/consolidateBalance'
import { loadOrCreatePoolContract } from './helpers/loadOrCreatePoolContract'
import { hasZeroTickets } from './helpers/hasZeroTickets'

const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)

function formatDrawEntityId(poolAddress: Address, drawId: BigInt): string {
  return poolAddress.toHex() + '-' + drawId.toString()
}

function formatAdminEntityId(poolAddress: Address, adminAddress: Address): string {
  return poolAddress.toHex() + '-' + adminAddress.toHex()
}

export function handleAdminAdded(event: AdminAdded): void {
  let adminEntityId = formatAdminEntityId(event.address, event.params.admin)
  let admin = new Admin(adminEntityId)
  admin.addedAt = event.block.timestamp
  admin.address = event.params.admin

  let poolContract = loadOrCreatePoolContract(event.address)
  admin.poolContract = poolContract.id
  admin.save()
}

export function handleAdminRemoved(event: AdminRemoved): void {
  let adminEntityId = formatAdminEntityId(event.address, event.params.admin)
  store.remove('Admin', adminEntityId)
}

export function handleCommitted(event: Committed): void {
  const openDrawEntityId = formatDrawEntityId(event.address, event.params.drawId)
  const openDraw = Draw.load(openDrawEntityId)

  let poolContract = loadOrCreatePoolContract(event.address)
  poolContract.committedDrawId = openDraw.drawId
  poolContract.save()

  openDraw.state = 'Committed'
  openDraw.committedAt = event.block.timestamp
  openDraw.committedAtBlock = event.block.number
  openDraw.save()
}

export function handleCommittedDepositWithdrawn(
  event: CommittedDepositWithdrawn
): void {
}

export function handleDeposited(event: Deposited): void {
  let player = loadOrCreatePlayer(event.params.sender, event.address)
  consolidateBalance(player)
  
  let pool = PoolContract.load(event.address.toHex())
  pool.openBalance = pool.openBalance.plus(event.params.amount)
  if (hasZeroTickets(player)) {
    pool.playersCount = pool.playersCount.plus(ONE)
  }
  pool.save()

  player.latestBalance = player.latestBalance.plus(event.params.amount)
  player.latestDrawId = pool.openDrawId
  player.save()
}

export function handleDepositedAndCommitted(
  event: DepositedAndCommitted
): void {
  let player = loadOrCreatePlayer(event.params.sender, event.address)
  consolidateBalance(player)

  let pool = PoolContract.load(event.address.toHex())
  pool.committedBalance = pool.committedBalance.plus(event.params.amount)
  if (hasZeroTickets(player)) {
    pool.playersCount = pool.playersCount.plus(ONE)
  }
  pool.save()

  player.consolidatedBalance = player.consolidatedBalance.plus(event.params.amount)
  player.save()
}

export function handleFeeCollected(event: FeeCollected): void {
}

export function handleNextFeeBeneficiaryChanged(
  event: NextFeeBeneficiaryChanged
): void {}

export function handleNextFeeFractionChanged(
  event: NextFeeFractionChanged
): void {}

export function handleOpenDepositWithdrawn(event: OpenDepositWithdrawn): void {
}

export function handleOpened(event: Opened): void {
  const drawEntityId = formatDrawEntityId(event.address, event.params.drawId)
  const draw = new Draw(drawEntityId)

  let poolContract = loadOrCreatePoolContract(event.address, false)
  poolContract.drawsCount = poolContract.drawsCount.plus(ONE)
  poolContract.openDrawId = event.params.drawId
  poolContract.committedBalance = poolContract.committedBalance.plus(poolContract.openBalance)
  poolContract.openBalance = ZERO
  poolContract.save()

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
  draw.openedAtBlock = event.block.number
  draw.committedAt = ZERO
  draw.committedAtBlock = ZERO
  draw.rewardedAt = ZERO
  draw.rewardedAtBlock = ZERO
  draw.poolContract = poolContract.id
  draw.balance = ZERO
  draw.playersCount = ZERO
  
  draw.save()
}

export function handlePaused(event: Paused): void {
  let poolContract = loadOrCreatePoolContract(event.address, false)
  poolContract.paused = true
  poolContract.save()
}

export function handleRewarded(event: Rewarded): void {
  let pool = PoolContract.load(event.address.toHex())
  pool.sponsorshipAndFeeBalance = pool.sponsorshipAndFeeBalance.plus(event.params.fee)
  pool.committedBalance = pool.committedBalance.plus(event.params.winnings)
  pool.save()

  let winner = loadOrCreatePlayer(event.params.winner, event.address)
  winner.consolidatedBalance = winner.consolidatedBalance.plus(event.params.winnings)
  winner.save()

  const committedDraw = Draw.load(
    formatDrawEntityId(event.address, event.params.drawId)
  )

  committedDraw.state = 'Rewarded'
  committedDraw.winner = event.params.winner
  committedDraw.winnings = event.params.winnings
  committedDraw.fee = event.params.fee
  committedDraw.entropy = event.params.entropy
  committedDraw.rewardedAt = event.block.timestamp
  committedDraw.rewardedAtBlock = event.block.number

  committedDraw.save()

  let player = loadOrCreatePlayer(Address.fromString(committedDraw.feeBeneficiary.toHex()), event.address)
  player.sponsorshipAndFeeBalance = player.sponsorshipAndFeeBalance.plus(event.params.fee)
  player.save()
}

export function handleRolledOver(event: RolledOver): void {
  const committedDraw = Draw.load(
    formatDrawEntityId(event.address, event.params.drawId)
  )

  committedDraw.state = 'Rewarded'
  committedDraw.entropy = Bytes.fromI32(1) as Bytes
  committedDraw.rewardedAt = event.block.timestamp
  committedDraw.rewardedAtBlock = event.block.number

  committedDraw.save()
}

export function handleSponsorshipAndFeesWithdrawn(
  event: SponsorshipAndFeesWithdrawn
): void {
}

export function handleSponsorshipDeposited(event: SponsorshipDeposited): void {
  let pool = PoolContract.load(event.address.toHex())
  pool.sponsorshipAndFeeBalance = pool.sponsorshipAndFeeBalance.plus(event.params.amount)
  pool.save()

  let player = loadOrCreatePlayer(event.params.sender, event.address)
  player.sponsorshipAndFeeBalance = player.sponsorshipAndFeeBalance.plus(event.params.amount)
  player.save()
}

export function handleUnpaused(event: Unpaused): void {
  let poolContract = loadOrCreatePoolContract(event.address, false)
  poolContract.paused = false
  poolContract.save()
}

export function handleWithdrawn(event: Withdrawn): void {
  let player = loadOrCreatePlayer(event.params.sender, event.address)
  consolidateBalance(player)

  let pool = PoolContract.load(event.address.toHex())
  if (!hasZeroTickets(player)) {
    pool.playersCount = pool.playersCount.minus(ONE)
  }
  pool.openBalance = pool.openBalance.minus(player.latestBalance)
  pool.committedBalance = pool.committedBalance.minus(player.consolidatedBalance)
  pool.sponsorshipAndFeeBalance = pool.sponsorshipAndFeeBalance.minus(player.sponsorshipAndFeeBalance)
  pool.save()

  player.latestDrawId = ZERO
  player.latestBalance = ZERO
  player.consolidatedBalance = ZERO
  player.sponsorshipAndFeeBalance = ZERO
  player.save()
}
