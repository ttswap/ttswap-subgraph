import { bigInt, BigInt, Bytes, dataSource } from "@graphprotocol/graph-ts";

import {
        MarketState,
        GoodState,
        ProofState,
        Transaction,
        Customer,
        Refer,
        Gate,
} from "../generated/schema";

import {
        TTSwap_Market,
        e_buyGood,
        e_initMetaGood,
        e_initGood,
        e_updateGoodConfig,
        e_modifyGoodConfig,
        e_changegoodowner,
        e_investGood,
        e_disinvestProof,
        e_collectcommission,
        e_goodWelfare,
} from "../generated/TTSwap_Market/TTSwap_Market";

import {

        BI_128,
        ZERO_BI,
        ONE_BI,
        ADDRESS_ZERO,
} from "./util/constants";

import {
        fetchTokenSymbol,
        fetchTokenName,
        fetchTokenTotalSupply,
        fetchTokenDecimals,
} from "./util/token";


import { log_GoodData, fetchGoodConfig } from "./util/good";
import { log_MarketData } from "./util/marketData";
import { log_CustomerData } from "./util/customer";
import { log_GateData } from "./util/gate";
import { log_ReferData } from "./util/refer";


/**
 * Handles the event of updating good configuration
 * @param event The e_updateGoodConfig event
 */
export function handle_e_updateGoodConfig(event: e_updateGoodConfig): void {
        let from_good = GoodState.load(event.params._goodid.toHexString());
        if (from_good !== null) {
                // Check if it's a value good
                if (
                        from_good.goodConfig.div(
                                BigInt.fromString(
                                        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
                                )
                        ) >= ONE_BI
                ) {
                        from_good.isvaluegood = true;
                } else {
                        from_good.isvaluegood = false;
                }
                // Update good configuration
                from_good.goodConfig = event.params._goodConfig.mod(
                        BigInt.fromString(
                                "57896044618658097711785492504343953926634992332820282019728792003956564819968"
                        )
                );
                from_good.save();
        }
}

/**
 * Handles the event of modifying good configuration
 * @param event The e_modifyGoodConfig event
 */
export function handle_e_modifyGoodConfig(event: e_modifyGoodConfig): void {
        let from_good = GoodState.load(event.params._goodid.toHexString());
        if (from_good !== null) {
                from_good.goodConfig = fetchGoodConfig(event.params._goodid);
                if (
                        from_good.goodConfig.div(
                                BigInt.fromString(
                                        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
                                )
                        ) >= ONE_BI
                ) {
                        from_good.isvaluegood = true;
                } else {
                        from_good.isvaluegood = false;
                }
                from_good.save();
        }
}

/**
 * Handles the event of initializing a meta good
 * @param event The e_initMetaGood event
 */
