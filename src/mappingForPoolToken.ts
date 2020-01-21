import { BigInt, Address, store } from "@graphprotocol/graph-ts"
import {
  MCDAwarePool
} from "../generated/PoolSai/MCDAwarePool"
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
import { hasZeroTickets } from './helpers/hasZeroTickets'
import { loadOrCreatePoolContract } from "./helpers/loadOrCreatePoolContract"

const ONE = BigInt.fromI32(1)

function withdraw(playerAddress: Address, poolAddress: Address, amount: BigInt): void { 
  let player = loadOrCreatePlayer(playerAddress, poolAddress)
  consolidateBalance(player)

  let pool = loadOrCreatePoolContract(poolAddress)
  let poolContract = MCDAwarePool.bind(poolAddress)
  pool.committedBalance = poolContract.committedSupply()
  pool.version = pool.version.plus(ONE)
  pool.save()

  if (hasZeroTickets(player)) {
    store.remove('Player', player.id)
  } else {
    player.consolidatedBalance = player.consolidatedBalance.minus(amount)
    player.version = player.version.plus(ONE)
    player.save()
  }
}

export function handleApproval(event: Approval): void {
}

export function handleAuthorizedOperator(event: AuthorizedOperator): void {}

export function handleBurned(event: Burned): void {}

export function handleMinted(event: Minted): void {}

export function handleRedeemed(event: Redeemed): void {
}

export function handleRevokedOperator(event: RevokedOperator): void {}

export function handleSent(event: Sent): void {
  loadOrCreatePoolTokenContract(event.address)
  let poolToken = PoolToken.bind(event.address)
  withdraw(event.params.from, poolToken.pool(), event.params.amount)
}

export function handleTransfer(event: Transfer): void {}
