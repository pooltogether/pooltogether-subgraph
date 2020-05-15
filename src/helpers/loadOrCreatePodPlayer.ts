import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Pod,
  PodPlayer
} from '../../generated/schema'

const ONE = BigInt.fromI32(1)
const ZERO = BigInt.fromI32(0)

function formatPlayerId(playerAddress: Address, podAddress: Bytes): string {
  return 'player-' + playerAddress.toHex() + '_pod-' + podAddress.toHex()
}

export function loadOrCreatePodPlayer(pod: Pod, playerAddress: Address): PodPlayer {
  let podPlayerId = formatPlayerId(playerAddress, pod.address)
  let podPlayer = PodPlayer.load(podPlayerId)

  if (!podPlayer) {
    podPlayer = new PodPlayer(podPlayerId)
    podPlayer.address = playerAddress
    podPlayer.balance = ZERO
    podPlayer.balanceUnderlying = ZERO
    podPlayer.lastDeposit = ZERO
    podPlayer.lastDepositDrawId = ZERO
    podPlayer.pod = pod.address.toHex()
    podPlayer.version = ZERO
    podPlayer.save()

    pod.podPlayersCount = pod.podPlayersCount.plus(ONE)
    pod.version = pod.version.plus(ONE)
    pod.save()
  }

  return podPlayer as PodPlayer
}