export function handle_e_initMetaGood(event: e_initMetaGood): void {
        let address_erc20 = event.params._goodid;
        let erc20address = address_erc20.toHexString();
        let metaowner = event.transaction.from.toHexString();
        let metaid = event.params._goodid.toHexString();
        let stakecontruct = event.params._construct.mod(BI_128);
        let modifiedTime = event.block.timestamp;
        let trade_value = event.params._initial.div(BI_128);
        let trade_quantity = event.params._initial.mod(BI_128);

        let marketstate = MarketState.load("1");
        if (marketstate === null) {
                marketstate = new MarketState("1");
                marketstate.goodCount = ZERO_BI;
                marketstate.proofCount = ZERO_BI;
                marketstate.userCount = BigInt.fromU64(100000);
                marketstate.txCount = ZERO_BI;
                marketstate.totalTradeCount = ZERO_BI;
                marketstate.totalInvestCount = ZERO_BI;
                marketstate.totalDisinvestCount = ZERO_BI;
                marketstate.totalDisinvestValue = ZERO_BI;
                marketstate.totalTradeValue = ZERO_BI;
                marketstate.totalInvestValue = ZERO_BI;
                marketstate.marketCreator =
                        event.transaction.from.toHexString();
        }

        let newcustomer = Customer.load(event.transaction.from.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.transaction.from.toHexString()
                );
                newcustomer.refer = "#";
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.lastgate = "#";
        }
        let gate = Gate.load(newcustomer.lastgate);
        if (gate === null) {
                gate = new Gate(
                        newcustomer.lastgate
                );
                gate.tradeValue = ZERO_BI;
                gate.investValue = ZERO_BI;
                gate.disinvestValue = ZERO_BI;
                gate.tradeCount = ZERO_BI;
                gate.investCount = ZERO_BI;
                gate.disinvestCount = ZERO_BI;
                gate.totalprofitvalue = ZERO_BI;
                gate.totalcommissionvalue = ZERO_BI;
                gate.referralnum = ZERO_BI;
                gate.stakettsvalue = ZERO_BI;
                gate.stakettscontruct = ZERO_BI;
                gate.getfromstake = ZERO_BI;
        }
        gate.investValue = gate.investValue.minus(newcustomer.investValue);
        gate.investCount = gate.investCount.plus(ONE_BI);

        let refer = Refer.load(newcustomer.refer as string);
        if (refer === null) {
                refer = new Refer(
                        newcustomer.refer as string
                );
                refer.tradeValue = ZERO_BI;
                refer.investValue = ZERO_BI;
                refer.disinvestValue = ZERO_BI;
                refer.tradeCount = ZERO_BI;
                refer.investCount = ZERO_BI;
                refer.disinvestCount = ZERO_BI;
                refer.totalprofitvalue = ZERO_BI;
                refer.totalcommissionvalue = ZERO_BI;
                refer.referralnum = ZERO_BI;
                refer.stakettsvalue = ZERO_BI;
                refer.stakettscontruct = ZERO_BI;
                refer.getfromstake = ZERO_BI;
        }


        refer.lastoptime = event.block.timestamp;
        refer.investValue = refer.investValue.minus(newcustomer.investValue);
        refer.investCount = refer.investCount.plus(ONE_BI);


        newcustomer.investValue = newcustomer.investValue.plus(trade_value);
        newcustomer.investCount = newcustomer.investCount.plus(ONE_BI);
        newcustomer.lastoptime = modifiedTime;
        newcustomer.save();

        gate.investValue = gate.investValue.plus(newcustomer.investValue);

        gate.lastoptime = event.block.timestamp;
        gate.save();

        log_GateData(gate, modifiedTime);


        refer.investValue = refer.investValue.plus(newcustomer.investValue);

        refer.lastoptime = modifiedTime;

        refer.save();
        log_ReferData(refer, modifiedTime);

        log_CustomerData(newcustomer, modifiedTime);

        let meta_good = GoodState.load(metaid);
        if (meta_good === null) {
                marketstate.goodCount = marketstate.goodCount.plus(ONE_BI);
                meta_good = new GoodState(metaid);
                meta_good.modifiedTime = modifiedTime;
                meta_good.goodseq = marketstate.goodCount;
                meta_good.isvaluegood = true;
                meta_good.tokenname = fetchTokenName(address_erc20);
                meta_good.tokensymbol = fetchTokenSymbol(address_erc20);
                meta_good.tokentotalsuply =
                        fetchTokenTotalSupply(address_erc20);
                meta_good.tokendecimals = fetchTokenDecimals(address_erc20);
                meta_good.owner = metaowner;
                meta_good.erc20Address = erc20address;
                meta_good.goodConfig = event.params._goodConfig;
                meta_good.virtualQuantity = ZERO_BI;
                meta_good.currentValue = ZERO_BI;
                meta_good.currentQuantity = ZERO_BI;
                meta_good.investQuantity = ZERO_BI;
                meta_good.investShares = ZERO_BI;
                meta_good.investActualQuantity = ZERO_BI;
                meta_good.feeQuantity = ZERO_BI;
                meta_good.totalTradeQuantity = ZERO_BI;
                meta_good.totalInvestQuantity = ZERO_BI;
                meta_good.totalDisinvestQuantity = ZERO_BI;
                meta_good.totalProfit = ZERO_BI;
                meta_good.totalTradeCount = ZERO_BI;
                meta_good.totalInvestCount = ZERO_BI;
                meta_good.totalDisinvestCount = ZERO_BI;
                meta_good.modifiedTime = modifiedTime;
                meta_good.txCount = ZERO_BI;
                meta_good.create_time = modifiedTime;
                meta_good.name_lower = meta_good.tokenname.toLowerCase();
                meta_good.symbol_lower = meta_good.tokensymbol.toLowerCase();
        }
        meta_good.totalInvestQuantity = meta_good.totalInvestQuantity.plus(
                trade_quantity
        );
        meta_good.virtualQuantity = meta_good.virtualQuantity.plus(ZERO_BI);
        meta_good.currentValue = meta_good.currentValue.plus(trade_value);
        meta_good.currentQuantity = meta_good.currentQuantity.plus(trade_quantity);
        meta_good.investQuantity = meta_good.investQuantity.plus(trade_quantity);
        meta_good.investShares = meta_good.investShares.plus(trade_quantity);
        meta_good.investActualQuantity = meta_good.investActualQuantity.plus(trade_quantity);
        meta_good.feeQuantity = meta_good.feeQuantity.plus(ZERO_BI);

        meta_good.totalInvestCount = meta_good.totalInvestCount.plus(ONE_BI);
        meta_good.txCount = meta_good.txCount.plus(ONE_BI);
        meta_good.save();

        let null_good = new GoodState(ADDRESS_ZERO.toString());

        null_good.goodseq = ZERO_BI;
        null_good.isvaluegood = false;
        null_good.tokenname = "#";
        null_good.tokensymbol = "#";
        null_good.tokentotalsuply = ZERO_BI;
        null_good.tokendecimals = ZERO_BI;
        null_good.owner = "#";
        null_good.erc20Address = "#";
        null_good.goodConfig = ZERO_BI;
        null_good.virtualQuantity = ZERO_BI;
        null_good.currentValue = ZERO_BI;
        null_good.currentQuantity = ZERO_BI;
        null_good.investQuantity = ZERO_BI;
        null_good.investShares = ZERO_BI;
        null_good.investActualQuantity = ZERO_BI;
        null_good.feeQuantity = ZERO_BI;
        null_good.totalTradeQuantity = ZERO_BI;
        null_good.totalInvestQuantity = ZERO_BI;
        null_good.totalDisinvestQuantity = ZERO_BI;
        null_good.totalProfit = ZERO_BI;
        null_good.totalTradeCount = ZERO_BI;
        null_good.totalInvestCount = ZERO_BI;
        null_good.totalDisinvestCount = ZERO_BI;
        null_good.modifiedTime = modifiedTime;
        null_good.txCount = ZERO_BI;
        null_good.create_time = modifiedTime;
        null_good.name_lower = null_good.tokenname.toLowerCase();
        null_good.symbol_lower = null_good.tokensymbol.toLowerCase();
        null_good.save();

        let marketmanage = TTSwap_Market.bind(event.address);
        let proofstate = marketmanage.try_getProofState(event.params._proofNo);
        let proof = ProofState.load(event.params._proofNo.toString());
        if (proof === null) {
                proof = new ProofState(event.params._proofNo.toString());
                proof.owner = event.transaction.from.toHexString();
                proof.good1 = meta_good.id;
                proof.good2 = null_good.id;
                proof.proofValue = ZERO_BI;
                proof.good1Shares = ZERO_BI;
                proof.good2Shares = ZERO_BI;
                proof.good1Quantity = ZERO_BI;
                proof.good2Quantity = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.proofActualValue = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                marketstate.proofCount = marketstate.proofCount.plus(ONE_BI);
                proof.createTime = modifiedTime;
        }

        proof.proofValue = proof.proofValue.plus(trade_value);
        proof.good1Shares = proof.proofValue.plus(trade_quantity);
        proof.good2Shares = ZERO_BI;
        proof.good1Quantity = proof.proofValue.plus(trade_quantity);
        proof.good2Quantity = ZERO_BI;
        proof.good1ActualQuantity = proof.proofValue.plus(trade_quantity);
        proof.good2ActualQuantity = ZERO_BI;
        proof.proofActualValue = proof.proofValue.plus(trade_value);
        proof.good1ActualQuantity = proof.proofValue.plus(trade_quantity);
        proof.good2ActualQuantity = ZERO_BI;
        if (!proofstate.reverted) {
                proof.good1 = meta_good.id;
                proof.good2 = null_good.id;
                proof.proofValue = proofstate.value.state.div(BI_128);
                proof.good1Shares = proofstate.value.shares.div(BI_128);
                proof.good2Shares = proofstate.value.shares.mod(BI_128);
                proof.good1Quantity = proofstate.value.invest.div(BI_128);
                proof.good2Quantity = proofstate.value.valueinvest.div(BI_128);
                proof.good1ActualQuantity = proofstate.value.invest.mod(BI_128);
                proof.good2ActualQuantity = proofstate.value.valueinvest.mod(BI_128);
                proof.proofActualValue = proofstate.value.state.mod(BI_128);

        }
        proof.save();

        let transid =
                meta_good.id.toString() +
                meta_good.txCount.mod(BigInt.fromU32(500)).toString();
        let tx = Transaction.load(transid);
        if (tx === null) {
                tx = new Transaction(transid);
                tx.blockNumber = ZERO_BI;
                tx.transtype = "null";
                tx.fromgood = meta_good.id;
                tx.togood = null_good.id;
                tx.fromgoodQuanity = trade_quantity;
                tx.fromgoodfee = ZERO_BI;
                tx.togoodQuantity = ZERO_BI;
                tx.togoodfee = ZERO_BI;
                tx.timestamp = ZERO_BI;
                tx.transActualValue = ZERO_BI;
                tx.fromgoodActualQuanity = ZERO_BI;
                tx.togoodActualQuantity = ZERO_BI;
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
        }
        tx.blockNumber = event.block.number;
        tx.transtype = "meta";
        tx.transvalue = trade_value;
        tx.fromgood = meta_good.id;
        tx.togood = null_good.id;
        tx.fromgoodQuanity = trade_quantity;
        tx.fromgoodfee = ZERO_BI;
        tx.togoodQuantity = ZERO_BI;
        tx.togoodfee = ZERO_BI;
        tx.timestamp = modifiedTime;
        tx.recipent = event.transaction.from.toHexString();
        tx.hash = event.transaction.hash.toHexString();
        tx.transActualValue = trade_value;
        tx.fromgoodActualQuanity = trade_quantity;
        tx.save();

        marketstate.totalInvestValue =
                marketstate.totalInvestValue.plus(trade_value);

        marketstate.totalInvestCount =
                marketstate.totalInvestCount.plus(ONE_BI);
        marketstate.save();
       

        log_GoodData(meta_good, modifiedTime);

        log_MarketData(marketstate, modifiedTime);
        // day
        modifiedTime = modifiedTime.minus(BigInt.fromString("86400"));
        log_GoodData(meta_good, modifiedTime);

        // week
        modifiedTime = modifiedTime.minus(BigInt.fromString("604800"));
        log_GoodData(meta_good, modifiedTime);

        // month
        modifiedTime = modifiedTime.minus(BigInt.fromString("2073600"));
        log_GoodData(meta_good, modifiedTime);

        // year
        modifiedTime = modifiedTime.minus(BigInt.fromString("29376000"));
        log_GoodData(meta_good, modifiedTime);
}
export function handle_e_initGood(event: e_initGood): void {
        let addresserc = event.params._goodid;
        let erc20address = addresserc.toHexString();
        let valuegoodid = event.params._valuegoodNo.toHexString();
        let normalgoodid = event.params._goodid.toHexString();
        let stakecontruct = event.params._construct.mod(BI_128);
        let proofid_BG = event.params._proofNo;
        let marketmanage = TTSwap_Market.bind(event.address);
        let goodowner = event.transaction.from.toHexString();

        let trade_value = event.params._normalinitial.mod(BI_128);
        let trade_actual_value = ZERO_BI;
        let trade_normalgood_quantity = event.params._normalinitial.div(BI_128);
        let trade_normalgood_fee = ZERO_BI;
        let trade_normalgood_shares = event.params._normalinitial.div(BI_128);
        let trade_normalgood_actual_quantity = event.params._normalinitial.div(BI_128);
        let trade_valuegood_quantity = event.params._value.mod(BI_128);
        let trade_valuegood_shares = ZERO_BI;
        let trade_valuegood_actual_quantity = event.params._value.mod(BI_128);
        let trade_valuegood_fee = event.params._value.div(BI_128);

        let proofstate = marketmanage.try_getProofState(proofid_BG);
        if (!proofstate.reverted) {
                trade_value = proofstate.value.state.div(BI_128);
                trade_actual_value = proofstate.value.state.mod(BI_128);
                trade_normalgood_shares = proofstate.value.shares.div(BI_128);
                trade_normalgood_quantity = proofstate.value.invest.div(BI_128);
                trade_normalgood_actual_quantity = proofstate.value.invest.mod(BI_128);
                trade_valuegood_shares = proofstate.value.shares.mod(BI_128);
                trade_valuegood_quantity =
                        proofstate.value.valueinvest.div(BI_128);
                trade_valuegood_fee =
                        event.params._value.div(BI_128);
                trade_valuegood_actual_quantity = proofstate.value.valueinvest.mod(BI_128);
        }

        let modifiedTime = event.block.timestamp;
        let goodConfig = event.params._goodConfig;
        let marketstate = MarketState.load("1");
        if (marketstate === null) {
                marketstate = new MarketState("1");
                marketstate.marketCreator = "#";
                marketstate.goodCount = ZERO_BI;
                marketstate.proofCount = ZERO_BI;
                marketstate.userCount = BigInt.fromU64(100000);
                marketstate.txCount = ZERO_BI;
                marketstate.totalTradeCount = ZERO_BI;
                marketstate.totalInvestCount = ZERO_BI;
                marketstate.totalDisinvestCount = ZERO_BI;
                marketstate.totalDisinvestValue = ZERO_BI;
                marketstate.totalInvestValue = ZERO_BI;
                marketstate.totalTradeValue = ZERO_BI;
        }
        let newcustomer = Customer.load(event.transaction.from.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.transaction.from.toHexString()
                );
                newcustomer.refer = "#";
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.lastgate = "#";
        }

        let gate = Gate.load(newcustomer.lastgate as string);
        if (gate === null) {
                gate = new Gate(
                        newcustomer.lastgate as string
                );
                gate.tradeValue = ZERO_BI;
                gate.investValue = ZERO_BI;
                gate.disinvestValue = ZERO_BI;
                gate.tradeCount = ZERO_BI;
                gate.investCount = ZERO_BI;
                gate.disinvestCount = ZERO_BI;
                gate.totalprofitvalue = ZERO_BI;
                gate.totalcommissionvalue = ZERO_BI;
                gate.referralnum = ZERO_BI;
                gate.stakettsvalue = ZERO_BI;
                gate.stakettscontruct = ZERO_BI;
                gate.getfromstake = ZERO_BI;
        }
        gate.investValue = gate.investValue.minus(newcustomer.investValue);
        gate.investCount = gate.investCount.plus(ONE_BI);

        let refer = Refer.load(newcustomer.refer as string);
        if (refer === null) {
                refer = new Refer(
                        newcustomer.refer as string
                );
                refer.tradeValue = ZERO_BI;
                refer.investValue = ZERO_BI;
                refer.disinvestValue = ZERO_BI;
                refer.tradeCount = ZERO_BI;
                refer.investCount = ZERO_BI;
                refer.disinvestCount = ZERO_BI;
                refer.totalprofitvalue = ZERO_BI;
                refer.totalcommissionvalue = ZERO_BI;
                refer.referralnum = ZERO_BI;
                refer.stakettsvalue = ZERO_BI;
                refer.stakettscontruct = ZERO_BI;
                refer.getfromstake = ZERO_BI;
        }


        refer.lastoptime = event.block.timestamp;

        refer.investValue = refer.investValue.minus(newcustomer.investValue);
        refer.investCount = refer.investCount.plus(ONE_BI);

        newcustomer.investValue = newcustomer.investValue.plus(trade_value);
        newcustomer.investValue = newcustomer.investValue.plus(trade_value);
        newcustomer.investCount = newcustomer.investCount.plus(ONE_BI);
        newcustomer.lastoptime = modifiedTime;
        newcustomer.stakettsvalue = newcustomer.stakettsvalue.plus(trade_value.times(bigInt.fromString('2')));
        newcustomer.stakettscontruct = newcustomer.stakettscontruct.plus(stakecontruct);
        newcustomer.save();

        gate.investValue = gate.investValue.plus(newcustomer.investValue);

        gate.stakettsvalue = gate.stakettsvalue.plus(trade_value.times(bigInt.fromString('2')));
        gate.stakettscontruct = gate.stakettscontruct.plus(stakecontruct);
        gate.lastoptime = event.block.timestamp;
        gate.save();



        log_GateData(gate, modifiedTime);

        refer.investValue = refer.investValue.plus(newcustomer.investValue);
        refer.save();
        log_ReferData(refer, modifiedTime);

        log_CustomerData(newcustomer, modifiedTime);
        let normal_good = GoodState.load(normalgoodid);
        if (normal_good === null) {
                marketstate.goodCount = marketstate.goodCount.plus(ONE_BI);
                normal_good = new GoodState(normalgoodid);
                normal_good.modifiedTime = modifiedTime;
                normal_good.goodseq = marketstate.goodCount;
                normal_good.isvaluegood = false;
                normal_good.tokenname = fetchTokenName(addresserc);
                normal_good.tokensymbol = fetchTokenSymbol(addresserc);
                normal_good.tokentotalsuply = fetchTokenTotalSupply(addresserc);
                normal_good.tokendecimals = fetchTokenDecimals(addresserc);
                normal_good.erc20Address = erc20address;
                normal_good.goodConfig = goodConfig;
                normal_good.goodConfig = ZERO_BI;
                normal_good.virtualQuantity = ZERO_BI;
                normal_good.currentValue = ZERO_BI;
                normal_good.currentQuantity = ZERO_BI;
                normal_good.investQuantity = ZERO_BI;
                normal_good.investShares = ZERO_BI;
                normal_good.investActualQuantity = ZERO_BI;
                normal_good.feeQuantity = ZERO_BI;
                normal_good.totalTradeQuantity = ZERO_BI;
                normal_good.totalInvestQuantity = ZERO_BI;
                normal_good.totalDisinvestQuantity = ZERO_BI;
                normal_good.totalProfit = ZERO_BI;
                normal_good.totalTradeCount = ZERO_BI;
                normal_good.totalInvestCount = ZERO_BI;
                normal_good.totalDisinvestCount = ZERO_BI;
                normal_good.modifiedTime = ZERO_BI;
                normal_good.txCount = ZERO_BI;
                normal_good.create_time = modifiedTime;
                normal_good.name_lower = normal_good.tokenname.toLowerCase();
                normal_good.symbol_lower =
                        normal_good.tokensymbol.toLowerCase();
                normal_good.owner = goodowner;
        }


        normal_good.virtualQuantity = normal_good.virtualQuantity.plus(ZERO_BI);
        normal_good.currentValue = normal_good.currentValue.plus(trade_value);
        normal_good.currentQuantity = normal_good.currentQuantity.plus(trade_normalgood_quantity);
        normal_good.investQuantity = normal_good.investQuantity.plus(trade_normalgood_quantity);
        normal_good.investShares = normal_good.investShares.plus(trade_normalgood_shares);
        normal_good.investActualQuantity = normal_good.investActualQuantity.plus(trade_normalgood_actual_quantity);
        normal_good.feeQuantity = normal_good.feeQuantity.plus(trade_normalgood_fee);

        let normalgoodstate = TTSwap_Market.bind(event.address).try_getGoodState(
                event.params._goodid
        );

        if (!normalgoodstate.reverted) {
                normal_good.virtualQuantity = normalgoodstate.value.goodConfig.mod(BI_128);
                normal_good.currentValue = normalgoodstate.value.investState.mod(BI_128);
                normal_good.currentQuantity = normalgoodstate.value.currentState.mod(BI_128);
                normal_good.investQuantity = normalgoodstate.value.currentState.div(BI_128)
                normal_good.investShares = normalgoodstate.value.investState.div(BI_128);
                normal_good.investActualQuantity = normal_good.investQuantity.minus(normal_good.virtualQuantity);
        }
        normal_good.totalInvestQuantity = normal_good.totalInvestQuantity.plus(
                normal_good.investActualQuantity
        );
        normal_good.totalInvestCount =
                normal_good.totalInvestCount.plus(ONE_BI);
        normal_good.modifiedTime = modifiedTime;
        normal_good.txCount = normal_good.txCount.plus(ONE_BI);
        if (
                normal_good.goodConfig.div(
                        BigInt.fromString(
                                "57896044618658097711785492504343953926634992332820282019728792003956564819968"
                        )
                ) >= ONE_BI
        ) {
                normal_good.isvaluegood = true;
        } else {
                normal_good.isvaluegood = false;
        }
        normal_good.goodConfig = event.params._goodConfig.mod(
                BigInt.fromString(
                        "57896044618658097711785492504343953926634992332820282019728792003956564819968"
                )
        );
        normal_good.save();
        let value_good = GoodState.load(valuegoodid);
        if (value_good === null) {
                value_good = new GoodState(valuegoodid);
                value_good.goodseq = ZERO_BI;
                value_good.isvaluegood = false;
                value_good.tokenname = "#";
                value_good.tokensymbol = "#";
                value_good.tokentotalsuply = ZERO_BI;
                value_good.tokendecimals = ZERO_BI;
                value_good.owner = "#";
                value_good.erc20Address = "#";
                value_good.goodConfig = ZERO_BI;
                value_good.virtualQuantity = ZERO_BI;
                value_good.currentValue = ZERO_BI;
                value_good.currentQuantity = ZERO_BI;
                value_good.investQuantity = ZERO_BI;
                value_good.investShares = ZERO_BI;
                value_good.investActualQuantity = ZERO_BI;
                value_good.feeQuantity = ZERO_BI;
                value_good.totalTradeQuantity = ZERO_BI;
                value_good.totalInvestQuantity = ZERO_BI;
                value_good.totalDisinvestQuantity = ZERO_BI;
                value_good.totalProfit = ZERO_BI;
                value_good.totalTradeCount = ZERO_BI;
                value_good.totalInvestCount = ZERO_BI;
                value_good.totalDisinvestCount = ZERO_BI;
                value_good.modifiedTime = ZERO_BI;
                value_good.txCount = ZERO_BI;
                value_good.create_time = ZERO_BI;
                value_good.name_lower = value_good.tokenname.toLowerCase();
                value_good.symbol_lower = value_good.tokensymbol.toLowerCase();
        }
        let valuegoodstate = TTSwap_Market.bind(event.address).try_getGoodState(
                event.params._valuegoodNo
        );

        value_good.virtualQuantity = value_good.virtualQuantity.plus(ZERO_BI);
        value_good.currentValue = value_good.currentValue.plus(trade_value);
        value_good.currentQuantity = value_good.currentQuantity.plus(event.params._value.mod(BI_128));
        value_good.investQuantity = value_good.investQuantity.plus(event.params._value.mod(BI_128));
        value_good.investShares = value_good.investShares.plus(event.params._value.mod(BI_128));
        value_good.investActualQuantity = value_good.investActualQuantity.plus(event.params._value.mod(BI_128));
        value_good.feeQuantity = value_good.feeQuantity.plus(trade_valuegood_fee);
        if (!valuegoodstate.reverted) {
                value_good.virtualQuantity = valuegoodstate.value.goodConfig.mod(BI_128);
                value_good.currentValue = valuegoodstate.value.investState.mod(BI_128);
                value_good.currentQuantity = valuegoodstate.value.currentState.mod(BI_128);
                value_good.investQuantity = valuegoodstate.value.currentState.div(BI_128)
                value_good.investShares = valuegoodstate.value.investState.div(BI_128);
                value_good.investActualQuantity = value_good.investQuantity.minus(value_good.virtualQuantity);
        }
        value_good.totalInvestQuantity = value_good.totalInvestQuantity.plus(
                event.params._value.mod(BI_128)
        );
        value_good.totalInvestCount = value_good.totalInvestCount.plus(ONE_BI);
        value_good.modifiedTime = modifiedTime;
        value_good.txCount = value_good.txCount.plus(ONE_BI);
        value_good.save();
        let proof = ProofState.load(proofid_BG.toString());
        if (proof === null) {
                proof = new ProofState(proofid_BG.toString());
                proof.owner = event.transaction.from.toHexString();
                proof.good1 = normal_good.id;
                proof.good2 = value_good.id;


                proof.proofValue = ZERO_BI;
                proof.good1Shares = ZERO_BI;
                proof.good1Quantity = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2Shares = ZERO_BI;
                proof.good2Quantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.proofActualValue = ZERO_BI;

                proof.createTime = event.block.timestamp;
                marketstate.proofCount = marketstate.proofCount.plus(ONE_BI);
        }
        proof.proofValue = proof.proofValue.plus(trade_value);
        proof.proofActualValue = proof.proofActualValue.plus(trade_actual_value);
        proof.good1Shares = proof.good1Shares.plus(trade_normalgood_shares);
        proof.good1Quantity = proof.good1Quantity.plus(trade_normalgood_quantity);
        proof.good1ActualQuantity = proof.good1ActualQuantity.plus(trade_normalgood_actual_quantity);
        proof.good2Shares = proof.good2Shares.plus(trade_valuegood_shares);
        proof.good2Quantity = proof.good2Quantity.plus(trade_valuegood_quantity);
        proof.good2ActualQuantity = proof.good2ActualQuantity.plus(trade_valuegood_actual_quantity);
        proof.createTime = modifiedTime;
        proof.save();
        let transid =
                normal_good.id.toString() +
                normal_good.txCount.mod(BigInt.fromU32(500)).toString();
        let tx = Transaction.load(transid);
        if (tx === null) {
                tx = new Transaction(transid);
                tx.blockNumber = ZERO_BI;
                tx.transtype = "null";
                tx.fromgood = normal_good.id;
                tx.togood = value_good.id;
                tx.fromgoodQuanity = ZERO_BI;
                tx.fromgoodfee = ZERO_BI;
                tx.togoodQuantity = ZERO_BI;
                tx.togoodfee = ZERO_BI;
                tx.timestamp = ZERO_BI;
                tx.transActualValue = ZERO_BI;
                tx.fromgoodActualQuanity = ZERO_BI;
                tx.togoodActualQuantity = ZERO_BI;
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
        }
        tx.blockNumber = event.block.number;
        tx.transtype = "init";
        tx.transvalue = trade_value.times(BigInt.fromString("2"));
        tx.fromgood = normal_good.id;
        tx.togood = value_good.id;
        tx.fromgoodQuanity = trade_normalgood_quantity;
        tx.togoodQuantity = trade_valuegood_quantity;
        tx.timestamp = modifiedTime;
        tx.recipent = event.transaction.from.toHexString();
        tx.hash = event.transaction.hash.toHexString();
        tx.transActualValue = trade_value.times(BigInt.fromString("2"));;
        tx.fromgoodActualQuanity = trade_normalgood_quantity;
        tx.togoodActualQuantity = trade_valuegood_quantity;
        tx.save();
        marketstate.totalInvestValue =
                marketstate.totalInvestValue.plus(trade_value);
        marketstate.totalInvestValue =
                marketstate.totalInvestValue.plus(trade_value);
        marketstate.totalInvestCount =
                marketstate.totalInvestCount.plus(ONE_BI);
        marketstate.save();
        
        log_GoodData(value_good, modifiedTime);
        log_GoodData(normal_good, modifiedTime);
        log_MarketData(marketstate, modifiedTime);
        //day
        modifiedTime = modifiedTime.minus(BigInt.fromString("86400"));
        log_GoodData(normal_good, modifiedTime);
        //week
        modifiedTime = modifiedTime.minus(BigInt.fromString("604800"));
        log_GoodData(normal_good, modifiedTime);
        //month
        modifiedTime = modifiedTime.minus(BigInt.fromString("2073600"));
        log_GoodData(normal_good, modifiedTime);
        //year
        modifiedTime = modifiedTime.minus(BigInt.fromString("29376000"));
        log_GoodData(normal_good, modifiedTime);
}

