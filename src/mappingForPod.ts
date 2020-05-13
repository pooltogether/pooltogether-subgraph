import { BigInt, Address, store } from "@graphprotocol/graph-ts"
import {
  Pod
} from "../generated/DaiPod/Pod"
import {
  PendingDepositWithdrawn,
  Redeemed,
  RedeemedToPool,
  CollateralizationChanged,
  Deposited
} from "../generated/DaiPod/Pod"
import { loadOrCreatePodPlayer } from './helpers/loadOrCreatePodPlayer'
import { loadOrCreatePod } from './helpers/loadOrCreatePod'
// import { consolidateBalance } from './helpers/consolidateBalance'
// import { loadOrCreatePoolTokenContract } from './helpers/loadOrCreatePoolTokenContract'
// import { hasZeroTickets } from './helpers/hasZeroTickets'
// import { loadOrCreatePoolContract } from "./helpers/loadOrCreatePoolContract"
// import { depositCommitted } from "./helpers/depositCommitted"

const ONE = BigInt.fromI32(1)

// function withdraw(playerAddress: Address, poolAddress: Address, amount: BigInt): void { 
//   let player = loadOrCreatePlayer(playerAddress, poolAddress)
//   consolidateBalance(player)

//   let pool = loadOrCreatePoolContract(poolAddress)
//   let poolContract = MCDAwarePool.bind(poolAddress)
//   pool.committedBalance = poolContract.committedSupply()
//   pool.version = pool.version.plus(ONE)
//   pool.save()

//   player.consolidatedBalance = player.consolidatedBalance.minus(amount)

//   if (hasZeroTickets(player)) {
//     store.remove('Player', player.id)
//   } else {
//     player.version = player.version.plus(ONE)
//     player.save()
//   }
// }

// export function handleSent(event: Sent): void {
//   loadOrCreatePoolTokenContract(event.address)
//   let poolToken = PoolToken.bind(event.address)
//   let poolAddress = poolToken.pool()
//   withdraw(event.params.from, poolAddress, event.params.amount)
//   depositCommitted(event.params.to, poolAddress, event.params.amount)
// }

export function handlePendingDepositWithdrawn(event: PendingDepositWithdrawn): void {

}

export function handleRedeemed(event: Redeemed): void {

}

export function handleRedeemedToPool(event: RedeemedToPool): void {

}

export function handleCollateralizationChanged(event: CollateralizationChanged): void {

}

export function handleDeposited(event: Deposited): void {
  const podAddress = event.address
  const playerAddress = event.params.from

  let podPlayer = loadOrCreatePodPlayer(playerAddress, podAddress)

  let boundPod = Pod.bind(podAddress)
  const poolAddress = boundPod.pool()

  let pod = loadOrCreatePod(podAddress, poolAddress)
  pod.currentExchangeRateMantissa = boundPod.currentExchangeRateMantissa()
  pod.totalSupply = pod.totalSupply.plus(event.params.collateral)
  pod.version = pod.version.plus(ONE)
  pod.save()

  // podPlayer.podBalance = podPlayer.podBalance.plus(event.params.collateral)
  podPlayer.balance = boundPod.balanceOf(playerAddress)
  podPlayer.balanceUnderlying = boundPod.balanceOfUnderlying(playerAddress)
  podPlayer.pendingDeposit = boundPod.pendingDeposit(playerAddress)
  podPlayer.version = podPlayer.version.plus(ONE)

  podPlayer.save()
}
