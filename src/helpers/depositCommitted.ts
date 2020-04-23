import { BigInt, Address, store } from "@graphprotocol/graph-ts"
import { consolidateBalance } from './consolidateBalance'
import { loadOrCreatePlayer } from './loadOrCreatePlayer'

const ONE = BigInt.fromI32(1)

export function depositCommitted(playerAddress: Address, poolAddress: Address, amount: BigInt): void {
  let player = loadOrCreatePlayer(playerAddress, poolAddress)
  consolidateBalance(player)
  player.consolidatedBalance = player.consolidatedBalance.plus(amount)
  player.version = player.version.plus(ONE)
  player.save()
}