export function handle_e_buyGood(event: e_buyGood): void {
        let fromgood = event.params.sellgood.toHexString();
        let togood = event.params.forgood.toHexString();
        let trade_value1 = event.params.swapvalue.mod(BI_128);
        let trade_value2 = event.params.swapvalue.div(BI_128);

        let from_quantity = event.params.good1change.mod(BI_128);
        let from_fee = event.params.good1change.div(BI_128);
        let to_quantity = event.params.good2change.mod(BI_128);
        let to_fee = event.params.good2change.div(BI_128);
        let marketstate = MarketState.load("1");
        if (marketstate === null) {
                marketstate = new MarketState("1");

                marketstate.marketCreator = "#";
                marketstate.goodCount = ZERO_BI;
                marketstate.proofCount = ZERO_BI;
                marketstate.userCount = BigInt.fromU64(100000);
                marketstate.txCount = ZERO_BI;
                marketstate.totalTradeCount = ZERO_BI;
                marketstate.totalInvestCount = ZERO_BI;
                marketstate.totalDisinvestCount = ZERO_BI;
                marketstate.totalDisinvestValue = ZERO_BI;
                marketstate.totalInvestValue = ZERO_BI;
                marketstate.totalTradeValue = ZERO_BI;
        }
        let from_good = GoodState.load(fromgood);
        if (from_good === null) {
                from_good = new GoodState(fromgood);
                from_good.goodseq = ZERO_BI;
                from_good.isvaluegood = false;
                from_good.tokenname = "#";
                from_good.tokensymbol = "#";
                from_good.tokentotalsuply = ZERO_BI;
                from_good.tokendecimals = ZERO_BI;
                from_good.owner = "#";
                from_good.erc20Address = "#";
                from_good.goodConfig = ZERO_BI;
                from_good.virtualQuantity = ZERO_BI;
                from_good.currentValue = ZERO_BI;
                from_good.currentQuantity = ZERO_BI;
                from_good.investQuantity = ZERO_BI;
                from_good.investShares = ZERO_BI;
                from_good.investActualQuantity = ZERO_BI;
                from_good.feeQuantity = ZERO_BI;
                from_good.totalTradeQuantity = ZERO_BI;
                from_good.totalInvestQuantity = ZERO_BI;
                from_good.totalDisinvestQuantity = ZERO_BI;
                from_good.totalProfit = ZERO_BI;
                from_good.totalTradeCount = ZERO_BI;
                from_good.totalInvestCount = ZERO_BI;
                from_good.totalDisinvestCount = ZERO_BI;
                from_good.modifiedTime = ZERO_BI;
                from_good.txCount = ZERO_BI;
                from_good.create_time = ZERO_BI;
                from_good.name_lower = "#";
                from_good.symbol_lower = "#";
        }
        let goodcurrentstate = TTSwap_Market.bind(
                event.address
        ).try_getGoodState(event.params.sellgood);

        from_good.currentQuantity = from_good.currentQuantity.plus(from_quantity);
        from_good.investQuantity = from_good.investQuantity.plus(from_fee);
        from_good.investActualQuantity = from_good.investActualQuantity.plus(from_fee);
        from_good.feeQuantity = from_good.feeQuantity.plus(from_fee);
        if (!goodcurrentstate.reverted) {

                from_good.currentValue = goodcurrentstate.value.investState.mod(BI_128);
                from_good.currentQuantity = goodcurrentstate.value.currentState.mod(BI_128);
                from_good.investQuantity = goodcurrentstate.value.currentState.div(BI_128)
                from_good.investActualQuantity = from_good.investQuantity.minus(from_good.virtualQuantity);
        }
        from_good.totalTradeCount = from_good.totalTradeCount.plus(ONE_BI);
        from_good.totalTradeQuantity = from_good.totalTradeQuantity.plus(
                from_quantity
        );
        from_good.txCount = from_good.txCount.plus(ONE_BI);
        from_good.modifiedTime = event.block.timestamp;
        from_good.save();
        let to_good = GoodState.load(togood);
        if (to_good === null) {
                to_good = new GoodState(togood);
                to_good.goodseq = ZERO_BI;
                to_good.isvaluegood = false;
                to_good.tokenname = "#";
                to_good.tokensymbol = "#";
                to_good.tokentotalsuply = ZERO_BI;
                to_good.tokendecimals = ZERO_BI;
                to_good.owner = "#";
                to_good.erc20Address = "#";
                to_good.goodConfig = ZERO_BI;
                to_good.virtualQuantity = ZERO_BI;
                to_good.currentValue = ZERO_BI;
                to_good.currentQuantity = ZERO_BI;
                to_good.investQuantity = ZERO_BI;
                to_good.investShares = ZERO_BI;
                to_good.investActualQuantity = ZERO_BI;
                to_good.feeQuantity = ZERO_BI;
                to_good.totalTradeQuantity = ZERO_BI;
                to_good.totalInvestQuantity = ZERO_BI;
                to_good.totalDisinvestQuantity = ZERO_BI;
                to_good.totalProfit = ZERO_BI;
                to_good.totalTradeCount = ZERO_BI;
                to_good.totalInvestCount = ZERO_BI;
                to_good.totalDisinvestCount = ZERO_BI;
                to_good.modifiedTime = ZERO_BI;
                to_good.txCount = ZERO_BI;
                to_good.create_time = ZERO_BI;
                to_good.name_lower = "#";
                to_good.symbol_lower = "#";
        }
        let togoodcurrentstate = TTSwap_Market.bind(
                event.address
        ).try_getGoodState(event.params.forgood);
        to_good.currentQuantity = to_good.currentQuantity.minus(to_quantity);
        to_good.investQuantity = to_good.investQuantity.plus(to_fee);
        to_good.investActualQuantity = to_good.investActualQuantity.minus(to_quantity);
        to_good.feeQuantity = to_good.feeQuantity.plus(to_fee);
        if (!goodcurrentstate.reverted) {

                to_good.currentValue = togoodcurrentstate.value.investState.mod(BI_128);
                to_good.currentQuantity = togoodcurrentstate.value.currentState.mod(BI_128);
                to_good.investQuantity = togoodcurrentstate.value.currentState.div(BI_128)
                to_good.investActualQuantity = to_good.investQuantity.minus(to_good.virtualQuantity);
        }

        to_good.totalTradeCount = to_good.totalTradeCount.plus(ONE_BI);
        to_good.totalTradeQuantity = to_good.totalTradeQuantity.plus(
                to_quantity
        );
        to_good.modifiedTime = event.block.timestamp;
        to_good.txCount = to_good.txCount.plus(ONE_BI);
        to_good.save();
        let newcustomer = Customer.load(event.transaction.from.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.transaction.from.toHexString()
                );
                newcustomer.refer = "#";
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.lastgate = "#";
        }

        let gate = Gate.load(newcustomer.lastgate as string);
        if (gate === null) {
                gate = new Gate(
                        newcustomer.lastgate as string
                );
                gate.tradeValue = ZERO_BI;
                gate.investValue = ZERO_BI;
                gate.disinvestValue = ZERO_BI;
                gate.tradeCount = ZERO_BI;
                gate.investCount = ZERO_BI;
                gate.disinvestCount = ZERO_BI;
                gate.totalprofitvalue = ZERO_BI;
                gate.totalcommissionvalue = ZERO_BI;
                gate.referralnum = ZERO_BI;
                gate.stakettsvalue = ZERO_BI;
                gate.stakettscontruct = ZERO_BI;
                gate.getfromstake = ZERO_BI;
        }
        gate.tradeValue = gate.tradeValue.minus(newcustomer.tradeValue);
        gate.tradeCount = gate.tradeCount.plus(ONE_BI);

        let refer = Refer.load(newcustomer.refer as string);
        if (refer === null) {
                refer = new Refer(
                        newcustomer.refer as string
                );
                refer.tradeValue = ZERO_BI;
                refer.investValue = ZERO_BI;
                refer.disinvestValue = ZERO_BI;
                refer.tradeCount = ZERO_BI;
                refer.investCount = ZERO_BI;
                refer.disinvestCount = ZERO_BI;
                refer.totalprofitvalue = ZERO_BI;
                refer.totalcommissionvalue = ZERO_BI;
                refer.referralnum = ZERO_BI;
                refer.stakettsvalue = ZERO_BI;
                refer.stakettscontruct = ZERO_BI;
                refer.getfromstake = ZERO_BI;
        }

        refer.lastoptime = event.block.timestamp;
        refer.tradeValue = refer.tradeValue.minus(newcustomer.tradeValue);
        refer.tradeCount = refer.tradeCount.plus(ONE_BI);
        if (trade_value1.equals(ZERO_BI)) {
                newcustomer.tradeValue =
                        newcustomer.tradeValue.plus(trade_value2);
        } else {
                newcustomer.tradeValue =
                        newcustomer.tradeValue.plus(trade_value1);
        }

        newcustomer.tradeCount = newcustomer.tradeCount.plus(ONE_BI);
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();
        gate.tradeValue = gate.tradeValue.plus(newcustomer.tradeValue);

        gate.lastoptime = event.block.timestamp;
        gate.save();
        log_GateData(gate, event.block.timestamp);

        refer.tradeValue = refer.tradeValue.plus(newcustomer.tradeValue);
        refer.lastoptime = event.block.timestamp;

        refer.save();
        log_ReferData(refer, event.block.timestamp);

        log_CustomerData(newcustomer, event.block.timestamp);
        marketstate.txCount = marketstate.txCount.plus(ONE_BI);
        marketstate.totalTradeCount = marketstate.totalTradeCount.plus(ONE_BI);
        if (trade_value1.equals(ZERO_BI)) {
                marketstate.totalTradeValue =
                        marketstate.totalTradeValue.plus(trade_value2);
        } else {
                marketstate.totalTradeValue =
                        marketstate.totalTradeValue.plus(trade_value1);
        }

        marketstate.save();
        let transid =
                from_good.id.toString() +
                from_good.txCount.mod(BigInt.fromU32(500)).toString();
        let tx = Transaction.load(transid);
        if (tx === null) {
                tx = new Transaction(transid);
                tx.blockNumber = ZERO_BI;
                tx.transtype = "null";
                tx.fromgood = from_good.id;
                tx.togood = to_good.id;
                tx.fromgoodQuanity = ZERO_BI;
                tx.fromgoodfee = ZERO_BI;
                tx.togoodQuantity = ZERO_BI;
                tx.togoodfee = ZERO_BI;
                tx.timestamp = ZERO_BI;
                tx.transActualValue = ZERO_BI;
                tx.fromgoodActualQuanity = ZERO_BI;
                tx.togoodActualQuantity = ZERO_BI;
        }
        tx.blockNumber = event.block.number;
        if (trade_value1.equals(ZERO_BI)) {
                tx.transtype = "pay";
                tx.transvalue = trade_value2;
        } else {
                tx.transtype = "buy";
                tx.transvalue = trade_value1;
        }
        tx.fromgood = from_good.id;
        tx.togood = to_good.id;
        tx.fromgoodQuanity = from_quantity;
        tx.fromgoodfee = from_fee;
        tx.togoodQuantity = to_quantity;
        tx.togoodfee = to_fee;
        tx.timestamp = event.block.timestamp;
        tx.recipent = event.transaction.from.toHexString();
        tx.hash = event.transaction.hash.toHexString();
        tx.save();
        log_GoodData(from_good, event.block.timestamp);
        log_GoodData(to_good, event.block.timestamp);
        log_MarketData(marketstate, event.block.timestamp);
}

