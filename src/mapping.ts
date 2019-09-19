import { BigInt } from "@graphprotocol/graph-ts"
import {
  Contract,
  Deposited,
  SponsorshipDeposited,
  AdminAdded,
  AdminRemoved,
  Withdrawn,
  Opened,
  Committed,
  Rewarded,
  NextFeeFractionChanged,
  NextFeeBeneficiaryChanged,
  Paused,
  Unpaused
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleDeposited(event: Deposited): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.sender = event.params.sender
  entity.amount = event.params.amount

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.accountedBalance(...)
  // - contract.nextFeeFraction(...)
  // - contract.isAdmin(...)
  // - contract.currentOpenDrawId(...)
  // - contract.openSupply(...)
  // - contract.openBalanceOf(...)
  // - contract.paused(...)
  // - contract.cToken(...)
  // - contract.balanceOf(...)
  // - contract.estimatedInterestRate(...)
  // - contract.committedBalanceOf(...)
  // - contract.currentCommittedDrawId(...)
  // - contract.nextFeeBeneficiary(...)
  // - contract.calculateWinner(...)
  // - contract.supplyRatePerBlock(...)
  // - contract.balance(...)
  // - contract.getDraw(...)
  // - contract.committedSupply(...)
}

export function handleSponsorshipDeposited(event: SponsorshipDeposited): void {}

export function handleAdminAdded(event: AdminAdded): void {}

export function handleAdminRemoved(event: AdminRemoved): void {}

export function handleWithdrawn(event: Withdrawn): void {}

export function handleOpened(event: Opened): void {}

export function handleCommitted(event: Committed): void {}

export function handleRewarded(event: Rewarded): void {}

export function handleNextFeeFractionChanged(
  event: NextFeeFractionChanged
): void {}

export function handleNextFeeBeneficiaryChanged(
  event: NextFeeBeneficiaryChanged
): void {}

export function handlePaused(event: Paused): void {}

export function handleUnpaused(event: Unpaused): void {}
