import { BigInt, Address, store } from "@graphprotocol/graph-ts"
import {
  // Pod
  Pod as GeneratedPod
} from "../generated/DaiPod/Pod"
import {
  PodPlayer
} from '../generated/schema'
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
import { loadOrCreatePodPlayer } from './helpers/loadOrCreatePodPlayer'
import { loadOrCreatePod } from './helpers/loadOrCreatePod'

const ONE = BigInt.fromI32(1)

export function loadPod(podAddress: Address): Pod {
  let boundPod = GeneratedPod.bind(podAddress)
  const poolAddress = boundPod.pool()

  let pod = loadOrCreatePod(podAddress, poolAddress)
  
  pod.currentExchangeRateMantissa = boundPod.currentExchangeRateMantissa()
  pod.version = pod.version.plus(ONE)
  pod.save()

  return pod
}

export function updatePodPlayer(playerAddress: Address, podPlayer: PodPlayer, boundPod: GeneratedPod): void {
  podPlayer.balance = boundPod.balanceOf(playerAddress)
  podPlayer.balanceUnderlying = boundPod.balanceOfUnderlying(playerAddress)
  podPlayer.pendingDeposit = boundPod.pendingDeposit(playerAddress)
  podPlayer.version = podPlayer.version.plus(ONE)

  podPlayer.save()
}

export function handlePendingDepositWithdrawn(event: PendingDepositWithdrawn): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  let podPlayer = loadOrCreatePodPlayer(playerAddress, podAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  let pod = loadPod(podAddress)
  pod.totalSupply = pod.totalSupply.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleRedeemed(event: Redeemed): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  let podPlayer = loadOrCreatePodPlayer(playerAddress, podAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  let pod = loadPod(podAddress)
  pod.totalSupply = pod.totalSupply.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleRedeemedToPool(event: RedeemedToPool): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  let podPlayer = loadOrCreatePodPlayer(playerAddress, podAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  let pod = loadPod(podAddress)
  pod.totalSupply = pod.totalSupply.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleCollateralizationChanged(event: CollateralizationChanged): void {

}

export function handleDeposited(event: Deposited): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  let podPlayer = loadOrCreatePodPlayer(playerAddress, podAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  let pod = loadPod(podAddress)
  pod.totalSupply = pod.totalSupply.plus(event.params.collateral) // 180 DAI
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}
