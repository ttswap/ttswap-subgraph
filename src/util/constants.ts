/* eslint-disable prefer-const */
import { BigInt, BigDecimal, Address, Bytes } from "@graphprotocol/graph-ts";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const ADDRESS_ONE = "0x0000000000000000000000000000000000000001";
export const ADDRESS_TWO = "0x0000000000000000000000000000000000000002";
export const ADDRESS_THREE = "0x0000000000000000000000000000000000000003";
export const WETH = "0x0000000000000000000000000000000000000003";


export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
export let BI_128 = BigInt.fromString(
        "340282366920938463463374607431768211456"
);

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