export function handle_e_investGood(event: e_investGood): void {
        let normalgoodid = event.params._normalgoodid.toHexString();
        let stakecontruct = event.params._value.mod(BI_128);
        let valuegoodid = event.params._valueGoodNo.toHexString();
        let proofNo = event.params._proofNo.toString();
        let marketmanage = TTSwap_Market.bind(event.address);
        let proofstate = marketmanage.try_getProofState(event.params._proofNo);
        let invest_normal_shares = proofstate.value.shares.div(BI_128);
        let invest_value_shares = proofstate.value.shares.mod(BI_128);
        let invest_value = proofstate.value.state.div(BI_128);
        let invest_normal_quantity = proofstate.value.invest.div(BI_128);
        let invest_normal_actual_quantity = proofstate.value.invest.mod(BI_128)
                ;

        let invest_value_quantity = proofstate.value.valueinvest.div(BI_128);
        let invest_value_actual_quantity = proofstate.value.valueinvest.mod(BI_128);
        let invest_actualvalue = proofstate.value.state.mod(BI_128);


        let proof = ProofState.load(proofNo);
        if (proof === null) {
                proof = new ProofState(proofNo);
                proof.owner = event.transaction.from.toHexString();
                proof.good1 = normalgoodid;
                proof.good2 = valuegoodid;
                proof.proofValue = ZERO_BI;
                proof.good1Shares = ZERO_BI;
                proof.good2Shares = ZERO_BI;
                proof.good1Quantity = ZERO_BI;
                proof.good2Quantity = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.proofActualValue = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.createTime = event.block.timestamp;
        }
        let normal_good = GoodState.load(normalgoodid);
        if (normal_good === null) {
                normal_good = new GoodState(normalgoodid);
                normal_good.goodseq = ZERO_BI;
                normal_good.isvaluegood = false;
                normal_good.tokenname = "#";
                normal_good.tokensymbol = "#";
                normal_good.tokentotalsuply = ZERO_BI;
                normal_good.tokendecimals = ZERO_BI;
                normal_good.owner = "#";
                normal_good.erc20Address = "#";
                normal_good.goodConfig = ZERO_BI;
                normal_good.virtualQuantity = ZERO_BI;
                normal_good.currentValue = ZERO_BI;
                normal_good.currentQuantity = ZERO_BI;
                normal_good.investQuantity = ZERO_BI;
                normal_good.investShares = ZERO_BI;
                normal_good.investActualQuantity = ZERO_BI;
                normal_good.feeQuantity = ZERO_BI;
                normal_good.totalTradeQuantity = ZERO_BI;
                normal_good.totalInvestQuantity = ZERO_BI;
                normal_good.totalDisinvestQuantity = ZERO_BI;
                normal_good.totalProfit = ZERO_BI;
                normal_good.totalTradeCount = ZERO_BI;
                normal_good.totalInvestCount = ZERO_BI;
                normal_good.totalDisinvestCount = ZERO_BI;
                normal_good.modifiedTime = ZERO_BI;
                normal_good.txCount = ZERO_BI;
                normal_good.create_time = ZERO_BI;
                normal_good.name_lower = "#";
                normal_good.symbol_lower = "#";
        }
        let normalcurrentstate = TTSwap_Market.bind(
                event.address
        ).try_getGoodState(event.params._normalgoodid);




        normal_good.feeQuantity = normal_good.feeQuantity.plus(
                event.params._invest.div(BI_128)
        );
        if (!normalcurrentstate.reverted) {
                normal_good.virtualQuantity = normalcurrentstate.value.goodConfig.mod(BI_128);
                normal_good.currentValue = normalcurrentstate.value.investState.mod(BI_128);
                normal_good.currentQuantity = normalcurrentstate.value.currentState.mod(BI_128);
                normal_good.investQuantity = normalcurrentstate.value.currentState.div(BI_128)
                normal_good.investShares = normalcurrentstate.value.investState.div(BI_128);
                normal_good.investActualQuantity = normal_good.investQuantity.minus(normal_good.virtualQuantity);

        } else {
                normal_good.virtualQuantity = normal_good.virtualQuantity.minus(proof.good1Quantity.minus(proof.good1Shares));
                normal_good.currentValue = normal_good.currentValue.minus(proof.proofValue);
                normal_good.currentQuantity = normal_good.currentQuantity.minus(
                        proof.good1Quantity
                );
                normal_good.investQuantity = normal_good.investQuantity.minus(
                        proof.good1Quantity
                );
                normal_good.investShares = normal_good.investShares.minus(proof.good1Shares);
                normal_good.investActualQuantity = normal_good.investActualQuantity.minus(proof.good1ActualQuantity);


                normal_good.virtualQuantity = normal_good.virtualQuantity.plus(invest_normal_quantity.minus(invest_normal_actual_quantity));
                normal_good.currentValue = normal_good.currentValue.plus(invest_value);
                normal_good.currentQuantity = normal_good.currentQuantity.plus(
                        invest_normal_quantity
                );
                normal_good.investQuantity = normal_good.investQuantity.plus(
                        invest_normal_quantity
                );
                normal_good.investShares = normal_good.investShares.plus(invest_normal_shares);
                normal_good.investActualQuantity = normal_good.investActualQuantity.plus(invest_normal_actual_quantity);

        }

        normal_good.totalInvestQuantity = normal_good.totalInvestQuantity.minus(
                proof.good1Quantity
        );
        normal_good.totalInvestQuantity =
                normal_good.totalInvestQuantity.plus(invest_normal_quantity);

        normal_good.totalInvestCount =
                normal_good.totalInvestCount.plus(ONE_BI);
        normal_good.modifiedTime = event.block.timestamp;
        normal_good.txCount = normal_good.txCount.plus(ONE_BI);
        normal_good.save();
        let marketstate = MarketState.load("1");
        if (marketstate === null) {
                marketstate = new MarketState("1");

                marketstate.marketCreator = "#";
                marketstate.goodCount = ZERO_BI;
                marketstate.proofCount = ZERO_BI;
                marketstate.userCount = BigInt.fromU64(100000);
                marketstate.txCount = ZERO_BI;
                marketstate.totalTradeCount = ZERO_BI;
                marketstate.totalInvestCount = ZERO_BI;
                marketstate.totalDisinvestCount = ZERO_BI;
                marketstate.totalDisinvestValue = ZERO_BI;
                marketstate.totalTradeValue = ZERO_BI;
        }
        if (valuegoodid != ADDRESS_ZERO) {
                let newcustomer = Customer.load(
                        event.transaction.from.toHexString()
                );
                if (newcustomer === null) {
                        newcustomer = new Customer(
                                event.transaction.from.toHexString()
                        );
                        newcustomer.refer = "#";
                        newcustomer.tradeValue = ZERO_BI;
                        newcustomer.investValue = ZERO_BI;
                        newcustomer.disinvestValue = ZERO_BI;
                        newcustomer.tradeCount = ZERO_BI;
                        newcustomer.investCount = ZERO_BI;
                        newcustomer.disinvestCount = ZERO_BI;
                        newcustomer.userConfig = ZERO_BI;
                        marketstate.userCount =
                                marketstate.userCount.plus(ONE_BI);
                        newcustomer.customerno = marketstate.userCount;
                        newcustomer.totalprofitvalue = ZERO_BI;
                        newcustomer.totalcommissionvalue = ZERO_BI;
                        newcustomer.referralnum = ZERO_BI;
                        newcustomer.getfromstake = ZERO_BI;
                        newcustomer.stakettsvalue = ZERO_BI;
                        newcustomer.stakettscontruct = ZERO_BI;
                        newcustomer.lastgate = "#";
                }

                let refer = Refer.load(newcustomer.refer as string);
                if (refer === null) {
                        refer = new Refer(
                                newcustomer.refer as string
                        );
                        refer.tradeValue = ZERO_BI;
                        refer.investValue = ZERO_BI;
                        refer.disinvestValue = ZERO_BI;
                        refer.tradeCount = ZERO_BI;
                        refer.investCount = ZERO_BI;
                        refer.disinvestCount = ZERO_BI;
                        refer.totalprofitvalue = ZERO_BI;
                        refer.totalcommissionvalue = ZERO_BI;
                        refer.referralnum = ZERO_BI;
                        refer.stakettsvalue = ZERO_BI;
                        refer.stakettscontruct = ZERO_BI;
                        refer.getfromstake = ZERO_BI;
                }

                refer.investValue = refer.investValue.minus(newcustomer.investValue);
                refer.investCount = refer.investCount.plus(ONE_BI);


                let gate = Gate.load(newcustomer.lastgate as string);
                if (gate === null) {
                        gate = new Gate(
                                newcustomer.lastgate as string
                        );
                        gate.tradeValue = ZERO_BI;
                        gate.investValue = ZERO_BI;
                        gate.disinvestValue = ZERO_BI;
                        gate.tradeCount = ZERO_BI;
                        gate.investCount = ZERO_BI;
                        gate.disinvestCount = ZERO_BI;
                        gate.totalprofitvalue = ZERO_BI;
                        gate.totalcommissionvalue = ZERO_BI;
                        gate.referralnum = ZERO_BI;
                        gate.stakettsvalue = ZERO_BI;
                        gate.stakettscontruct = ZERO_BI;
                        gate.getfromstake = ZERO_BI;
                }

                gate.investValue = gate.investValue.minus(newcustomer.investValue);
                gate.investCount = gate.investCount.plus(ONE_BI);

                newcustomer.investValue = newcustomer.investValue.minus(
                        proof.proofValue
                );
                newcustomer.investValue = newcustomer.investValue.minus(
                        proof.proofValue
                );
                newcustomer.investValue =
                        newcustomer.investValue.plus(invest_value);
                newcustomer.investValue =
                        newcustomer.investValue.plus(invest_value);
                newcustomer.investCount = newcustomer.investCount.plus(ONE_BI);
                newcustomer.lastoptime = event.block.timestamp;

                newcustomer.save();

                gate.investValue = gate.investValue.plus(newcustomer.investValue);

                gate.lastoptime = event.block.timestamp;
                gate.save();

                refer.investValue = refer.investValue.minus(newcustomer.investValue);

                refer.lastoptime = event.block.timestamp;

                refer.save()

                log_CustomerData(newcustomer, event.block.timestamp);
                let value_good = GoodState.load(valuegoodid);
                if (value_good === null) {
                        value_good = new GoodState(valuegoodid);
                        value_good.goodseq = ZERO_BI;
                        value_good.isvaluegood = false;
                        value_good.tokenname = "#";
                        value_good.tokensymbol = "#";
                        value_good.tokentotalsuply = ZERO_BI;
                        value_good.tokendecimals = ZERO_BI;
                        value_good.owner = "#";
                        value_good.erc20Address = "#";
                        value_good.goodConfig = ZERO_BI;
                        value_good.virtualQuantity = ZERO_BI;
                        value_good.currentValue = ZERO_BI;
                        value_good.currentQuantity = ZERO_BI;
                        value_good.investQuantity = ZERO_BI;
                        value_good.investShares = ZERO_BI;
                        value_good.investActualQuantity = ZERO_BI;
                        value_good.feeQuantity = ZERO_BI;

                        value_good.totalTradeQuantity = ZERO_BI;
                        value_good.totalInvestQuantity = ZERO_BI;
                        value_good.totalDisinvestQuantity = ZERO_BI;
                        value_good.totalProfit = ZERO_BI;
                        value_good.totalTradeCount = ZERO_BI;
                        value_good.totalInvestCount = ZERO_BI;
                        value_good.totalDisinvestCount = ZERO_BI;
                        value_good.modifiedTime = ZERO_BI;
                        value_good.txCount = ZERO_BI;
                        value_good.create_time = ZERO_BI;
                        value_good.name_lower = "#";
                        value_good.symbol_lower = "#";
                }
                let valuecurrentstate = TTSwap_Market.bind(
                        event.address
                ).try_getGoodState(event.params._valueGoodNo);




                value_good.feeQuantity = value_good.feeQuantity.plus(
                        event.params._valueinvest.div(BI_128)
                );
                if (!valuecurrentstate.reverted) {
                        value_good.virtualQuantity = valuecurrentstate.value.goodConfig.mod(BI_128);
                        value_good.currentValue = valuecurrentstate.value.investState.mod(BI_128);
                        value_good.currentQuantity = valuecurrentstate.value.currentState.mod(BI_128);
                        value_good.investQuantity = valuecurrentstate.value.currentState.div(BI_128)
                        value_good.investShares = valuecurrentstate.value.investState.div(BI_128);
                        value_good.investActualQuantity = value_good.investQuantity.minus(value_good.virtualQuantity);

                } else {
                        value_good.virtualQuantity = value_good.virtualQuantity.minus(proof.good2Quantity.minus(proof.good2ActualQuantity));
                        value_good.currentValue = value_good.currentValue.minus(proof.proofValue);
                        value_good.currentQuantity = value_good.currentQuantity.minus(
                                proof.good2Quantity
                        );
                        value_good.investQuantity = value_good.investQuantity.minus(
                                proof.good2Quantity
                        );
                        value_good.investShares = value_good.investShares.minus(proof.good2Shares);
                        value_good.investActualQuantity = value_good.investActualQuantity.minus(proof.good2ActualQuantity);


                        value_good.virtualQuantity = value_good.virtualQuantity.plus(invest_normal_quantity.minus(invest_value_actual_quantity));
                        value_good.currentValue = value_good.currentValue.plus(invest_value);
                        value_good.currentQuantity = value_good.currentQuantity.plus(
                                invest_value_quantity
                        );
                        value_good.investQuantity = value_good.investQuantity.plus(
                                invest_value_quantity
                        );
                        value_good.investShares = value_good.investShares.plus(invest_value_shares);
                        value_good.investActualQuantity = value_good.investActualQuantity.plus(invest_value_actual_quantity);

                }
                value_good.totalInvestQuantity =
                        value_good.totalInvestQuantity.minus(
                                proof.good2Quantity
                        );
                value_good.totalInvestQuantity =
                        value_good.totalInvestQuantity.plus(invest_value_quantity);
                value_good.totalInvestCount =
                        value_good.totalInvestCount.plus(ONE_BI);
                value_good.modifiedTime = event.block.timestamp;
                value_good.txCount = value_good.txCount.plus(ONE_BI);
                value_good.save();
                marketstate.totalInvestValue =
                        marketstate.totalInvestValue.minus(proof.proofValue);
                marketstate.totalInvestValue =
                        marketstate.totalInvestValue.plus(invest_value);
                marketstate.totalInvestCount =
                        marketstate.totalInvestCount.plus(ONE_BI);
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
                marketstate.save();
                let transid =
                        normalgoodid +
                        normal_good.txCount.mod(BigInt.fromU32(500)).toString();
                let tx = Transaction.load(transid);
                if (tx === null) {
                        tx = new Transaction(transid);
                        tx.fromgoodQuanity = ZERO_BI;
                        tx.fromgoodfee = ZERO_BI;
                        tx.togoodQuantity = ZERO_BI;
                        tx.togoodfee = ZERO_BI;
                        tx.timestamp = ZERO_BI;
                        tx.transActualValue = ZERO_BI;
                        tx.fromgoodActualQuanity = ZERO_BI;
                        tx.togoodActualQuantity = ZERO_BI;
                }
                tx.blockNumber = event.block.number;
                tx.transtype = "invest";
                tx.transvalue = event.params._value
                        .div(BI_128)
                        .times(BigInt.fromString("2"));
                tx.fromgood = normal_good.id;
                tx.togood = value_good.id;
                tx.fromgoodQuanity = event.params._invest.mod(BI_128);
                tx.fromgoodfee = event.params._invest.div(BI_128);
                tx.togoodQuantity = event.params._valueinvest.mod(BI_128);
                tx.togoodfee = event.params._valueinvest.div(BI_128);
                tx.timestamp = event.block.timestamp;
                tx.recipent = event.transaction.from.toHexString();
                tx.hash = event.transaction.hash.toHexString();
                tx.transActualValue = event.params._value.mod(BI_128).times(BigInt.fromString("2"));
                tx.fromgoodActualQuanity = event.params._invest.mod(BI_128).times(event.params._value.mod(BI_128)).div(event.params._value.div(BI_128));
                tx.togoodActualQuantity = event.params._valueinvest.mod(BI_128).times(event.params._value.mod(BI_128)).div(event.params._value.div(BI_128));
                tx.save();


                log_GoodData(value_good, event.block.timestamp);
                log_GoodData(normal_good, event.block.timestamp);
                log_MarketData(marketstate, event.block.timestamp);
        } else {
                let newcustomer = Customer.load(
                        event.transaction.from.toHexString()
                );
                if (newcustomer === null) {
                        newcustomer = new Customer(
                                event.transaction.from.toHexString()
                        );
                        newcustomer.refer = "#";
                        newcustomer.tradeValue = ZERO_BI;
                        newcustomer.investValue = ZERO_BI;
                        newcustomer.disinvestValue = ZERO_BI;
                        newcustomer.tradeCount = ZERO_BI;
                        newcustomer.investCount = ZERO_BI;
                        newcustomer.disinvestCount = ZERO_BI;
                        newcustomer.userConfig = ZERO_BI;
                        marketstate.userCount =
                                marketstate.userCount.plus(ONE_BI);
                        newcustomer.customerno = marketstate.userCount;
                        newcustomer.totalprofitvalue = ZERO_BI;
                        newcustomer.totalcommissionvalue = ZERO_BI;
                        newcustomer.referralnum = ZERO_BI;
                        newcustomer.getfromstake = ZERO_BI;
                        newcustomer.stakettsvalue = ZERO_BI;
                        newcustomer.stakettscontruct = ZERO_BI;
                        newcustomer.lastgate = "#";
                }

                let refer = Refer.load(newcustomer.refer as string);
                if (refer === null) {
                        refer = new Refer(
                                newcustomer.refer as string
                        );
                        refer.tradeValue = ZERO_BI;
                        refer.investValue = ZERO_BI;
                        refer.disinvestValue = ZERO_BI;
                        refer.tradeCount = ZERO_BI;
                        refer.investCount = ZERO_BI;
                        refer.disinvestCount = ZERO_BI;
                        refer.totalprofitvalue = ZERO_BI;
                        refer.totalcommissionvalue = ZERO_BI;
                        refer.referralnum = ZERO_BI;
                        refer.stakettsvalue = ZERO_BI;
                        refer.stakettscontruct = ZERO_BI;
                        refer.getfromstake = ZERO_BI;
                }

                refer.investValue = refer.investValue.minus(newcustomer.investValue);
                refer.investCount = refer.investCount.plus(ONE_BI);


                let gate = Gate.load(newcustomer.lastgate as string);
                if (gate === null) {
                        gate = new Gate(
                                newcustomer.lastgate as string
                        );
                        gate.tradeValue = ZERO_BI;
                        gate.investValue = ZERO_BI;
                        gate.disinvestValue = ZERO_BI;
                        gate.tradeCount = ZERO_BI;
                        gate.investCount = ZERO_BI;
                        gate.disinvestCount = ZERO_BI;
                        gate.totalprofitvalue = ZERO_BI;
                        gate.totalcommissionvalue = ZERO_BI;
                        gate.referralnum = ZERO_BI;
                        gate.stakettsvalue = ZERO_BI;
                        gate.stakettscontruct = ZERO_BI;
                        gate.getfromstake = ZERO_BI;
                }

                gate.investValue = gate.investValue.minus(newcustomer.investValue);
                gate.investCount = gate.investCount.plus(ONE_BI);

                newcustomer.investValue = newcustomer.investValue.minus(
                        proof.proofValue
                );
                newcustomer.investValue =
                        newcustomer.investValue.plus(invest_value);
                newcustomer.investCount = newcustomer.investCount.plus(ONE_BI);
                newcustomer.lastoptime = event.block.timestamp;

                newcustomer.save();
                gate.investValue = gate.investValue.plus(newcustomer.investValue);

                gate.lastoptime = event.block.timestamp;
                gate.save();

                refer.investValue = refer.investValue.plus(newcustomer.investValue);

                refer.lastoptime = event.block.timestamp;

                refer.save()

                log_CustomerData(newcustomer, event.block.timestamp);
                marketstate.totalInvestValue =
                        marketstate.totalInvestValue.minus(proof.proofValue);
                marketstate.totalInvestValue =
                        marketstate.totalInvestValue.plus(invest_value);
                marketstate.totalInvestCount =
                        marketstate.totalInvestCount.plus(ONE_BI);
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
                marketstate.save();
                let transid =
                        normalgoodid +
                        normal_good.txCount.mod(BigInt.fromU32(500)).toString();
                let tx = Transaction.load(transid);
                if (tx === null) {
                        tx = new Transaction(transid);
                        tx.fromgoodQuanity = ZERO_BI;
                        tx.fromgoodfee = ZERO_BI;
                        tx.togoodQuantity = ZERO_BI;
                        tx.togoodfee = ZERO_BI;
                        tx.timestamp = ZERO_BI;
                        tx.transActualValue = ZERO_BI;
                        tx.fromgoodActualQuanity = ZERO_BI;
                        tx.togoodActualQuantity = ZERO_BI;
                }
                tx.blockNumber = event.block.number;
                tx.transtype = "invest";
                tx.transvalue = event.params._value.div(BI_128);
                tx.fromgood = normal_good.id;
                tx.togood = ADDRESS_ZERO;
                tx.fromgoodQuanity = event.params._invest.mod(BI_128);
                tx.fromgoodfee = event.params._invest.div(BI_128);
                tx.timestamp = event.block.timestamp;
                tx.recipent = event.transaction.from.toHexString();
                tx.hash = event.transaction.hash.toHexString();
                tx.transActualValue = event.params._value.mod(BI_128);
                tx.fromgoodActualQuanity = event.params._invest.mod(BI_128).times(event.params._value.mod(BI_128)).div(event.params._value.div(BI_128));
                tx.save();

               
                log_GoodData(normal_good, event.block.timestamp);
                log_MarketData(marketstate, event.block.timestamp);
        }

        proof.proofValue = invest_value;;
        proof.proofActualValue = invest_actualvalue;
        proof.good1Shares = invest_normal_shares;
        proof.good1Quantity = invest_normal_quantity;
        proof.good1ActualQuantity = invest_normal_actual_quantity;
        proof.good2Shares = invest_value_shares;
        proof.good2Quantity = invest_value_quantity;
        proof.good2ActualQuantity = invest_value_actual_quantity;
        proof.save();
}

