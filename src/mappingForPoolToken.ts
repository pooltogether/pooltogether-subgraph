import { Address } from "@graphprotocol/graph-ts"
import { log } from '@graphprotocol/graph-ts'
import {
  PoolToken,
  Approval,
  AuthorizedOperator,
  Burned,
  Minted,
  Redeemed,
  RevokedOperator,
  Sent,
  Transfer
} from "../generated/PoolToken"
import { loadOrCreatePlayer } from './helpers/loadOrCreatePlayer'
import { consolidateBalance } from './helpers/consolidateBalance'
import { loadOrCreatePoolTokenContract } from './helpers/loadOrCreatePoolTokenContract'

export function handleApproval(event: Approval): void {
}

export function handleAuthorizedOperator(event: AuthorizedOperator): void {}

export function handleBurned(event: Burned): void {}

export function handleMinted(event: Minted): void {}

export function handleRedeemed(event: Redeemed): void {}

export function handleRevokedOperator(event: RevokedOperator): void {}

export function handleSent(event: Sent): void {
  let saiPoolToken = loadOrCreatePoolTokenContract(event.address)
  if (saiPoolToken) {
    let poolToken = PoolToken.bind(event.address)
    let saiPlayer = loadOrCreatePlayer(event.params.from, poolToken.pool())
    consolidateBalance(saiPlayer)
    saiPlayer.consolidatedBalance = saiPlayer.consolidatedBalance.minus(event.params.amount)
    saiPlayer.save()
  }
}

export function handleTransfer(event: Transfer): void {}
