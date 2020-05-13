import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
  PodPlayer
} from '../../generated/schema'

const ZERO = BigInt.fromI32(0)

function formatPlayerId(playerAddress: Address, podAddress: Address): string {
  return 'player-' + playerAddress.toHex() + '_pod-' + podAddress.toHex()
}

export function loadOrCreatePodPlayer(playerAddress: Address, podAddress: Address): PodPlayer {
  let podPlayerId = formatPlayerId(playerAddress, podAddress)
  let podPlayer = PodPlayer.load(podPlayerId)

  if (!podPlayer) {
    podPlayer = new PodPlayer(podPlayerId)
    podPlayer.address = playerAddress
    podPlayer.balance = ZERO
    podPlayer.balanceUnderlying = ZERO
    podPlayer.pendingDeposit = ZERO
    podPlayer.pod = podAddress.toHex()
    podPlayer.version = ZERO
  }

  return podPlayer as PodPlayer
}
