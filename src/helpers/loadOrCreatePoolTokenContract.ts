import { Address } from "@graphprotocol/graph-ts"
import {
  PoolToken
} from "../../generated/PoolToken"
import {
  PoolTokenContract
} from '../../generated/schema'
import { loadOrCreatePoolContract } from './loadOrCreatePoolContract'

export function loadOrCreatePoolTokenContract(poolTokenAddress: Address): PoolTokenContract {
  let poolTokenContract = PoolTokenContract.load(poolTokenAddress.toHex())
  if (!poolTokenContract) {
    let poolTokenContract = new PoolTokenContract(poolTokenAddress.toHex())
    let poolToken = PoolToken.bind(poolTokenAddress)
    poolTokenContract.name = poolToken.name()
    poolTokenContract.symbol = poolToken.symbol()
    poolTokenContract.save()

    let poolContract = loadOrCreatePoolContract(poolToken.pool())
    poolContract.poolToken = poolTokenContract.id
    poolContract.save()
  }
  return poolTokenContract as PoolTokenContract
}