import { MarketState, MarketData } from "../../generated/schema";

import { BigInt } from "@graphprotocol/graph-ts";

import { ZERO_BI } from "./constants";

export function log_MarketData(
        marketstate: MarketState,
        modifiedTime: BigInt
): void {
        let data_hour = modifiedTime
                .mod(BigInt.fromU32(7260))
                .div(BigInt.fromU32(60));
        let marketData_hour = MarketData.load("h" + data_hour.toString());
        if (marketData_hour === null) {
                marketData_hour = new MarketData("h" + data_hour.toString());
                marketData_hour.modifiedTime = ZERO_BI;

                marketData_hour.timetype = "h";
                marketData_hour.goodCount = marketstate.goodCount;
                marketData_hour.proofCount = marketstate.proofCount;
                marketData_hour.userCount = marketstate.userCount;
                marketData_hour.txCount = marketstate.txCount;
                marketData_hour.totalTradeValue = marketstate.totalTradeValue;
                marketData_hour.totalInvestValue = marketstate.totalInvestValue;
                marketData_hour.totalDisinvestValue = marketstate.totalDisinvestValue;
                marketData_hour.totalTradeCount = marketstate.totalTradeCount;
                marketData_hour.totalInvestCount = marketstate.totalInvestCount;
                marketData_hour.totalDisinvestCount = marketstate.totalDisinvestCount;
                marketData_hour.modifiedTime = modifiedTime;
                marketData_hour.save();
        }
        if (
                marketData_hour.modifiedTime.plus(BigInt.fromU32(60)) <
                marketData_hour.modifiedTime
        ) {
                marketData_hour.goodCount = marketstate.goodCount;
                marketData_hour.proofCount = marketstate.proofCount;
                marketData_hour.userCount = marketstate.userCount;
                marketData_hour.txCount = marketstate.txCount;
                marketData_hour.totalTradeValue = marketstate.totalTradeValue;
                marketData_hour.totalInvestValue = marketstate.totalInvestValue;
                marketData_hour.totalDisinvestValue = marketstate.totalDisinvestValue;
                marketData_hour.totalTradeCount = marketstate.totalTradeCount;
                marketData_hour.totalInvestCount = marketstate.totalInvestCount;
                marketData_hour.totalDisinvestCount = marketstate.totalDisinvestCount;
                marketData_hour.modifiedTime = modifiedTime;
                marketData_hour.save();
        }
       


        let data_day = modifiedTime
                .mod(BigInt.fromU32(174000))
                .div(BigInt.fromU32(1200));
        let marketData_day = MarketData.load("d" + data_day.toString());
        if (marketData_day === null) {
                marketData_day = new MarketData("d" + data_day.toString());
                marketData_day.modifiedTime = ZERO_BI;
                marketData_day.timetype = "d";
                marketData_day.goodCount = marketData_hour.goodCount;
                marketData_day.proofCount = marketData_hour.proofCount;
                marketData_day.userCount = marketData_hour.userCount;
                marketData_day.txCount = marketData_hour.txCount;
                marketData_day.totalTradeValue =
                        marketData_hour.totalTradeValue;
                marketData_day.totalInvestValue =
                        marketData_hour.totalInvestValue;
                marketData_day.totalDisinvestValue =
                        marketData_hour.totalDisinvestValue;
                marketData_day.totalTradeCount =
                        marketData_hour.totalTradeCount;
                marketData_day.totalInvestCount =
                        marketData_hour.totalInvestCount;
                marketData_day.totalDisinvestCount =
                        marketData_hour.totalDisinvestCount;
                marketData_day.modifiedTime = modifiedTime;
                marketData_day.save();
        }
        if (
                marketData_day.modifiedTime.plus(BigInt.fromU32(60)) <
                marketData_hour.modifiedTime
        ) {
                marketData_day.timetype = "d";
                marketData_day.goodCount = marketData_hour.goodCount;
                marketData_day.proofCount = marketData_hour.proofCount;
                marketData_day.userCount = marketData_hour.userCount;
                marketData_day.txCount = marketData_hour.txCount;
                marketData_day.totalTradeValue =
                        marketData_hour.totalTradeValue;
                marketData_day.totalInvestValue =
                        marketData_hour.totalInvestValue;
                marketData_day.totalDisinvestValue =
                        marketData_hour.totalDisinvestValue;
                marketData_day.totalTradeCount =
                        marketData_hour.totalTradeCount;
                marketData_day.totalInvestCount =
                        marketData_hour.totalInvestCount;
                marketData_day.totalDisinvestCount =
                        marketData_hour.totalDisinvestCount;
                marketData_day.modifiedTime = modifiedTime;
                marketData_day.save();
        }

        let data_week = modifiedTime
                .mod(BigInt.fromU32(1220400))
                .div(BigInt.fromU32(10800));
        let marketData_week = MarketData.load("w" + data_week.toString());
        if (marketData_week === null) {
                marketData_week = new MarketData("w" + data_week.toString());
                marketData_week.modifiedTime = ZERO_BI;
                marketData_week.timetype = "w";
                marketData_week.goodCount = marketData_day.goodCount;
                marketData_week.proofCount = marketData_day.proofCount;
                marketData_week.userCount = marketData_day.userCount;
                marketData_week.txCount = marketData_day.txCount;
                marketData_week.totalTradeValue =
                        marketData_day.totalTradeValue;
                marketData_week.totalInvestValue =
                        marketData_day.totalInvestValue;
                marketData_week.totalDisinvestValue =
                        marketData_day.totalDisinvestValue;
                marketData_week.totalTradeCount =
                        marketData_day.totalTradeCount;
                marketData_week.totalInvestCount =
                        marketData_day.totalInvestCount;
                marketData_week.totalDisinvestCount =
                        marketData_day.totalDisinvestCount;
                marketData_week.modifiedTime = modifiedTime;
                marketData_week.save();
        }
        if (
                marketData_week.modifiedTime.plus(BigInt.fromU32(1200)) <
                marketData_day.modifiedTime
        ) {
                marketData_week.timetype = "w";
                marketData_week.goodCount = marketData_day.goodCount;
                marketData_week.proofCount = marketData_day.proofCount;
                marketData_week.userCount = marketData_day.userCount;
                marketData_week.txCount = marketData_day.txCount;
                marketData_week.totalTradeValue =
                        marketData_day.totalTradeValue;
                marketData_week.totalInvestValue =
                        marketData_day.totalInvestValue;
                marketData_week.totalDisinvestValue =
                        marketData_day.totalDisinvestValue;
                marketData_week.totalTradeCount =
                        marketData_day.totalTradeCount;
                marketData_week.totalInvestCount =
                        marketData_day.totalInvestCount;
                marketData_week.totalDisinvestCount =
                        marketData_day.totalDisinvestCount;
                marketData_week.modifiedTime = modifiedTime;
                marketData_week.save();
        }

        let data_month = modifiedTime
                .mod(BigInt.fromU32(5356800))
                .div(BigInt.fromU32(43200));
        let marketData_month = MarketData.load("m" + data_month.toString());
        if (marketData_month === null) {
                marketData_month = new MarketData("m" + data_month.toString());
                marketData_month.modifiedTime = ZERO_BI;
                marketData_month.timetype = "m";
                marketData_month.goodCount = marketData_week.goodCount;
                marketData_month.proofCount = marketData_week.proofCount;
                marketData_month.userCount = marketData_week.userCount;
                marketData_month.txCount = marketData_week.txCount;
                marketData_month.totalTradeValue =
                        marketData_week.totalTradeValue;
                marketData_month.totalInvestValue =
                        marketData_week.totalInvestValue;
                marketData_month.totalDisinvestValue =
                        marketData_week.totalDisinvestValue;
                marketData_month.totalTradeCount =
                        marketData_week.totalTradeCount;
                marketData_month.totalInvestCount =
                        marketData_week.totalInvestCount;
                marketData_month.totalDisinvestCount =
                        marketData_week.totalDisinvestCount;
                marketData_month.modifiedTime = modifiedTime;
                marketData_month.save();
        }
        if (
                marketData_month.modifiedTime.plus(BigInt.fromU32(10800)) <
                marketData_week.modifiedTime
        ) {
                marketData_month.timetype = "m";
                marketData_month.goodCount = marketData_week.goodCount;
                marketData_month.proofCount = marketData_week.proofCount;
                marketData_month.userCount = marketData_week.userCount;
                marketData_month.txCount = marketData_week.txCount;
                marketData_month.totalTradeValue =
                        marketData_week.totalTradeValue;
                marketData_month.totalInvestValue =
                        marketData_week.totalInvestValue;
                marketData_month.totalDisinvestValue =
                        marketData_week.totalDisinvestValue;
                marketData_month.totalTradeCount =
                        marketData_week.totalTradeCount;
                marketData_month.totalInvestCount =
                        marketData_week.totalInvestCount;
                marketData_month.totalDisinvestCount =
                        marketData_week.totalDisinvestCount;
                marketData_month.modifiedTime = modifiedTime;
                marketData_month.save();
        }

        let data_year = modifiedTime.div(BigInt.fromU32(432000));
        let marketData_year = MarketData.load("y" + data_year.toString());
        if (marketData_year === null) {
                marketData_year = new MarketData("y" + data_year.toString());
                marketData_year.timetype = "y";
                marketData_year.goodCount = marketData_month.goodCount;
                marketData_year.proofCount = marketData_month.proofCount;
                marketData_year.userCount = marketData_month.userCount;
                marketData_year.txCount = marketData_month.txCount;
                marketData_year.totalTradeValue =
                        marketData_month.totalTradeValue;
                marketData_year.totalInvestValue =
                        marketData_month.totalInvestValue;
                marketData_year.totalDisinvestValue =
                        marketData_month.totalDisinvestValue;
                marketData_year.totalTradeCount =
                        marketData_month.totalTradeCount;
                marketData_year.totalInvestCount =
                        marketData_month.totalInvestCount;
                marketData_year.totalDisinvestCount =
                        marketData_month.totalDisinvestCount;
                marketData_year.modifiedTime = modifiedTime;
                marketData_year.save();
        }
        if (
                marketData_year.modifiedTime.plus(BigInt.fromU32(43200)) <
                marketData_month.modifiedTime
        ) {
                marketData_year.timetype = "y";
                marketData_year.goodCount = marketData_month.goodCount;
                marketData_year.proofCount = marketData_month.proofCount;
                marketData_year.userCount = marketData_month.userCount;
                marketData_year.txCount = marketData_month.txCount;
                marketData_year.totalTradeValue =
                        marketData_month.totalTradeValue;
                marketData_year.totalInvestValue =
                        marketData_month.totalInvestValue;
                marketData_year.totalDisinvestValue =
                        marketData_month.totalDisinvestValue;
                marketData_year.totalTradeCount =
                        marketData_month.totalTradeCount;
                marketData_year.totalInvestCount =
                        marketData_month.totalInvestCount;
                marketData_year.totalDisinvestCount =
                        marketData_month.totalDisinvestCount;
                marketData_year.modifiedTime = modifiedTime;
                marketData_year.save();
        }
}
