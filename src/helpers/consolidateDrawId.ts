import { BigInt } from "@graphprotocol/graph-ts"
import { Player } from "../../generated/schema";

const ZERO = BigInt.fromI32(0)

export function consolidateDrawId(player: Player, drawId: BigInt): void {
  if (player.firstDepositDrawId.equals(ZERO)) {
    player.firstDepositDrawId = drawId
  }
}