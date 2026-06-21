/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address, Bytes } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
export const ADDRESS_TWO = "0x0000000000000000000000000000000000000002";
export const ADDRESS_THREE = "0x0000000000000000000000000000000000000003";
export const WETH = "0x0000000000000000000000000000000000000003";
export const INIT_GOODCONFIG = BigInt.fromString("15854374339384855252008259772529313745246240046759050715897088717982225399808");


export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
export let BI_128 = BigInt.fromString(
        "340282366920938463463374607431768211456"
);
export let BI_160 = BigInt.fromString(
        "1461501637330902918203684832716283019655932542976"
);

// uint160(address) packed in lower 160 bits of goodinfo
export function addressFromUint160(value: BigInt): Address {
        let hex = value.toHex();
        if (hex.length >= 2 && hex.charAt(0) == "0" && hex.charAt(1) == "x") {
                hex = hex.slice(2);
        }
        while (hex.length < 40) {
                hex = "0" + hex;
        }
        return Address.fromString("0x" + hex);
}

export function convertQuantityToDecimal(
        tokenAmount: BigInt,
        exchangeDecimals: BigInt
): BigDecimal {
        if (exchangeDecimals == ZERO_BI) {
                return tokenAmount.toBigDecimal();
        }
        return tokenAmount
                .toBigDecimal()
                .div(exponentToBigDecimal(exchangeDecimals));
}

export function convertValueToDecimal(tokenAmount: BigInt): BigDecimal {
        return tokenAmount
                .toBigDecimal()
                .div(exponentToBigDecimal(BigInt.fromString("6")));
}

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
        let bd = BigDecimal.fromString("1");
        for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
                bd = bd.times(BigDecimal.fromString("10"));
        }
        return bd;
}

export function compareprice(price1: BigInt, price2: BigInt): boolean {
        if (
                price1.div(BI_128).times(price2.mod(BI_128)) <
                price1.mod(BI_128).times(price2.div(BI_128))
        ) {
                return true;
        } else {
                return false;
        }
}
