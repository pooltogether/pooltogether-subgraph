import { BigInt } from "@graphprotocol/graph-ts"
import {
  PoolContract, 
  Player
} from '../../generated/schema'

const ZERO = BigInt.fromI32(0)

export function consolidateBalance(player: Player): void {
  let pool = PoolContract.load(player.poolContract)
  if (pool.openDrawId > player.latestDrawId) {
    player.consolidatedBalance = player.consolidatedBalance.plus(player.latestBalance)
    player.latestBalance = ZERO
    player.latestDrawId = ZERO
  }
}
