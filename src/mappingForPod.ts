import { log, BigInt, Address, store } from "@graphprotocol/graph-ts"
import {
  Pod as ContractPod
} from "../generated/DaiPod/Pod"
import {
  CollateralizationEvent,
  Pod,
} from '../generated/schema'
import {
  PendingDepositWithdrawn,
  Redeemed,
  RedeemedToPool,
  CollateralizationChanged,
  Deposited
} from "../generated/DaiPod/Pod"
import { loadOrCreatePod } from './helpers/loadOrCreatePod'
import { loadOrCreatePodPlayer } from './helpers/loadOrCreatePodPlayer'
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
  const collateralizationEventId = 'pod-' + event.address.toHex() + '-collateralizationEvent-' + event.params.timestamp.toHex()
  const collateralizationEvent = new CollateralizationEvent(collateralizationEventId)

  collateralizationEvent.pod = event.address.toHex()
  collateralizationEvent.block = event.block.number
  
  collateralizationEvent.createdAt = event.params.timestamp
  collateralizationEvent.tokenSupply = event.params.tokens
  collateralizationEvent.collateral = event.params.collateral
  collateralizationEvent.exchangeRateMantissa = event.params.mantissa

  collateralizationEvent.save()
}

export function handleDeposited(event: Deposited): void {
  const podAddress = event.address
  let pod = getPod(podAddress)

  const newBalanceUnderlying = pod.balanceUnderlying.plus(event.params.collateral)
  updatePod(pod as Pod, event.params.from, newBalanceUnderlying)

  const podPlayer = loadOrCreatePodPlayer(pod, event.params.from)
  podPlayer.lastDeposit = event.params.collateral
  podPlayer.lastDepositDrawId = event.params.drawId
  podPlayer.save()
}
