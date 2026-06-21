/* eslint-disable prefer-const */
import { ERC20 } from "../../generated/TTSwap_Market/ERC20";
import { ERC20SymbolBytes } from "../../generated/TTSwap_Market/ERC20SymbolBytes";
import { ERC20NameBytes } from "../../generated/TTSwap_Market/ERC20NameBytes";
import { StaticTokenDefinition } from "./staticTokenDefinition";
import { BigInt, Address } from "@graphprotocol/graph-ts";
import { isNullEthValue } from ".";
import { ADDRESS_ONE, ADDRESS_TWO, ADDRESS_THREE, WETH } from "./constants";

export function fetchTokenSymbol(tokenAddress: Address): string {
        let symbolValue = "unknown";
        if (tokenAddress.toHexString() == ADDRESS_ONE) {
                symbolValue = "ETH";
        } else if (tokenAddress.toHexString() == ADDRESS_TWO) {
                symbolValue = "SETH";
        } else if (tokenAddress.toHexString() == ADDRESS_THREE) {
                symbolValue = "SWETH";
        } else {
                let contract = ERC20.bind(tokenAddress);
                let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

                // try types string and bytes32 for symbol
                let symbolResult = contract.try_symbol();
                if (symbolResult.reverted) {
                        let symbolResultBytes =
                                contractSymbolBytes.try_symbol();
                        if (!symbolResultBytes.reverted) {
                                // for broken pairs that have no symbol function exposed
                                if (
                                        !isNullEthValue(
                                                symbolResultBytes.value.toHexString()
                                        )
                                ) {
                                        symbolValue =
                                                symbolResultBytes.value.toString();
                                } else {
                                        // try with the static definition
                                        let staticTokenDefinition =
                                                StaticTokenDefinition.fromAddress(
                                                        tokenAddress
                                                );
                                        if (staticTokenDefinition != null) {
                                                symbolValue =
                                                        staticTokenDefinition.symbol;
                                        }
                                }
                        }
                } else {
                        symbolValue = symbolResult.value;
                }
        }

        return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
        let nameValue = "unknown";
        if (tokenAddress.toHexString() == ADDRESS_ONE) {
                nameValue = "Ether";
        } else if (tokenAddress.toHexString() == ADDRESS_TWO) {
                nameValue = "Stake Ether";
        } else if (tokenAddress.toHexString() == ADDRESS_THREE) {
                nameValue = "Stake Wrapped Ether ";
        } else {
                let contract = ERC20.bind(tokenAddress);
                let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

                // try types string and bytes32 for name
                let nameResult = contract.try_name();
                if (nameResult.reverted) {
                        let nameResultBytes = contractNameBytes.try_name();
                        if (!nameResultBytes.reverted) {
                                // for broken exchanges that have no name function exposed
                                if (
                                        !isNullEthValue(
                                                nameResultBytes.value.toHexString()
                                        )
                                ) {
                                        nameValue =
                                                nameResultBytes.value.toString();
                                } else {
                                        // try with the static definition
                                        let staticTokenDefinition =
                                                StaticTokenDefinition.fromAddress(
                                                        tokenAddress
                                                );
                                        if (staticTokenDefinition != null) {
                                                nameValue =
                                                        staticTokenDefinition.name;
                                        }
                                }
                        }
                } else {
                        nameValue = nameResult.value;
                }
        }
        return nameValue;
}

export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
        let totalSupplyValue = BigInt.fromU64(0);
        if (
                tokenAddress.toHexString() == ADDRESS_ONE ||
                tokenAddress.toHexString() == ADDRESS_TWO
        ) {
                totalSupplyValue = BigInt.fromString(
                        "117765776000000000000000000"
                );
        } else {
                if (tokenAddress.toHexString() == ADDRESS_THREE) {
                        tokenAddress = Address.fromString(WETH);
                }
                let contract = ERC20.bind(tokenAddress);

                let totalSupplyResult = contract.try_totalSupply();
                if (!totalSupplyResult.reverted) {
                        totalSupplyValue = totalSupplyResult.value;
                } else {
                        totalSupplyValue = BigInt.fromU32(0);
                }
        }
        return totalSupplyValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
        let decimalValue = BigInt.fromU64(0);
        if (
                tokenAddress.toHexString() == ADDRESS_ONE ||
                tokenAddress.toHexString() == ADDRESS_TWO ||
                tokenAddress.toHexString() == ADDRESS_THREE
        ) {
                decimalValue = BigInt.fromU64(18);
        } else {
                let contract = ERC20.bind(tokenAddress);
                // try types uint8 for decimals
                let decimalResult = contract.try_decimals();
                if (!decimalResult.reverted) {
                        decimalValue = BigInt.fromU64(decimalResult.value);
                } else {
                        // try with the static definition
                        let staticTokenDefinition =
                                StaticTokenDefinition.fromAddress(tokenAddress);
                        if (staticTokenDefinition != null) {
                                return staticTokenDefinition.decimals;
                        }
                }
        }
        return decimalValue;
}
