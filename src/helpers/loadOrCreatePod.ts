import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Pod, PoolContract
} from '../../generated/schema'

const ZERO = BigInt.fromI32(0)

export function loadOrCreatePod(podAddress: Address, poolAddress: Address): Pod {
  const podId = podAddress.toHex()
  let pod = Pod.load(podId)
  // let poolContract = PoolContract.load(poolAddress.toHex())
  if (!pod) {
    pod = new Pod(podId)
    // pod.drawsCount = ZERO
    pod.totalSupply = ZERO
    pod.poolContract = poolAddress.toHex()
    pod.version = ZERO

    pod.save()
  }
  return pod as Pod
}
