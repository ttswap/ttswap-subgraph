import {
        GoodState,
        GoodData,
} from "../../generated/schema";

import { Address, BigInt, dataSource } from "@graphprotocol/graph-ts";

import {
        BI_128,
        ZERO_BI,
        ONE_BI,
        compareprice,
} from "./constants";
import { fetchTokenDecimals } from "./token";
import { TTSwap_Market } from "../../generated/TTSwap_Market/TTSwap_Market";

export function log_GoodData(
        normal_good: GoodState,
        modifiedTime: BigInt
): void {
        let data_hour = modifiedTime
                .mod(BigInt.fromU32(7260))
                .div(BigInt.fromU32(60));
        let goodData_hour = GoodData.load(
                normal_good.id + "h" + data_hour.toString()
        );
        let price = normal_good.currentValue
                .times(BI_128)
                .plus(normal_good.currentQuantity);
        if (goodData_hour === null) {
                goodData_hour = new GoodData(
                        normal_good.id + "h" + data_hour.toString()
                );
                goodData_hour.modifiedTime = ZERO_BI;
                goodData_hour.timetype = "h";
                goodData_hour.good = normal_good.id;
                goodData_hour.goodConfig = normal_good.goodConfig;
                goodData_hour.isvaluegood = normal_good.isvaluegood;
                goodData_hour.decimals = normal_good.tokendecimals;
                goodData_hour.currentValue = normal_good.currentValue;
                goodData_hour.currentQuantity = normal_good.currentQuantity;
                goodData_hour.investValue = normal_good.investValue;
                goodData_hour.investQuantity = normal_good.investQuantity;
                goodData_hour.currentActualValue = normal_good.currentActualValue;
                goodData_hour.currentAcutualQuanity = normal_good.currentAcutualQuanity;
                goodData_hour.investActualValue = normal_good.investActualValue;
                goodData_hour.investActualQuantity = normal_good.investActualQuantity;
                goodData_hour.feeQuantity = normal_good.feeQuantity;
                goodData_hour.contructFee = normal_good.contructFee;
                goodData_hour.totalTradeQuantity = normal_good.totalTradeQuantity;
                goodData_hour.totalInvestQuantity = normal_good.totalInvestQuantity;
                goodData_hour.totalDisinvestQuantity =
                        normal_good.totalDisinvestQuantity;
                goodData_hour.totalProfit = normal_good.totalProfit;
                goodData_hour.totalTradeCount = normal_good.totalTradeCount;
                goodData_hour.totalInvestCount = normal_good.totalInvestCount;
                goodData_hour.totalDisinvestCount = normal_good.totalDisinvestCount;
                goodData_hour.open = price;
                goodData_hour.high = price;
                goodData_hour.low = price;
                goodData_hour.close = price;

                goodData_hour.modifiedTime = modifiedTime;
                goodData_hour.save();
        }

        if (
                goodData_hour.modifiedTime.plus(BigInt.fromU32(60)) <
                normal_good.modifiedTime
        ) {
                goodData_hour.modifiedTime = ZERO_BI;
                goodData_hour.timetype = "h";
                goodData_hour.good = normal_good.id;
                goodData_hour.goodConfig = normal_good.goodConfig;
                goodData_hour.isvaluegood = normal_good.isvaluegood;
                goodData_hour.decimals = normal_good.tokendecimals;
                goodData_hour.currentValue = normal_good.currentValue;
                goodData_hour.currentQuantity = normal_good.currentQuantity;
                goodData_hour.investValue = normal_good.investValue;
                goodData_hour.investQuantity = normal_good.investQuantity;
                goodData_hour.currentActualValue = normal_good.currentActualValue;
                goodData_hour.currentAcutualQuanity = normal_good.currentAcutualQuanity;
                goodData_hour.investActualValue = normal_good.investActualValue;
                goodData_hour.investActualQuantity = normal_good.investActualQuantity;
                goodData_hour.feeQuantity = normal_good.feeQuantity;
                goodData_hour.contructFee = normal_good.contructFee;
                goodData_hour.totalTradeQuantity = normal_good.totalTradeQuantity;
                goodData_hour.totalInvestQuantity = normal_good.totalInvestQuantity;
                goodData_hour.totalDisinvestQuantity =
                        normal_good.totalDisinvestQuantity;
                goodData_hour.totalProfit = normal_good.totalProfit;
                goodData_hour.totalTradeCount = normal_good.totalTradeCount;
                goodData_hour.totalInvestCount = normal_good.totalInvestCount;
                goodData_hour.totalDisinvestCount = normal_good.totalDisinvestCount;

                if (
                        goodData_hour.modifiedTime
                                .mod(BigInt.fromU32(7260))
                                .div(BigInt.fromU32(60)) <
                        modifiedTime.mod(BigInt.fromU32(7260)).div(BigInt.fromU32(60))
                ) {
                        goodData_hour.open = price;
                }
                if (compareprice(goodData_hour.high, price)) {
                        goodData_hour.high = price;
                }

                if (compareprice(price, goodData_hour.low)) {
                        goodData_hour.low = price;
                }
                if (
                        modifiedTime.mod(BigInt.fromU32(7260)).div(BigInt.fromU32(60)) <
                        modifiedTime
                                .plus(ONE_BI)
                                .mod(BigInt.fromU32(7260))
                                .div(BigInt.fromU32(60))
                ) {
                        goodData_hour.close = price;
                }
                goodData_hour.modifiedTime = modifiedTime;
                goodData_hour.save();
        }

        let data_day = modifiedTime
                .mod(BigInt.fromU32(174000))
                .div(BigInt.fromU32(1200));
        let goodData_day = GoodData.load(
                normal_good.id + "d" + data_day.toString()
        );
        if (goodData_day === null) {
                goodData_day = new GoodData(
                        normal_good.id + "d" + data_day.toString()
                );

                goodData_day.timetype = "d";
                goodData_day.good = goodData_hour.good;
                goodData_day.decimals = goodData_hour.decimals;
                goodData_day.goodConfig = goodData_hour.goodConfig;
                goodData_day.isvaluegood = goodData_hour.isvaluegood;
                goodData_day.currentValue = goodData_hour.currentValue;
                goodData_day.currentQuantity = goodData_hour.currentQuantity;
                goodData_day.investValue = goodData_hour.investValue;
                goodData_day.investQuantity = goodData_hour.investQuantity;
                goodData_day.currentActualValue = goodData_hour.currentActualValue;
                goodData_day.currentAcutualQuanity = goodData_hour.currentAcutualQuanity;
                goodData_day.investActualValue = goodData_hour.investActualValue;
                goodData_day.investActualQuantity = goodData_hour.investActualQuantity;
                goodData_day.feeQuantity = goodData_hour.feeQuantity;
                goodData_day.contructFee = goodData_hour.contructFee;
                goodData_day.totalTradeQuantity =
                        goodData_hour.totalTradeQuantity;
                goodData_day.totalInvestQuantity =
                        goodData_hour.totalInvestQuantity;
                goodData_day.totalDisinvestQuantity =
                        goodData_hour.totalDisinvestQuantity;
                goodData_day.totalProfit = goodData_hour.totalProfit;
                goodData_day.totalTradeCount = goodData_hour.totalTradeCount;
                goodData_day.totalInvestCount = goodData_hour.totalInvestCount;
                goodData_day.totalDisinvestCount =
                        goodData_hour.totalDisinvestCount;

                goodData_day.modifiedTime = modifiedTime;
                goodData_day.open = price;
                goodData_day.high = price;
                goodData_day.low = price;
                goodData_day.close = price;
                goodData_day.save();
        }
        if (
                goodData_day.modifiedTime.plus(BigInt.fromU32(60)) <
                goodData_hour.modifiedTime
        ) {
                goodData_day.timetype = "d";
                goodData_day.good = goodData_hour.good;
                goodData_day.decimals = goodData_hour.decimals;
                goodData_day.goodConfig = goodData_hour.goodConfig;
                goodData_day.isvaluegood = goodData_hour.isvaluegood;
                goodData_day.currentValue = goodData_hour.currentValue;
                goodData_day.currentQuantity = goodData_hour.currentQuantity;
                goodData_day.investValue = goodData_hour.investValue;
                goodData_day.investQuantity = goodData_hour.investQuantity;
                goodData_day.currentActualValue = goodData_hour.currentActualValue;
                goodData_day.currentAcutualQuanity = goodData_hour.currentAcutualQuanity;
                goodData_day.investActualValue = goodData_hour.investActualValue;
                goodData_day.investActualQuantity = goodData_hour.investActualQuantity;
                goodData_day.feeQuantity = goodData_hour.feeQuantity;
                goodData_day.contructFee = goodData_hour.contructFee;
                goodData_day.totalTradeQuantity =
                        goodData_hour.totalTradeQuantity;
                goodData_day.totalInvestQuantity =
                        goodData_hour.totalInvestQuantity;
                goodData_day.totalDisinvestQuantity =
                        goodData_hour.totalDisinvestQuantity;
                goodData_day.totalProfit = goodData_hour.totalProfit;
                goodData_day.totalTradeCount = goodData_hour.totalTradeCount;
                goodData_day.totalInvestCount = goodData_hour.totalInvestCount;
                goodData_day.totalDisinvestCount =
                        goodData_hour.totalDisinvestCount;

                goodData_day.modifiedTime = modifiedTime;
                if (
                        goodData_day.modifiedTime
                                .mod(BigInt.fromU32(174000))
                                .div(BigInt.fromU32(1200)) <
                        modifiedTime
                                .mod(BigInt.fromU32(174000))
                                .div(BigInt.fromU32(1200))
                ) {
                        goodData_day.open = price;
                }
                if (compareprice(goodData_day.high, goodData_hour.high)) {
                        goodData_day.high = goodData_hour.high;
                }

                if (compareprice(goodData_hour.low, goodData_day.low)) {
                        goodData_day.low = goodData_hour.low;
                }
                if (
                        modifiedTime
                                .mod(BigInt.fromU32(174000))
                                .div(BigInt.fromU32(1200)) <
                        modifiedTime
                                .plus(BigInt.fromU32(60))
                                .mod(BigInt.fromU32(174000))
                                .div(BigInt.fromU32(1200))
                ) {
                        goodData_day.close = price;
                }
                goodData_day.save();
        }

        let data_week = modifiedTime
                .mod(BigInt.fromU32(1220400))
                .div(BigInt.fromU32(10800));
        let goodData_week = GoodData.load(
                normal_good.id + "w" + data_week.toString()
        );
        if (goodData_week === null) {
                goodData_week = new GoodData(
                        normal_good.id + "w" + data_week.toString()
                );

                goodData_week.timetype = "w"; goodData_week.good = goodData_day.good;
                goodData_week.decimals = goodData_day.decimals;
                goodData_week.goodConfig = goodData_day.goodConfig;
                goodData_week.isvaluegood = goodData_day.isvaluegood;
                goodData_week.currentValue = goodData_day.currentValue;
                goodData_week.currentQuantity = goodData_day.currentQuantity;
                goodData_week.investValue = goodData_day.investValue;
                goodData_week.investQuantity = goodData_day.investQuantity;   
                goodData_week.currentActualValue = goodData_day.currentActualValue;
                goodData_week.currentAcutualQuanity = goodData_day.currentAcutualQuanity;
                goodData_week.investActualValue = goodData_day.investActualValue;
                goodData_week.investActualQuantity = goodData_day.investActualQuantity;
                goodData_week.feeQuantity = goodData_day.feeQuantity;
                goodData_week.contructFee = goodData_day.contructFee;
                goodData_week.totalTradeQuantity =
                        goodData_day.totalTradeQuantity;
                goodData_week.totalInvestQuantity =
                        goodData_day.totalInvestQuantity;
                goodData_week.totalDisinvestQuantity =
                        goodData_day.totalDisinvestQuantity;
                goodData_week.totalProfit = goodData_day.totalProfit;
                goodData_week.totalTradeCount = goodData_day.totalTradeCount;
                goodData_week.totalInvestCount = goodData_day.totalInvestCount;
                goodData_week.totalDisinvestCount =
                        goodData_day.totalDisinvestCount;
                goodData_week.modifiedTime = modifiedTime;
                goodData_week.open = price;
                goodData_week.high = price;
                goodData_week.low = price;
                goodData_week.close = price;
                goodData_week.save();
        }
        if (
                goodData_week.modifiedTime.plus(BigInt.fromU32(1200)) <
                goodData_day.modifiedTime
        ) {
                goodData_week.timetype = "w";
                goodData_week.good = goodData_day.good;
                goodData_week.decimals = goodData_day.decimals;
                goodData_week.goodConfig = goodData_day.goodConfig;
                goodData_week.isvaluegood = goodData_day.isvaluegood;
                goodData_week.currentValue = goodData_day.currentValue;
                goodData_week.currentQuantity = goodData_day.currentQuantity;
                goodData_week.investValue = goodData_day.investValue;
                goodData_week.investQuantity = goodData_day.investQuantity;
                goodData_week.currentActualValue = goodData_day.currentActualValue;
                goodData_week.currentAcutualQuanity = goodData_day.currentAcutualQuanity;
                goodData_week.investActualValue = goodData_day.investActualValue;
                goodData_week.investActualQuantity = goodData_day.investActualQuantity;
                goodData_week.feeQuantity = goodData_day.feeQuantity;
                goodData_week.contructFee = goodData_day.contructFee;
                goodData_week.totalTradeQuantity =
                        goodData_day.totalTradeQuantity;
                goodData_week.totalInvestQuantity =
                        goodData_day.totalInvestQuantity;
                goodData_week.totalDisinvestQuantity =
                        goodData_day.totalDisinvestQuantity;
                goodData_week.totalProfit = goodData_day.totalProfit;
                goodData_week.totalTradeCount = goodData_day.totalTradeCount;
                goodData_week.totalInvestCount = goodData_day.totalInvestCount;
                goodData_week.totalDisinvestCount =
                        goodData_day.totalDisinvestCount;
                goodData_week.modifiedTime = modifiedTime;
                if (
                        goodData_week.modifiedTime
                                .mod(BigInt.fromU32(1220400))
                                .div(BigInt.fromU32(10800)) <
                        modifiedTime
                                .mod(BigInt.fromU32(1220400))
                                .div(BigInt.fromU32(10800))
                ) {
                        goodData_week.open = price;
                }
                if (compareprice(goodData_week.high, goodData_day.high)) {
                        goodData_week.high = goodData_day.high;
                }

                if (compareprice(goodData_day.low, goodData_week.low)) {
                        goodData_week.low = goodData_day.low;
                }
                if (
                        modifiedTime
                                .mod(BigInt.fromU32(1220400))
                                .div(BigInt.fromU32(10800)) <
                        modifiedTime
                                .plus(BigInt.fromU32(1200))
                                .mod(BigInt.fromU32(1220400))
                                .div(BigInt.fromU32(10800))
                ) {
                        goodData_week.close = price;
                }

                goodData_week.save();
        }

        let data_month = modifiedTime
                .mod(BigInt.fromU32(5356800))
                .div(BigInt.fromU32(43200));
        let goodData_month = GoodData.load(
                normal_good.id + "m" + data_month.toString()
        );
        if (goodData_month === null) {
                goodData_month = new GoodData(
                        normal_good.id + "m" + data_month.toString()
                );
                goodData_month.modifiedTime = ZERO_BI;

                goodData_month.timetype = "m"; goodData_month.good = goodData_week.good;
                goodData_month.decimals = goodData_week.decimals;
                goodData_month.goodConfig = goodData_week.goodConfig;
                goodData_month.isvaluegood = goodData_week.isvaluegood;
                goodData_month.currentValue = goodData_week.currentValue;
                goodData_month.currentQuantity = goodData_week.currentQuantity;
                goodData_month.investValue = goodData_week.investValue;
                goodData_month.investQuantity = goodData_week.investQuantity;
                goodData_month.currentActualValue = goodData_week.currentActualValue;
                goodData_month.currentAcutualQuanity = goodData_week.currentAcutualQuanity;
                goodData_month.investActualValue = goodData_week.investActualValue;
                goodData_month.investActualQuantity = goodData_week.investActualQuantity;
                goodData_month.feeQuantity = goodData_week.feeQuantity;
                goodData_month.contructFee = goodData_week.contructFee;
                goodData_month.totalTradeQuantity =
                        goodData_week.totalTradeQuantity;
                goodData_month.totalInvestQuantity =
                        goodData_week.totalInvestQuantity;
                goodData_month.totalDisinvestQuantity =
                        goodData_week.totalDisinvestQuantity;
                goodData_month.totalProfit = goodData_week.totalProfit;
                goodData_month.totalTradeCount = goodData_week.totalTradeCount;
                goodData_month.totalInvestCount =
                        goodData_week.totalInvestCount;
                goodData_month.totalDisinvestCount =
                        goodData_week.totalDisinvestCount;
                goodData_month.modifiedTime = modifiedTime;
                goodData_month.open = price;
                goodData_month.high = price;
                goodData_month.low = price;
                goodData_month.close = price;
                goodData_month.save();
        }
        if (
                goodData_month.modifiedTime.plus(BigInt.fromU32(10800)) <
                goodData_week.modifiedTime
        ) {
                goodData_month.timetype = "m";
                goodData_month.good = goodData_week.good;
                goodData_month.decimals = goodData_week.decimals;
                goodData_month.goodConfig = goodData_week.goodConfig;
                goodData_month.isvaluegood = goodData_week.isvaluegood;
                goodData_month.currentValue = goodData_week.currentValue;
                goodData_month.currentQuantity = goodData_week.currentQuantity;
                goodData_month.investValue = goodData_week.investValue;
                goodData_month.investQuantity = goodData_week.investQuantity;
                goodData_month.currentActualValue = goodData_week.currentActualValue;
                goodData_month.currentAcutualQuanity = goodData_week.currentAcutualQuanity;
                goodData_month.investActualValue = goodData_week.investActualValue;
                goodData_month.investActualQuantity = goodData_week.investActualQuantity;
                goodData_month.feeQuantity = goodData_week.feeQuantity;
                goodData_month.contructFee = goodData_week.contructFee;
                goodData_month.totalTradeQuantity =
                        goodData_week.totalTradeQuantity;
                goodData_month.totalInvestQuantity =
                        goodData_week.totalInvestQuantity;
                goodData_month.totalDisinvestQuantity =
                        goodData_week.totalDisinvestQuantity;
                goodData_month.totalProfit = goodData_week.totalProfit;
                goodData_month.totalTradeCount = goodData_week.totalTradeCount;
                goodData_month.totalInvestCount =
                        goodData_week.totalInvestCount;
                goodData_month.totalDisinvestCount =
                        goodData_week.totalDisinvestCount;
                goodData_month.modifiedTime = modifiedTime;
                if (
                        goodData_month.modifiedTime
                                .mod(BigInt.fromU32(5356800))
                                .div(BigInt.fromU32(43200)) <
                        modifiedTime
                                .mod(BigInt.fromU32(5356800))
                                .div(BigInt.fromU32(43200))
                ) {
                        goodData_month.open = price;
                }
                if (compareprice(goodData_month.high, goodData_week.high)) {
                        goodData_month.high = goodData_week.high;
                }

                if (compareprice(goodData_week.low, goodData_month.low)) {
                        goodData_month.low = goodData_week.low;
                }
                if (
                        modifiedTime
                                .mod(BigInt.fromU32(5356800))
                                .div(BigInt.fromU32(43200)) <
                        modifiedTime
                                .plus(BigInt.fromU32(10800))
                                .mod(BigInt.fromU32(5356800))
                                .div(BigInt.fromU32(43200))
                ) {
                        goodData_month.close = price;
                }

                goodData_month.save();
        }

        let data_year = modifiedTime.div(BigInt.fromU32(432000));
        let goodData_year = GoodData.load(
                normal_good.id + "y" + data_year.toString()
        );
        if (goodData_year === null) {
                goodData_year = new GoodData(
                        normal_good.id + "y" + data_year.toString()
                );
                goodData_year.modifiedTime = ZERO_BI;

                goodData_year.timetype = "y";
                goodData_year.open = price;
                goodData_year.high = price;
                goodData_year.low = price;
                goodData_year.close = price;
                goodData_year.good = goodData_month.good;
                goodData_year.decimals = goodData_month.decimals;
                goodData_year.goodConfig = goodData_month.goodConfig;
                goodData_year.isvaluegood = goodData_month.isvaluegood;
                goodData_year.currentValue = goodData_month.currentValue;
                goodData_year.currentQuantity = goodData_month.currentQuantity;
                goodData_year.investValue = goodData_month.investValue;
                goodData_year.investQuantity = goodData_month.investQuantity;
                goodData_year.currentActualValue = goodData_month.currentActualValue;
                goodData_year.currentAcutualQuanity = goodData_month.currentAcutualQuanity;
                goodData_year.investActualValue = goodData_month.investActualValue;
                goodData_year.investActualQuantity = goodData_month.investActualQuantity;
                goodData_year.feeQuantity = goodData_month.feeQuantity;
                goodData_year.contructFee = goodData_month.contructFee;
                goodData_year.totalTradeQuantity =
                        goodData_month.totalTradeQuantity;
                goodData_year.totalInvestQuantity =
                        goodData_month.totalInvestQuantity;
                goodData_year.totalDisinvestQuantity =
                        goodData_month.totalDisinvestQuantity;
                goodData_year.totalProfit = goodData_month.totalProfit;
                goodData_year.totalTradeCount = goodData_month.totalTradeCount;
                goodData_year.totalInvestCount =
                        goodData_month.totalInvestCount;
                goodData_year.totalDisinvestCount =
                        goodData_month.totalDisinvestCount;

                goodData_year.modifiedTime = modifiedTime;
                goodData_year.save();
        }
        if (
                goodData_year.modifiedTime.plus(BigInt.fromU32(43200)) <
                goodData_month.modifiedTime
        ) {
                goodData_year.timetype = "y";
                goodData_year.good = goodData_month.good;
                goodData_year.decimals = goodData_month.decimals;
                goodData_year.goodConfig = goodData_month.goodConfig;
                goodData_year.isvaluegood = goodData_month.isvaluegood;
                goodData_year.currentValue = goodData_month.currentValue;
                goodData_year.currentQuantity = goodData_month.currentQuantity;
                goodData_year.investValue = goodData_month.investValue;
                goodData_year.investQuantity = goodData_month.investQuantity;
                goodData_year.currentActualValue = goodData_month.currentActualValue;
                goodData_year.currentAcutualQuanity = goodData_month.currentAcutualQuanity;
                goodData_year.investActualValue = goodData_month.investActualValue;
                goodData_year.investActualQuantity = goodData_month.investActualQuantity;
                goodData_year.feeQuantity = goodData_month.feeQuantity;
                goodData_year.contructFee = goodData_month.contructFee;
                goodData_year.totalTradeQuantity =
                        goodData_month.totalTradeQuantity;
                goodData_year.totalInvestQuantity =
                        goodData_month.totalInvestQuantity;
                goodData_year.totalDisinvestQuantity =
                        goodData_month.totalDisinvestQuantity;
                goodData_year.totalProfit = goodData_month.totalProfit;
                goodData_year.totalTradeCount = goodData_month.totalTradeCount;
                goodData_year.totalInvestCount =
                        goodData_month.totalInvestCount;
                goodData_year.totalDisinvestCount =
                        goodData_month.totalDisinvestCount;

                goodData_year.modifiedTime = modifiedTime;
                if (
                        goodData_year.modifiedTime.div(BigInt.fromU32(432000)) <
                        modifiedTime.div(BigInt.fromU32(432000))
                ) {
                        goodData_year.open = price;
                }
                if (compareprice(goodData_year.high, goodData_month.high)) {
                        goodData_year.high = goodData_month.high;
                }

                if (compareprice(goodData_month.low, goodData_year.low)) {
                        goodData_year.low = goodData_month.low;
                }
                if (
                        modifiedTime.div(BigInt.fromU32(432000)) <
                        modifiedTime
                                .plus(BigInt.fromU32(10800))
                                .div(BigInt.fromU32(432000))
                ) {
                        goodData_year.close = price;
                }
                goodData_year.save();
        }
}

export function fetchGoodDecimals(goodid: Address): BigInt {
        let goodState = GoodState.load(goodid.toHexString());
        let decimals = BigInt.fromString("0");

        if (goodState === null) {
                decimals = BigInt.fromString("0");
        } else {
                decimals = goodState.tokendecimals;
                if (decimals == BigInt.fromString("0")) {
                        decimals = fetchTokenDecimals(goodid);
                }
        }
        return decimals;
}

export function fetchGoodConfig(goodid: Address): BigInt {
        let contract = TTSwap_Market.bind(dataSource.address());
        // try types uint8 for decimals
        let decimalValue = BigInt.fromU32(0);
        let decimalResult = contract.try_getGoodState(goodid);
        if (!decimalResult.reverted) {
                decimalValue = decimalResult.value.goodConfig;
        }
        return decimalValue;
}
