import { log, BigInt, Address, store } from "@graphprotocol/graph-ts"
import {
  Pod as ContractPod
} from "../generated/DaiPod/Pod"
import {
  Pod
} from '../generated/schema'
import {
  PendingDepositWithdrawn,
  Redeemed,
  RedeemedToPool,
  CollateralizationChanged,
  Deposited
} from "../generated/DaiPod/Pod"
import { loadOrCreatePod } from './helpers/loadOrCreatePod'
import { updatePod } from './helpers/updatePod'

function getPod(podAddress: Address): Pod {
  const boundPod = ContractPod.bind(podAddress)
  const poolAddress = boundPod.pool()

  const pod = loadOrCreatePod(podAddress, poolAddress)

  return pod
}

export function handlePendingDepositWithdrawn(event: PendingDepositWithdrawn): void {
  const podAddress = event.address
  let pod = getPod(podAddress)

  const newBalanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  updatePod(pod as Pod, event.params.from, newBalanceUnderlying)
}

export function handleRedeemed(event: Redeemed): void {
  const podAddress = event.address
  let pod = getPod(podAddress)

  const newBalanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  updatePod(pod as Pod, event.params.from, newBalanceUnderlying)
}

export function handleRedeemedToPool(event: RedeemedToPool): void {
  const podAddress = event.address
  let pod = getPod(podAddress)

  const newBalanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  updatePod(pod as Pod, event.params.from, newBalanceUnderlying)
}

export function handleCollateralizationChanged(event: CollateralizationChanged): void {
  // not implemented yet
}

export function handleDeposited(event: Deposited): void {
  const podAddress = event.address
  let pod = getPod(podAddress)

  const newBalanceUnderlying = pod.balanceUnderlying.plus(event.params.collateral)
  updatePod(pod as Pod, event.params.from, newBalanceUnderlying)
}