export function handle_e_disinvestProof(event: e_disinvestProof): void {
        let normalgoodid = event.params._normalGoodNo.toHexString();
        let valuegoodid = event.params._valueGoodNo.toHexString();
        let proofNo = event.params._proofNo.toString();
        let marketmanage = TTSwap_Market.bind(event.address);

        let tts_stakeproof = ZERO_BI;
        let devestvalue = event.params._value.div(BI_128);
        let proof = ProofState.load(proofNo);
        if (proof === null) {
                proof = new ProofState(proofNo);
                proof.owner = event.transaction.from.toHexString();
                proof.good1 = normalgoodid;
                proof.good2 = valuegoodid;
                proof.proofValue = ZERO_BI;
                proof.good1Shares = ZERO_BI;
                proof.good2Shares = ZERO_BI;
                proof.good1Quantity = ZERO_BI;
                proof.good2Quantity = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.proofActualValue = ZERO_BI;
                proof.good1ActualQuantity = ZERO_BI;
                proof.good2ActualQuantity = ZERO_BI;
                proof.createTime = event.block.timestamp;
        }

        let normal_good = GoodState.load(normalgoodid);
        if (normal_good === null) {
                normal_good = new GoodState(normalgoodid);
                normal_good.goodseq = ZERO_BI;
                normal_good.isvaluegood = false;
                normal_good.tokenname = "#";
                normal_good.tokensymbol = "#";
                normal_good.tokentotalsuply = ZERO_BI;
                normal_good.tokendecimals = ZERO_BI;
                normal_good.owner = "#";
                normal_good.erc20Address = "#";
                normal_good.goodConfig = ZERO_BI;
                normal_good.virtualQuantity = ZERO_BI;
                normal_good.currentValue = ZERO_BI;
                normal_good.currentQuantity = ZERO_BI;
                normal_good.investQuantity = ZERO_BI;
                normal_good.investShares = ZERO_BI;
                normal_good.investActualQuantity = ZERO_BI;
                normal_good.feeQuantity = ZERO_BI;

                normal_good.totalTradeQuantity = ZERO_BI;
                normal_good.totalInvestQuantity = ZERO_BI;
                normal_good.totalDisinvestQuantity = ZERO_BI;
                normal_good.totalProfit = ZERO_BI;
                normal_good.totalTradeCount = ZERO_BI;
                normal_good.totalInvestCount = ZERO_BI;
                normal_good.totalDisinvestCount = ZERO_BI;
                normal_good.modifiedTime = ZERO_BI;
                normal_good.txCount = ZERO_BI;
                normal_good.create_time = ZERO_BI;
                normal_good.name_lower = "#";
                normal_good.symbol_lower = "#";
        }
        let normalgoodstate = TTSwap_Market.bind(
                event.address
        ).try_getGoodState(event.params._normalGoodNo);
        
        normal_good.virtualQuantity = normal_good.virtualQuantity.minus(event.params._normalprofit.mod(BI_128));
        normal_good.virtualQuantity = normal_good.virtualQuantity.plus(event.params._normaldisvest.mod(BI_128));
        normal_good.currentValue = normal_good.currentValue.minus(event.params._value.div(BI_128));
        normal_good.currentQuantity = normal_good.currentQuantity.minus(event.params._normalprofit.mod(BI_128));
        normal_good.investQuantity = normal_good.investQuantity.minus(event.params._normalprofit.mod(BI_128));
        normal_good.investActualQuantity = normal_good.investActualQuantity.minus(event.params._normaldisvest.mod(BI_128));
        normal_good.feeQuantity = normal_good.feeQuantity.plus(event.params._normaldisvest.div(BI_128));
        normal_good.feeQuantity = normal_good.feeQuantity.minus(event.params._normalprofit.div(BI_128));

        if (!normalgoodstate.reverted) {
                normal_good.virtualQuantity = normalgoodstate.value.goodConfig.mod(BI_128);
                normal_good.currentValue = normalgoodstate.value.investState.mod(BI_128);
                normal_good.currentQuantity = normalgoodstate.value.currentState.mod(BI_128);
                normal_good.investQuantity = normalgoodstate.value.currentState.div(BI_128)
                normal_good.investShares = normalgoodstate.value.investState.div(BI_128);
                normal_good.investActualQuantity = normal_good.investQuantity.minus(normal_good.virtualQuantity);
        }
        normal_good.totalDisinvestQuantity =
                normal_good.totalDisinvestQuantity.plus(
                        event.params._normalprofit.mod(BI_128)
                );
        normal_good.totalDisinvestCount =
                normal_good.totalDisinvestCount.plus(ONE_BI);
        normal_good.totalProfit = normal_good.totalProfit.plus(
                event.params._normalprofit.div(BI_128)
        );
        normal_good.modifiedTime = event.block.timestamp;
        normal_good.txCount = normal_good.txCount.plus(ONE_BI);
        normal_good.save();
        let marketstate = MarketState.load("1");
        if (marketstate === null) {
                marketstate = new MarketState("1");

                marketstate.marketCreator = "#";
                marketstate.goodCount = ZERO_BI;
                marketstate.proofCount = ZERO_BI;
                marketstate.userCount = BigInt.fromU64(100000);
                marketstate.txCount = ZERO_BI;
                marketstate.totalTradeCount = ZERO_BI;
                marketstate.totalInvestCount = ZERO_BI;
                marketstate.totalDisinvestCount = ZERO_BI;
                marketstate.totalDisinvestValue = ZERO_BI;
                marketstate.totalTradeValue = ZERO_BI;
        }
        if (valuegoodid != ADDRESS_ZERO) {
                let value_good = GoodState.load(valuegoodid);
                if (value_good === null) {
                        value_good = new GoodState(valuegoodid);
                        value_good.goodseq = ZERO_BI;
                        value_good.isvaluegood = false;
                        value_good.tokenname = "#";
                        value_good.tokensymbol = "#";
                        value_good.tokentotalsuply = ZERO_BI;
                        value_good.tokendecimals = ZERO_BI;
                        value_good.owner = "#";
                        value_good.erc20Address = "#";
                        value_good.goodConfig = ZERO_BI;
                        value_good.virtualQuantity = ZERO_BI;
                        value_good.currentValue = ZERO_BI;
                        value_good.currentQuantity = ZERO_BI;
                        value_good.investQuantity = ZERO_BI;
                        value_good.investShares = ZERO_BI;
                        value_good.investActualQuantity = ZERO_BI;
                        value_good.feeQuantity = ZERO_BI;

                        value_good.totalTradeQuantity = ZERO_BI;
                        value_good.totalInvestQuantity = ZERO_BI;
                        value_good.totalDisinvestQuantity = ZERO_BI;
                        value_good.totalProfit = ZERO_BI;
                        value_good.totalTradeCount = ZERO_BI;
                        value_good.totalInvestCount = ZERO_BI;
                        value_good.totalDisinvestCount = ZERO_BI;
                        value_good.modifiedTime = ZERO_BI;
                        value_good.txCount = ZERO_BI;
                        value_good.create_time = ZERO_BI;
                        value_good.name_lower = "#";
                        value_good.symbol_lower = "#";
                }

                let valuegoodstate = TTSwap_Market.bind(
                        event.address
                ).try_getGoodState(event.params._valueGoodNo);
            
                value_good.virtualQuantity = value_good.virtualQuantity.plus(ZERO_BI);
                value_good.currentValue = value_good.currentValue.minus(event.params._value.div(BI_128));
                value_good.currentQuantity = value_good.currentQuantity.minus(event.params._valueprofit.mod(BI_128));
                value_good.investQuantity = value_good.investQuantity.minus(event.params._valueprofit.mod(BI_128));
                value_good.investActualQuantity = value_good.investActualQuantity.minus(event.params._valuedisvest.mod(BI_128));
                value_good.feeQuantity = value_good.feeQuantity.plus(event.params._valuedisvest.div(BI_128));
                value_good.feeQuantity = value_good.feeQuantity.minus(event.params._valueprofit.div(BI_128));

                if (!valuegoodstate.reverted) {
                        value_good.virtualQuantity = valuegoodstate.value.goodConfig.mod(BI_128);
                        value_good.currentValue = valuegoodstate.value.investState.mod(BI_128);
                        value_good.currentQuantity = valuegoodstate.value.currentState.mod(BI_128);
                        value_good.investQuantity = valuegoodstate.value.currentState.div(BI_128)
                        value_good.investShares = valuegoodstate.value.investState.div(BI_128);
                        value_good.investActualQuantity = value_good.investQuantity.minus(value_good.virtualQuantity);
                }

                value_good.totalDisinvestQuantity =
                        value_good.totalDisinvestQuantity.plus(
                                event.params._valueprofit.mod(BI_128)
                        );
                value_good.totalDisinvestCount =
                        value_good.totalDisinvestCount.plus(ONE_BI);
                value_good.modifiedTime = event.block.timestamp;
                value_good.txCount = value_good.txCount.plus(ONE_BI);
                value_good.save();
                marketstate.totalDisinvestValue =
                        marketstate.totalDisinvestValue.plus(devestvalue);
                marketstate.totalDisinvestValue =
                        marketstate.totalDisinvestValue.plus(devestvalue);
                marketstate.totalDisinvestCount =
                        marketstate.totalDisinvestCount.plus(ONE_BI);
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
                marketstate.save();
                let transid =
                        normalgoodid +
                        normal_good.txCount.mod(BigInt.fromU32(500)).toString();
                let tx = Transaction.load(transid);
                if (tx === null) {
                        tx = new Transaction(transid);
                        tx.fromgoodQuanity = ZERO_BI;
                        tx.fromgoodfee = ZERO_BI;
                        tx.togoodQuantity = ZERO_BI;
                        tx.togoodfee = ZERO_BI;
                        tx.timestamp = ZERO_BI;
                        tx.transActualValue = ZERO_BI;
                        tx.fromgoodActualQuanity = ZERO_BI;
                        tx.togoodActualQuantity = ZERO_BI;
                }
                tx.blockNumber = event.block.number;
                tx.transtype = "divest";
                tx.transvalue = event.params._value
                        .div(BI_128)
                        .times(BigInt.fromU32(2));
                tx.fromgood = normal_good.id;
                tx.togood = value_good.id;
                tx.fromgoodQuanity = event.params._normalprofit.mod(BI_128);
                tx.fromgoodfee = event.params._normaldisvest.div(BI_128);
                tx.togoodQuantity = event.params._valueprofit.mod(BI_128);
                tx.togoodfee = event.params._valuedisvest.div(BI_128);;
                tx.timestamp = event.block.timestamp;
                tx.recipent = event.transaction.from.toHexString();
                tx.hash = event.transaction.hash.toHexString();
                tx.transActualValue = event.params._value.mod(BI_128).times(BigInt.fromString("2"));
                tx.fromgoodActualQuanity = event.params._normaldisvest.mod(BI_128);
                tx.togoodActualQuantity = event.params._valuedisvest.mod(BI_128);
                tx.save();
                let proofstate = marketmanage.try_getProofState(event.params._proofNo);
                if (!proofstate.reverted) {
                        proof.proofValue = proofstate.value.state.div(BI_128);
                        proof.good1Shares = proofstate.value.shares.div(BI_128);
                        proof.good2Shares = proofstate.value.shares.mod(BI_128);
                        proof.good1Quantity = proofstate.value.invest.div(BI_128);
                        proof.good2Quantity = proofstate.value.valueinvest.div(BI_128);
                        proof.good1ActualQuantity = proofstate.value.invest.mod(BI_128);
                        proof.good2ActualQuantity = proofstate.value.valueinvest.mod(BI_128);
                        proof.proofActualValue = proofstate.value.state.mod(BI_128);

                }
                proof.save();
                let newcustomer = Customer.load(
                        event.transaction.from.toHexString()
                );
                if (newcustomer === null) {
                        newcustomer = new Customer(
                                event.transaction.from.toHexString()
                        );
                        newcustomer.refer = "#";
                        newcustomer.tradeValue = ZERO_BI;
                        newcustomer.investValue = ZERO_BI;
                        newcustomer.disinvestValue = ZERO_BI;
                        newcustomer.tradeCount = ZERO_BI;
                        newcustomer.investCount = ZERO_BI;
                        newcustomer.disinvestCount = ZERO_BI;
                        newcustomer.userConfig = ZERO_BI;
                        marketstate.userCount =
                                marketstate.userCount.plus(ONE_BI);
                        newcustomer.customerno = marketstate.userCount;
                        newcustomer.totalprofitvalue = ZERO_BI;
                        newcustomer.totalcommissionvalue = ZERO_BI;
                        newcustomer.referralnum = ZERO_BI;
                        newcustomer.getfromstake = ZERO_BI;
                        newcustomer.stakettsvalue = ZERO_BI;
                        newcustomer.stakettscontruct = ZERO_BI;
                        newcustomer.lastgate = "#";
                }

                newcustomer.lastgate = event.params._gate.toHexString();

                let refer = Refer.load(newcustomer.refer as string);
                if (refer === null) {
                        refer = new Refer(
                                newcustomer.refer as string
                        );
                        refer.tradeValue = ZERO_BI;
                        refer.investValue = ZERO_BI;
                        refer.disinvestValue = ZERO_BI;
                        refer.tradeCount = ZERO_BI;
                        refer.investCount = ZERO_BI;
                        refer.disinvestCount = ZERO_BI;
                        refer.totalprofitvalue = ZERO_BI;
                        refer.totalcommissionvalue = ZERO_BI;
                        refer.referralnum = ZERO_BI;
                        refer.stakettsvalue = ZERO_BI;
                        refer.stakettscontruct = ZERO_BI;
                        refer.getfromstake = ZERO_BI;
                }

                refer.getfromstake = refer.getfromstake.minus(newcustomer.getfromstake);
                refer.disinvestValue = refer.disinvestValue.minus(newcustomer.disinvestValue);
                refer.disinvestCount = refer.disinvestCount.plus(ONE_BI);
                refer.totalprofitvalue = refer.totalprofitvalue.minus(newcustomer.totalprofitvalue); 


                let gate = Gate.load(newcustomer.lastgate as string);
                if (gate === null) {
                        gate = new Gate(
                                newcustomer.lastgate as string
                        );
                        gate.tradeValue = ZERO_BI;
                        gate.investValue = ZERO_BI;
                        gate.disinvestValue = ZERO_BI;
                        gate.tradeCount = ZERO_BI;
                        gate.investCount = ZERO_BI;
                        gate.disinvestCount = ZERO_BI;
                        gate.totalprofitvalue = ZERO_BI;
                        gate.totalcommissionvalue = ZERO_BI;
                        gate.referralnum = ZERO_BI;
                        gate.stakettsvalue = ZERO_BI;
                        gate.stakettscontruct = ZERO_BI;
                        gate.getfromstake = ZERO_BI;
                }

                gate.getfromstake = gate.getfromstake.minus(newcustomer.getfromstake);
                gate.disinvestValue = gate.disinvestValue.minus(newcustomer.disinvestValue);
                gate.disinvestCount = gate.disinvestCount.plus(ONE_BI);
                gate.totalprofitvalue = gate.totalprofitvalue.minus(newcustomer.totalprofitvalue);

                newcustomer.getfromstake =
                        newcustomer.getfromstake.plus(tts_stakeproof);
                newcustomer.disinvestValue =
                        newcustomer.disinvestValue.plus(devestvalue);
                newcustomer.disinvestValue =
                        newcustomer.disinvestValue.plus(devestvalue);
                newcustomer.disinvestCount =
                        newcustomer.disinvestCount.plus(ONE_BI);
                newcustomer.totalprofitvalue =
                        newcustomer.totalprofitvalue.plus(
                                normal_good.currentValue
                                        .times(event.params._normalprofit.div(BI_128))
                                        .div(normal_good.currentQuantity)
                        );
                newcustomer.totalprofitvalue =
                        newcustomer.totalprofitvalue.plus(
                                value_good.currentValue
                                        .times(event.params._valueprofit.div(BI_128))
                                        .div(value_good.currentQuantity)
                        );
                newcustomer.lastoptime = event.block.timestamp;
                newcustomer.lastgate = event.params._gate.toHexString();
                newcustomer.save();
                refer.getfromstake = refer.getfromstake.plus(newcustomer.getfromstake);
                refer.disinvestValue = refer.disinvestValue.plus(newcustomer.disinvestValue);
                refer.totalprofitvalue = refer.totalprofitvalue.plus(newcustomer.totalprofitvalue);

                refer.lastoptime = event.block.timestamp;
                refer.save();
                log_ReferData(refer, event.block.timestamp);
                gate.getfromstake = gate.getfromstake.plus(newcustomer.getfromstake);
                gate.disinvestValue = gate.disinvestValue.plus(newcustomer.disinvestValue);
                gate.totalprofitvalue = gate.totalprofitvalue.plus(newcustomer.totalprofitvalue);

                gate.lastoptime = event.block.timestamp;
                gate.save();

                log_GateData(gate, event.block.timestamp);
                log_CustomerData(newcustomer, event.block.timestamp);
                log_GoodData(value_good, event.block.timestamp);
                log_GoodData(normal_good, event.block.timestamp);
                log_MarketData(marketstate, event.block.timestamp);
        } else {
                let newcustomer = Customer.load(
                        event.transaction.from.toHexString()
                );
                if (newcustomer === null) {
                        newcustomer = new Customer(
                                event.transaction.from.toHexString()
                        );
                        newcustomer.refer = "#";
                        newcustomer.tradeValue = ZERO_BI;
                        newcustomer.investValue = ZERO_BI;
                        newcustomer.disinvestValue = ZERO_BI;
                        newcustomer.tradeCount = ZERO_BI;
                        newcustomer.investCount = ZERO_BI;
                        newcustomer.disinvestCount = ZERO_BI;
                        newcustomer.userConfig = ZERO_BI;
                        marketstate.userCount =
                                marketstate.userCount.plus(ONE_BI);
                        newcustomer.customerno = marketstate.userCount;
                        newcustomer.totalprofitvalue = ZERO_BI;
                        newcustomer.totalcommissionvalue = ZERO_BI;
                        newcustomer.referralnum = ZERO_BI;
                        newcustomer.getfromstake = ZERO_BI;
                        newcustomer.stakettsvalue = ZERO_BI;
                        newcustomer.stakettscontruct = ZERO_BI;
                        newcustomer.lastgate = "#";
                }

                newcustomer.lastgate = event.params._gate.toHexString();
                let refer = Refer.load(newcustomer.refer as string);
                if (refer === null) {
                        refer = new Refer(
                                newcustomer.refer as string
                        );
                        refer.tradeValue = ZERO_BI;
                        refer.investValue = ZERO_BI;
                        refer.disinvestValue = ZERO_BI;
                        refer.tradeCount = ZERO_BI;
                        refer.investCount = ZERO_BI;
                        refer.disinvestCount = ZERO_BI;
                        refer.totalprofitvalue = ZERO_BI;
                        refer.totalcommissionvalue = ZERO_BI;
                        refer.referralnum = ZERO_BI;
                        refer.stakettsvalue = ZERO_BI;
                        refer.stakettscontruct = ZERO_BI;
                        refer.getfromstake = ZERO_BI;
                }

                refer.getfromstake = refer.getfromstake.minus(newcustomer.getfromstake);
                refer.disinvestValue = refer.disinvestValue.minus(newcustomer.disinvestValue);
                refer.disinvestCount = refer.disinvestCount.plus(ONE_BI);
                refer.totalprofitvalue = refer.totalprofitvalue.minus(newcustomer.totalprofitvalue);


                let gate = Gate.load(newcustomer.lastgate as string);
                if (gate === null) {
                        gate = new Gate(
                                newcustomer.lastgate as string
                        );
                        gate.tradeValue = ZERO_BI;
                        gate.investValue = ZERO_BI;
                        gate.disinvestValue = ZERO_BI;
                        gate.tradeCount = ZERO_BI;
                        gate.investCount = ZERO_BI;
                        gate.disinvestCount = ZERO_BI;
                        gate.totalprofitvalue = ZERO_BI;
                        gate.totalcommissionvalue = ZERO_BI;
                        gate.referralnum = ZERO_BI;
                        gate.stakettsvalue = ZERO_BI;
                        gate.stakettscontruct = ZERO_BI;
                        gate.getfromstake = ZERO_BI;
                }

                gate.getfromstake = gate.getfromstake.minus(newcustomer.getfromstake);
                gate.disinvestValue = gate.disinvestValue.minus(newcustomer.disinvestValue);
                gate.disinvestCount = gate.disinvestCount.plus(ONE_BI);
                gate.totalprofitvalue = gate.totalprofitvalue.minus(newcustomer.totalprofitvalue);

                newcustomer.disinvestValue =
                        newcustomer.disinvestValue.plus(devestvalue);
                newcustomer.disinvestCount =
                        newcustomer.disinvestCount.plus(ONE_BI);
                newcustomer.totalprofitvalue =
                        newcustomer.totalprofitvalue.plus(
                                normal_good.currentValue
                                        .times(event.params._normalprofit.div(BI_128))
                                        .div(normal_good.currentQuantity)
                        );
                newcustomer.lastoptime = event.block.timestamp;
                newcustomer.save();

                refer.getfromstake = refer.getfromstake.plus(newcustomer.getfromstake);
                refer.disinvestValue = refer.disinvestValue.plus(newcustomer.disinvestValue);
                refer.totalprofitvalue = refer.totalprofitvalue.plus(newcustomer.totalprofitvalue);

                refer.lastoptime = event.block.timestamp;
                refer.save();
                log_ReferData(refer, event.block.timestamp);
                gate.getfromstake = gate.getfromstake.plus(newcustomer.getfromstake);
                gate.disinvestValue = gate.disinvestValue.plus(newcustomer.disinvestValue);
                gate.totalprofitvalue = gate.totalprofitvalue.plus(newcustomer.totalprofitvalue);

                gate.lastoptime = event.block.timestamp;
                gate.save();

                log_GateData(gate, event.block.timestamp);

                log_CustomerData(newcustomer, event.block.timestamp);
                marketstate.totalDisinvestValue =
                        marketstate.totalDisinvestValue.plus(devestvalue);
                marketstate.totalDisinvestCount =
                        marketstate.totalDisinvestCount.plus(ONE_BI);
                marketstate.txCount = marketstate.txCount.plus(ONE_BI);
                marketstate.save();
                let transid =
                        normalgoodid +
                        normal_good.txCount.mod(BigInt.fromU32(500)).toString();
                let tx = Transaction.load(transid);
                if (tx === null) {
                        tx = new Transaction(transid);
                        tx.fromgoodQuanity = ZERO_BI;
                        tx.fromgoodfee = ZERO_BI;
                        tx.togoodQuantity = ZERO_BI;
                        tx.togoodfee = ZERO_BI;
                        tx.timestamp = ZERO_BI;
                        tx.transActualValue = ZERO_BI;
                        tx.fromgoodActualQuanity = ZERO_BI;
                        tx.togoodActualQuantity = ZERO_BI;
                }
                tx.blockNumber = event.block.number;
                tx.transtype = "divest";
                tx.transvalue = event.params._value.div(BI_128);
                tx.fromgood = normal_good.id;
                tx.togood = ADDRESS_ZERO;
                tx.fromgoodQuanity = event.params._normalprofit.mod(BI_128);
                tx.fromgoodfee = event.params._normaldisvest.div(BI_128);
                tx.timestamp = event.block.timestamp;
                tx.recipent = event.transaction.from.toHexString();
                tx.hash = event.transaction.hash.toHexString();
                tx.transActualValue = event.params._value.mod(BI_128).times(BigInt.fromString("2"));
                tx.fromgoodActualQuanity = event.params._normaldisvest.mod(BI_128);
                tx.save();
                let proofstate = marketmanage.try_getProofState(event.params._proofNo);
                if (!proofstate.reverted) {
                        proof.proofValue = proofstate.value.state.div(BI_128);
                        proof.good1Shares = proofstate.value.shares.div(BI_128);
                        proof.good2Shares = proofstate.value.shares.mod(BI_128);
                        proof.good1Quantity = proofstate.value.invest.div(BI_128);
                        proof.good2Quantity = proofstate.value.valueinvest.div(BI_128);
                        proof.good1ActualQuantity = proofstate.value.invest.mod(BI_128);
                        proof.good2ActualQuantity = proofstate.value.valueinvest.mod(BI_128);
                        proof.proofActualValue = proofstate.value.state.mod(BI_128);

                }
                proof.save();
                log_GoodData(normal_good, event.block.timestamp);
                log_MarketData(marketstate, event.block.timestamp);
        }
}



