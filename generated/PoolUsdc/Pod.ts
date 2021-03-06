// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class Approval extends ethereum.Event {
  get params(): Approval__Params {
    return new Approval__Params(this);
  }
}

export class Approval__Params {
  _event: Approval;

  constructor(event: Approval) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get spender(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class AuthorizedOperator extends ethereum.Event {
  get params(): AuthorizedOperator__Params {
    return new AuthorizedOperator__Params(this);
  }
}

export class AuthorizedOperator__Params {
  _event: AuthorizedOperator;

  constructor(event: AuthorizedOperator) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenHolder(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Burned extends ethereum.Event {
  get params(): Burned__Params {
    return new Burned__Params(this);
  }
}

export class Burned__Params {
  _event: Burned;

  constructor(event: Burned) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class CollateralizationChanged extends ethereum.Event {
  get params(): CollateralizationChanged__Params {
    return new CollateralizationChanged__Params(this);
  }
}

export class CollateralizationChanged__Params {
  _event: CollateralizationChanged;

  constructor(event: CollateralizationChanged) {
    this._event = event;
  }

  get timestamp(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get tokens(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collateral(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get mantissa(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Deposited extends ethereum.Event {
  get params(): Deposited__Params {
    return new Deposited__Params(this);
  }
}

export class Deposited__Params {
  _event: Deposited;

  constructor(event: Deposited) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get collateral(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get drawId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }
}

export class Minted extends ethereum.Event {
  get params(): Minted__Params {
    return new Minted__Params(this);
  }
}

export class Minted__Params {
  _event: Minted;

  constructor(event: Minted) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class PendingDepositWithdrawn extends ethereum.Event {
  get params(): PendingDepositWithdrawn__Params {
    return new PendingDepositWithdrawn__Params(this);
  }
}

export class PendingDepositWithdrawn__Params {
  _event: PendingDepositWithdrawn;

  constructor(event: PendingDepositWithdrawn) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get collateral(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class Redeemed extends ethereum.Event {
  get params(): Redeemed__Params {
    return new Redeemed__Params(this);
  }
}

export class Redeemed__Params {
  _event: Redeemed;

  constructor(event: Redeemed) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get collateral(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }
}

export class RedeemedToPool extends ethereum.Event {
  get params(): RedeemedToPool__Params {
    return new RedeemedToPool__Params(this);
  }
}

export class RedeemedToPool__Params {
  _event: RedeemedToPool;

  constructor(event: RedeemedToPool) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get collateral(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }
}

export class RevokedOperator extends ethereum.Event {
  get params(): RevokedOperator__Params {
    return new RevokedOperator__Params(this);
  }
}

export class RevokedOperator__Params {
  _event: RevokedOperator;

  constructor(event: RevokedOperator) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenHolder(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Sent extends ethereum.Event {
  get params(): Sent__Params {
    return new Sent__Params(this);
  }
}

export class Sent__Params {
  _event: Sent;

  constructor(event: Sent) {
    this._event = event;
  }

  get operator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get from(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get data(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }
}

export class Transfer extends ethereum.Event {
  get params(): Transfer__Params {
    return new Transfer__Params(this);
  }
}

export class Transfer__Params {
  _event: Transfer;

  constructor(event: Transfer) {
    this._event = event;
  }

  get from(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get value(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Pod extends ethereum.SmartContract {
  static bind(address: Address): Pod {
    return new Pod("Pod", address);
  }

  allowance(holder: Address, spender: Address): BigInt {
    let result = super.call(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(holder), ethereum.Value.fromAddress(spender)]
    );

    return result[0].toBigInt();
  }

  try_allowance(
    holder: Address,
    spender: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "allowance",
      "allowance(address,address):(uint256)",
      [ethereum.Value.fromAddress(holder), ethereum.Value.fromAddress(spender)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  approve(spender: Address, value: BigInt): boolean {
    let result = super.call("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(value)
    ]);

    return result[0].toBoolean();
  }

  try_approve(spender: Address, value: BigInt): ethereum.CallResult<boolean> {
    let result = super.tryCall("approve", "approve(address,uint256):(bool)", [
      ethereum.Value.fromAddress(spender),
      ethereum.Value.fromUnsignedBigInt(value)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  decimals(): i32 {
    let result = super.call("decimals", "decimals():(uint8)", []);

    return result[0].toI32();
  }

  try_decimals(): ethereum.CallResult<i32> {
    let result = super.tryCall("decimals", "decimals():(uint8)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  defaultOperators(): Array<Address> {
    let result = super.call(
      "defaultOperators",
      "defaultOperators():(address[])",
      []
    );

    return result[0].toAddressArray();
  }

  try_defaultOperators(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "defaultOperators",
      "defaultOperators():(address[])",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  granularity(): BigInt {
    let result = super.call("granularity", "granularity():(uint256)", []);

    return result[0].toBigInt();
  }

  try_granularity(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("granularity", "granularity():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  isOperatorFor(operator: Address, tokenHolder: Address): boolean {
    let result = super.call(
      "isOperatorFor",
      "isOperatorFor(address,address):(bool)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(tokenHolder)
      ]
    );

    return result[0].toBoolean();
  }

  try_isOperatorFor(
    operator: Address,
    tokenHolder: Address
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isOperatorFor",
      "isOperatorFor(address,address):(bool)",
      [
        ethereum.Value.fromAddress(operator),
        ethereum.Value.fromAddress(tokenHolder)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  name(): string {
    let result = super.call("name", "name():(string)", []);

    return result[0].toString();
  }

  try_name(): ethereum.CallResult<string> {
    let result = super.tryCall("name", "name():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  pool(): Address {
    let result = super.call("pool", "pool():(address)", []);

    return result[0].toAddress();
  }

  try_pool(): ethereum.CallResult<Address> {
    let result = super.tryCall("pool", "pool():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  symbol(): string {
    let result = super.call("symbol", "symbol():(string)", []);

    return result[0].toString();
  }

  try_symbol(): ethereum.CallResult<string> {
    let result = super.tryCall("symbol", "symbol():(string)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toString());
  }

  balanceOfUnderlying(user: Address): BigInt {
    let result = super.call(
      "balanceOfUnderlying",
      "balanceOfUnderlying(address):(uint256)",
      [ethereum.Value.fromAddress(user)]
    );

    return result[0].toBigInt();
  }

  try_balanceOfUnderlying(user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "balanceOfUnderlying",
      "balanceOfUnderlying(address):(uint256)",
      [ethereum.Value.fromAddress(user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  pendingDeposit(user: Address): BigInt {
    let result = super.call(
      "pendingDeposit",
      "pendingDeposit(address):(uint256)",
      [ethereum.Value.fromAddress(user)]
    );

    return result[0].toBigInt();
  }

  try_pendingDeposit(user: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "pendingDeposit",
      "pendingDeposit(address):(uint256)",
      [ethereum.Value.fromAddress(user)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalPendingDeposits(): BigInt {
    let result = super.call(
      "totalPendingDeposits",
      "totalPendingDeposits():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalPendingDeposits(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalPendingDeposits",
      "totalPendingDeposits():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  balanceOf(tokenHolder: Address): BigInt {
    let result = super.call("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(tokenHolder)
    ]);

    return result[0].toBigInt();
  }

  try_balanceOf(tokenHolder: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("balanceOf", "balanceOf(address):(uint256)", [
      ethereum.Value.fromAddress(tokenHolder)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  totalSupply(): BigInt {
    let result = super.call("totalSupply", "totalSupply():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalSupply(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalSupply", "totalSupply():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  transfer(recipient: Address, amount: BigInt): boolean {
    let result = super.call("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);

    return result[0].toBoolean();
  }

  try_transfer(
    recipient: Address,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall("transfer", "transfer(address,uint256):(bool)", [
      ethereum.Value.fromAddress(recipient),
      ethereum.Value.fromUnsignedBigInt(amount)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transferFrom(sender: Address, recipient: Address, amount: BigInt): boolean {
    let result = super.call(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );

    return result[0].toBoolean();
  }

  try_transferFrom(
    sender: Address,
    recipient: Address,
    amount: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "transferFrom",
      "transferFrom(address,address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(sender),
        ethereum.Value.fromAddress(recipient),
        ethereum.Value.fromUnsignedBigInt(amount)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  currentExchangeRateMantissa(): BigInt {
    let result = super.call(
      "currentExchangeRateMantissa",
      "currentExchangeRateMantissa():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_currentExchangeRateMantissa(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "currentExchangeRateMantissa",
      "currentExchangeRateMantissa():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tokenToCollateralValue(tokens: BigInt): BigInt {
    let result = super.call(
      "tokenToCollateralValue",
      "tokenToCollateralValue(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(tokens)]
    );

    return result[0].toBigInt();
  }

  try_tokenToCollateralValue(tokens: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "tokenToCollateralValue",
      "tokenToCollateralValue(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(tokens)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  collateralToTokenValue(collateral: BigInt): BigInt {
    let result = super.call(
      "collateralToTokenValue",
      "collateralToTokenValue(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(collateral)]
    );

    return result[0].toBigInt();
  }

  try_collateralToTokenValue(collateral: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "collateralToTokenValue",
      "collateralToTokenValue(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(collateral)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ApproveCall extends ethereum.Call {
  get inputs(): ApproveCall__Inputs {
    return new ApproveCall__Inputs(this);
  }

  get outputs(): ApproveCall__Outputs {
    return new ApproveCall__Outputs(this);
  }
}

export class ApproveCall__Inputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get spender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class ApproveCall__Outputs {
  _call: ApproveCall;

  constructor(call: ApproveCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class AuthorizeOperatorCall extends ethereum.Call {
  get inputs(): AuthorizeOperatorCall__Inputs {
    return new AuthorizeOperatorCall__Inputs(this);
  }

  get outputs(): AuthorizeOperatorCall__Outputs {
    return new AuthorizeOperatorCall__Outputs(this);
  }
}

export class AuthorizeOperatorCall__Inputs {
  _call: AuthorizeOperatorCall;

  constructor(call: AuthorizeOperatorCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class AuthorizeOperatorCall__Outputs {
  _call: AuthorizeOperatorCall;

  constructor(call: AuthorizeOperatorCall) {
    this._call = call;
  }
}

export class RevokeOperatorCall extends ethereum.Call {
  get inputs(): RevokeOperatorCall__Inputs {
    return new RevokeOperatorCall__Inputs(this);
  }

  get outputs(): RevokeOperatorCall__Outputs {
    return new RevokeOperatorCall__Outputs(this);
  }
}

export class RevokeOperatorCall__Inputs {
  _call: RevokeOperatorCall;

  constructor(call: RevokeOperatorCall) {
    this._call = call;
  }

  get operator(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class RevokeOperatorCall__Outputs {
  _call: RevokeOperatorCall;

  constructor(call: RevokeOperatorCall) {
    this._call = call;
  }
}

export class InitializeCall extends ethereum.Call {
  get inputs(): InitializeCall__Inputs {
    return new InitializeCall__Inputs(this);
  }

  get outputs(): InitializeCall__Outputs {
    return new InitializeCall__Outputs(this);
  }
}

export class InitializeCall__Inputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }

  get _pool(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitializeCall__Outputs {
  _call: InitializeCall;

  constructor(call: InitializeCall) {
    this._call = call;
  }
}

export class Initialize1Call extends ethereum.Call {
  get inputs(): Initialize1Call__Inputs {
    return new Initialize1Call__Inputs(this);
  }

  get outputs(): Initialize1Call__Outputs {
    return new Initialize1Call__Outputs(this);
  }
}

export class Initialize1Call__Inputs {
  _call: Initialize1Call;

  constructor(call: Initialize1Call) {
    this._call = call;
  }
}

export class Initialize1Call__Outputs {
  _call: Initialize1Call;

  constructor(call: Initialize1Call) {
    this._call = call;
  }
}

export class Initialize2Call extends ethereum.Call {
  get inputs(): Initialize2Call__Inputs {
    return new Initialize2Call__Inputs(this);
  }

  get outputs(): Initialize2Call__Outputs {
    return new Initialize2Call__Outputs(this);
  }
}

export class Initialize2Call__Inputs {
  _call: Initialize2Call;

  constructor(call: Initialize2Call) {
    this._call = call;
  }

  get name(): string {
    return this._call.inputValues[0].value.toString();
  }

  get symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get defaultOperators(): Array<Address> {
    return this._call.inputValues[2].value.toAddressArray();
  }
}

export class Initialize2Call__Outputs {
  _call: Initialize2Call;

  constructor(call: Initialize2Call) {
    this._call = call;
  }
}

export class OperatorDepositCall extends ethereum.Call {
  get inputs(): OperatorDepositCall__Inputs {
    return new OperatorDepositCall__Inputs(this);
  }

  get outputs(): OperatorDepositCall__Outputs {
    return new OperatorDepositCall__Outputs(this);
  }
}

export class OperatorDepositCall__Inputs {
  _call: OperatorDepositCall;

  constructor(call: OperatorDepositCall) {
    this._call = call;
  }

  get user(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OperatorDepositCall__Outputs {
  _call: OperatorDepositCall;

  constructor(call: OperatorDepositCall) {
    this._call = call;
  }
}

export class DepositCall extends ethereum.Call {
  get inputs(): DepositCall__Inputs {
    return new DepositCall__Inputs(this);
  }

  get outputs(): DepositCall__Outputs {
    return new DepositCall__Outputs(this);
  }
}

export class DepositCall__Inputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class DepositCall__Outputs {
  _call: DepositCall;

  constructor(call: DepositCall) {
    this._call = call;
  }
}

export class TokensReceivedCall extends ethereum.Call {
  get inputs(): TokensReceivedCall__Inputs {
    return new TokensReceivedCall__Inputs(this);
  }

  get outputs(): TokensReceivedCall__Outputs {
    return new TokensReceivedCall__Outputs(this);
  }
}

export class TokensReceivedCall__Inputs {
  _call: TokensReceivedCall;

  constructor(call: TokensReceivedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get from(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get value2(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get value4(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }

  get value5(): Bytes {
    return this._call.inputValues[5].value.toBytes();
  }
}

export class TokensReceivedCall__Outputs {
  _call: TokensReceivedCall;

  constructor(call: TokensReceivedCall) {
    this._call = call;
  }
}

export class OperatorWithdrawPendingDepositCall extends ethereum.Call {
  get inputs(): OperatorWithdrawPendingDepositCall__Inputs {
    return new OperatorWithdrawPendingDepositCall__Inputs(this);
  }

  get outputs(): OperatorWithdrawPendingDepositCall__Outputs {
    return new OperatorWithdrawPendingDepositCall__Outputs(this);
  }
}

export class OperatorWithdrawPendingDepositCall__Inputs {
  _call: OperatorWithdrawPendingDepositCall;

  constructor(call: OperatorWithdrawPendingDepositCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OperatorWithdrawPendingDepositCall__Outputs {
  _call: OperatorWithdrawPendingDepositCall;

  constructor(call: OperatorWithdrawPendingDepositCall) {
    this._call = call;
  }
}

export class WithdrawAndRedeemCollateralCall extends ethereum.Call {
  get inputs(): WithdrawAndRedeemCollateralCall__Inputs {
    return new WithdrawAndRedeemCollateralCall__Inputs(this);
  }

  get outputs(): WithdrawAndRedeemCollateralCall__Outputs {
    return new WithdrawAndRedeemCollateralCall__Outputs(this);
  }
}

export class WithdrawAndRedeemCollateralCall__Inputs {
  _call: WithdrawAndRedeemCollateralCall;

  constructor(call: WithdrawAndRedeemCollateralCall) {
    this._call = call;
  }

  get collateral(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class WithdrawAndRedeemCollateralCall__Outputs {
  _call: WithdrawAndRedeemCollateralCall;

  constructor(call: WithdrawAndRedeemCollateralCall) {
    this._call = call;
  }
}

export class OperatorWithdrawAndRedeemCollateralCall extends ethereum.Call {
  get inputs(): OperatorWithdrawAndRedeemCollateralCall__Inputs {
    return new OperatorWithdrawAndRedeemCollateralCall__Inputs(this);
  }

  get outputs(): OperatorWithdrawAndRedeemCollateralCall__Outputs {
    return new OperatorWithdrawAndRedeemCollateralCall__Outputs(this);
  }
}

export class OperatorWithdrawAndRedeemCollateralCall__Inputs {
  _call: OperatorWithdrawAndRedeemCollateralCall;

  constructor(call: OperatorWithdrawAndRedeemCollateralCall) {
    this._call = call;
  }

  get from(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get collateral(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class OperatorWithdrawAndRedeemCollateralCall__Outputs {
  _call: OperatorWithdrawAndRedeemCollateralCall;

  constructor(call: OperatorWithdrawAndRedeemCollateralCall) {
    this._call = call;
  }
}

export class WithdrawPendingDepositCall extends ethereum.Call {
  get inputs(): WithdrawPendingDepositCall__Inputs {
    return new WithdrawPendingDepositCall__Inputs(this);
  }

  get outputs(): WithdrawPendingDepositCall__Outputs {
    return new WithdrawPendingDepositCall__Outputs(this);
  }
}

export class WithdrawPendingDepositCall__Inputs {
  _call: WithdrawPendingDepositCall;

  constructor(call: WithdrawPendingDepositCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class WithdrawPendingDepositCall__Outputs {
  _call: WithdrawPendingDepositCall;

  constructor(call: WithdrawPendingDepositCall) {
    this._call = call;
  }
}

export class SendCall extends ethereum.Call {
  get inputs(): SendCall__Inputs {
    return new SendCall__Inputs(this);
  }

  get outputs(): SendCall__Outputs {
    return new SendCall__Outputs(this);
  }
}

export class SendCall__Inputs {
  _call: SendCall;

  constructor(call: SendCall) {
    this._call = call;
  }

  get recipient(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }
}

export class SendCall__Outputs {
  _call: SendCall;

  constructor(call: SendCall) {
    this._call = call;
  }
}

export class OperatorSendCall extends ethereum.Call {
  get inputs(): OperatorSendCall__Inputs {
    return new OperatorSendCall__Inputs(this);
  }

  get outputs(): OperatorSendCall__Outputs {
    return new OperatorSendCall__Outputs(this);
  }
}

export class OperatorSendCall__Inputs {
  _call: OperatorSendCall;

  constructor(call: OperatorSendCall) {
    this._call = call;
  }

  get sender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class OperatorSendCall__Outputs {
  _call: OperatorSendCall;

  constructor(call: OperatorSendCall) {
    this._call = call;
  }
}

export class TransferCall extends ethereum.Call {
  get inputs(): TransferCall__Inputs {
    return new TransferCall__Inputs(this);
  }

  get outputs(): TransferCall__Outputs {
    return new TransferCall__Outputs(this);
  }
}

export class TransferCall__Inputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get recipient(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class TransferCall__Outputs {
  _call: TransferCall;

  constructor(call: TransferCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class TransferFromCall extends ethereum.Call {
  get inputs(): TransferFromCall__Inputs {
    return new TransferFromCall__Inputs(this);
  }

  get outputs(): TransferFromCall__Outputs {
    return new TransferFromCall__Outputs(this);
  }
}

export class TransferFromCall__Inputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get sender(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get recipient(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class TransferFromCall__Outputs {
  _call: TransferFromCall;

  constructor(call: TransferFromCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class OperatorBurnCall extends ethereum.Call {
  get inputs(): OperatorBurnCall__Inputs {
    return new OperatorBurnCall__Inputs(this);
  }

  get outputs(): OperatorBurnCall__Outputs {
    return new OperatorBurnCall__Outputs(this);
  }
}

export class OperatorBurnCall__Inputs {
  _call: OperatorBurnCall;

  constructor(call: OperatorBurnCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get value1(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get value2(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get value3(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OperatorBurnCall__Outputs {
  _call: OperatorBurnCall;

  constructor(call: OperatorBurnCall) {
    this._call = call;
  }
}

export class BurnCall extends ethereum.Call {
  get inputs(): BurnCall__Inputs {
    return new BurnCall__Inputs(this);
  }

  get outputs(): BurnCall__Outputs {
    return new BurnCall__Outputs(this);
  }
}

export class BurnCall__Inputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get value1(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class BurnCall__Outputs {
  _call: BurnCall;

  constructor(call: BurnCall) {
    this._call = call;
  }
}

export class RewardedCall extends ethereum.Call {
  get inputs(): RewardedCall__Inputs {
    return new RewardedCall__Inputs(this);
  }

  get outputs(): RewardedCall__Outputs {
    return new RewardedCall__Outputs(this);
  }
}

export class RewardedCall__Inputs {
  _call: RewardedCall;

  constructor(call: RewardedCall) {
    this._call = call;
  }

  get value0(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get winnings(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get drawId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class RewardedCall__Outputs {
  _call: RewardedCall;

  constructor(call: RewardedCall) {
    this._call = call;
  }
}

export class OperatorRedeemCall extends ethereum.Call {
  get inputs(): OperatorRedeemCall__Inputs {
    return new OperatorRedeemCall__Inputs(this);
  }

  get outputs(): OperatorRedeemCall__Outputs {
    return new OperatorRedeemCall__Outputs(this);
  }
}

export class OperatorRedeemCall__Inputs {
  _call: OperatorRedeemCall;

  constructor(call: OperatorRedeemCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OperatorRedeemCall__Outputs {
  _call: OperatorRedeemCall;

  constructor(call: OperatorRedeemCall) {
    this._call = call;
  }
}

export class RedeemCall extends ethereum.Call {
  get inputs(): RedeemCall__Inputs {
    return new RedeemCall__Inputs(this);
  }

  get outputs(): RedeemCall__Outputs {
    return new RedeemCall__Outputs(this);
  }
}

export class RedeemCall__Inputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class RedeemCall__Outputs {
  _call: RedeemCall;

  constructor(call: RedeemCall) {
    this._call = call;
  }
}

export class OperatorRedeemToPoolCall extends ethereum.Call {
  get inputs(): OperatorRedeemToPoolCall__Inputs {
    return new OperatorRedeemToPoolCall__Inputs(this);
  }

  get outputs(): OperatorRedeemToPoolCall__Outputs {
    return new OperatorRedeemToPoolCall__Outputs(this);
  }
}

export class OperatorRedeemToPoolCall__Inputs {
  _call: OperatorRedeemToPoolCall;

  constructor(call: OperatorRedeemToPoolCall) {
    this._call = call;
  }

  get account(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get operatorData(): Bytes {
    return this._call.inputValues[3].value.toBytes();
  }
}

export class OperatorRedeemToPoolCall__Outputs {
  _call: OperatorRedeemToPoolCall;

  constructor(call: OperatorRedeemToPoolCall) {
    this._call = call;
  }
}

export class RedeemToPoolCall extends ethereum.Call {
  get inputs(): RedeemToPoolCall__Inputs {
    return new RedeemToPoolCall__Inputs(this);
  }

  get outputs(): RedeemToPoolCall__Outputs {
    return new RedeemToPoolCall__Outputs(this);
  }
}

export class RedeemToPoolCall__Inputs {
  _call: RedeemToPoolCall;

  constructor(call: RedeemToPoolCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get data(): Bytes {
    return this._call.inputValues[1].value.toBytes();
  }
}

export class RedeemToPoolCall__Outputs {
  _call: RedeemToPoolCall;

  constructor(call: RedeemToPoolCall) {
    this._call = call;
  }
}
