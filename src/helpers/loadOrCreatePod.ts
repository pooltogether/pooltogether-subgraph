import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Pod
} from '../../generated/schema'

const ZERO = BigInt.fromI32(0)

export function loadOrCreatePod(podAddress: Address, poolAddress: Address): Pod {
  const podId = podAddress.toHex()
  let pod = Pod.load(podId)

  if (!pod) {
    pod = new Pod(podId)
    pod.currentExchangeRateMantissa = ZERO
    pod.balanceUnderlying = ZERO
    pod.poolContract = poolAddress.toHex()
    pod.version = ZERO

    pod.save()
  }

  return pod as Pod
}