export function handle_e_collectcommission(event: e_collectcommission): void {
        let newcustomer = Customer.load(event.transaction.from.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.transaction.from.toHexString()
                );
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                newcustomer.customerno = ZERO_BI;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.lastgate = "#";
        }

        let refer = Refer.load(newcustomer.refer as string);
        if (refer === null) {
                refer = new Refer(
                        newcustomer.refer as string
                );
                refer.tradeValue = ZERO_BI;
                refer.investValue = ZERO_BI;
                refer.disinvestValue = ZERO_BI;
                refer.tradeCount = ZERO_BI;
                refer.investCount = ZERO_BI;
                refer.disinvestCount = ZERO_BI;
                refer.totalprofitvalue = ZERO_BI;
                refer.totalcommissionvalue = ZERO_BI;
                refer.referralnum = ZERO_BI;
                refer.stakettsvalue = ZERO_BI;
                refer.stakettscontruct = ZERO_BI;
                refer.getfromstake = ZERO_BI;
        }

        refer.totalcommissionvalue = refer.totalcommissionvalue.minus(newcustomer.totalcommissionvalue);



        let gate = Gate.load(newcustomer.lastgate as string);
        if (gate === null) {
                gate = new Gate(
                        newcustomer.lastgate as string
                );
                gate.tradeValue = ZERO_BI;
                gate.investValue = ZERO_BI;
                gate.disinvestValue = ZERO_BI;
                gate.tradeCount = ZERO_BI;
                gate.investCount = ZERO_BI;
                gate.disinvestCount = ZERO_BI;
                gate.totalprofitvalue = ZERO_BI;
                gate.totalcommissionvalue = ZERO_BI;
                gate.referralnum = ZERO_BI;
                gate.stakettsvalue = ZERO_BI;
                gate.stakettscontruct = ZERO_BI;
                gate.getfromstake = ZERO_BI;
        }


        gate.totalcommissionvalue = gate.totalcommissionvalue.minus(newcustomer.totalcommissionvalue);


        let goodidarrary = event.params._gooid;
        let commissionarray = event.params._commisionamount;
        for (let aa = 0; aa < goodidarrary.length; aa++) {
                let good = GoodState.load(goodidarrary[aa].toHexString());
                if (good !== null) {
                        newcustomer.totalcommissionvalue =
                                newcustomer.totalcommissionvalue.plus(
                                        good.currentValue
                                                .times(commissionarray[aa])
                                                .div(good.currentQuantity)
                                );
                }
        }
        newcustomer.save();
        refer.totalcommissionvalue = refer.totalcommissionvalue.minus(newcustomer.totalcommissionvalue);

        refer.lastoptime = event.block.timestamp;
        refer.save();
        log_ReferData(refer, event.block.timestamp);
        gate.totalcommissionvalue = gate.totalcommissionvalue.minus(newcustomer.totalcommissionvalue);

        gate.lastoptime = event.block.timestamp;
        gate.save();

        log_GateData(gate, event.block.timestamp);
        log_CustomerData(newcustomer, event.block.timestamp);
}

