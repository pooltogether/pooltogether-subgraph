import { BigInt, Address, store } from "@graphprotocol/graph-ts"
import { store, log } from '@graphprotocol/graph-ts'
import {
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

const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)

export function loadPod(podAddress: Address): Pod {
  let boundPod = GeneratedPod.bind(podAddress)
  const poolAddress = boundPod.pool()

  let pod = loadOrCreatePod(podAddress, poolAddress)
  
  pod.totalPendingDeposits = boundPod.totalPendingDeposits()
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

  if (podPlayer.balanceUnderlying.equals(ZERO)) {
    store.remove('PodPlayer', podPlayer.id)

    const pod = Pod.load(podPlayer.pod)
    pod.podPlayersCount = pod.podPlayersCount.minus(ONE)
    pod.save()
  } else {
    podPlayer.save()
  }
}

export function handlePendingDepositWithdrawn(event: PendingDepositWithdrawn): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  
  let pod = loadPod(podAddress)
  let podPlayer = loadOrCreatePodPlayer(pod, playerAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  pod.balanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleRedeemed(event: Redeemed): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  
  let pod = loadPod(podAddress)
  let podPlayer = loadOrCreatePodPlayer(pod, playerAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  pod.balanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleRedeemedToPool(event: RedeemedToPool): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  
  let pod = loadPod(podAddress)
  let podPlayer = loadOrCreatePodPlayer(pod, playerAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  pod.balanceUnderlying = pod.balanceUnderlying.minus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}

export function handleCollateralizationChanged(event: CollateralizationChanged): void {
  // not implemented yet
}

export function handleDeposited(event: Deposited): void {
  const podAddress = event.address
  const playerAddress = event.params.from
  
  let pod = loadPod(podAddress)
  let podPlayer = loadOrCreatePodPlayer(pod, playerAddress)
  let boundPod = GeneratedPod.bind(podAddress)

  pod.balanceUnderlying = pod.balanceUnderlying.plus(event.params.collateral)
  pod.save()

  updatePodPlayer(event.params.from, podPlayer, boundPod)
}
