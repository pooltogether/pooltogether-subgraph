import { Address, BigInt, store } from "@graphprotocol/graph-ts"
import {
  Pod as ContractPod
} from "../../generated/DaiPod/Pod"
import {
  Pod,
  PodPlayer
} from '../../generated/schema'

const ZERO = BigInt.fromI32(0)
const ONE = BigInt.fromI32(1)

export function updatePodPlayer(podPlayer: PodPlayer, boundPod: ContractPod): void {
  const playerAddress = Address.fromString(podPlayer.address.toHex())
  podPlayer.balance = boundPod.balanceOf(playerAddress)
  podPlayer.balanceUnderlying = boundPod.balanceOfUnderlying(playerAddress)
  podPlayer.pendingDeposit = boundPod.pendingDeposit(playerAddress)

  if (podPlayer.balanceUnderlying.equals(ZERO)) {
    store.remove('PodPlayer', podPlayer.id)

    const pod = Pod.load(podPlayer.pod)
    pod.podPlayersCount = pod.podPlayersCount.minus(ONE)
  
    pod.version = pod.version.plus(ONE)
    pod.save()
  } else {
    podPlayer.version = podPlayer.version.plus(ONE)
    podPlayer.save()
  }
}