export function handle_e_goodWelfare(event: e_goodWelfare): void {
        let normalgoodid = event.params.goodid.toHexString();
        let warefare = event.params.welfare;
        let normal_good = GoodState.load(normalgoodid);
        if (normal_good === null) {
                normal_good = new GoodState(normalgoodid);
                normal_good.goodseq = ZERO_BI;

                normal_good.isvaluegood = false;
                normal_good.tokenname = "#";
                normal_good.tokensymbol = "#";
                normal_good.tokentotalsuply = ZERO_BI;
                normal_good.tokendecimals = ZERO_BI;
                normal_good.owner = "#";
                normal_good.erc20Address = "#";
                normal_good.goodConfig = ZERO_BI;
                normal_good.virtualQuantity = ZERO_BI;
                normal_good.currentValue = ZERO_BI;
                normal_good.currentQuantity = ZERO_BI;
                normal_good.investQuantity = ZERO_BI;
                normal_good.investShares = ZERO_BI;
                normal_good.investActualQuantity = ZERO_BI;
                normal_good.feeQuantity = ZERO_BI;

                normal_good.totalTradeQuantity = ZERO_BI;
                normal_good.totalInvestQuantity = ZERO_BI;
                normal_good.totalDisinvestQuantity = ZERO_BI;
                normal_good.totalProfit = ZERO_BI;
                normal_good.totalTradeCount = ZERO_BI;
                normal_good.totalInvestCount = ZERO_BI;
                normal_good.totalDisinvestCount = ZERO_BI;
                normal_good.modifiedTime = ZERO_BI;
                normal_good.txCount = ZERO_BI;
                normal_good.create_time = ZERO_BI;
                normal_good.name_lower = "#";
                normal_good.symbol_lower = "#";
        }

        normal_good.feeQuantity = normal_good.feeQuantity.plus(warefare);
        normal_good.save();
}

