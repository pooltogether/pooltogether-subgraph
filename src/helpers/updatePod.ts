import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Pod as ContractPod
} from '../../generated/DaiPod/Pod'
import {
  Pod
} from '../../generated/schema'
import { loadOrCreatePodPlayer } from './loadOrCreatePodPlayer'
import { updatePodPlayer } from './updatePodPlayer'

const ONE = BigInt.fromI32(1)

export function updatePod(pod: Pod, playerAddress: Address, newBalanceUnderlying: BigInt): void {
  const podPlayer = loadOrCreatePodPlayer(pod, playerAddress)
  const podAddress = Address.fromString(pod.address.toHex())
  const boundPod = ContractPod.bind(podAddress)

  pod.totalPendingDeposits = boundPod.totalPendingDeposits()
  pod.currentExchangeRateMantissa = boundPod.currentExchangeRateMantissa()
  pod.version = pod.version.plus(ONE)
  
  pod.balanceUnderlying = newBalanceUnderlying
  pod.save()

  updatePodPlayer(podPlayer, boundPod)
}