export function handle_e_changegoodowner(event: e_changegoodowner): void {
        let normalgoodid = event.params.goodid.toHexString();
        let normal_good = GoodState.load(normalgoodid);
        if (normal_good === null) {
                normal_good = new GoodState(normalgoodid);
                normal_good.goodseq = ZERO_BI;

                normal_good.isvaluegood = false;
                normal_good.tokenname = "#";
                normal_good.tokensymbol = "#";
                normal_good.tokentotalsuply = ZERO_BI;
                normal_good.tokendecimals = ZERO_BI;
                normal_good.owner = "#";
                normal_good.erc20Address = "#";
                normal_good.goodConfig = ZERO_BI;
                normal_good.virtualQuantity = ZERO_BI;
                normal_good.currentValue = ZERO_BI;
                normal_good.currentQuantity = ZERO_BI;
                normal_good.investQuantity = ZERO_BI;
                normal_good.investShares = ZERO_BI;
                normal_good.investActualQuantity = ZERO_BI;
                normal_good.feeQuantity = ZERO_BI;
                normal_good.totalTradeQuantity = ZERO_BI;
                normal_good.totalInvestQuantity = ZERO_BI;
                normal_good.totalDisinvestQuantity = ZERO_BI;
                normal_good.totalProfit = ZERO_BI;
                normal_good.totalTradeCount = ZERO_BI;
                normal_good.totalInvestCount = ZERO_BI;
                normal_good.totalDisinvestCount = ZERO_BI;
                normal_good.modifiedTime = ZERO_BI;
                normal_good.txCount = ZERO_BI;
                normal_good.create_time = ZERO_BI;
                normal_good.name_lower = "#";
                normal_good.symbol_lower = "#";
        }
        normal_good.owner = event.params.to.toHexString();
        normal_good.save();
}


