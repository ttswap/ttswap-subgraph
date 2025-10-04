import { BigInt, dataSource } from "@graphprotocol/graph-ts";

import {
        Customer,
        MarketState,
        tts_env,
        tts_share,
        Refer,
        Gate,ttswap_publicsell_log
} from "../generated/schema";

import {
        e_addreferral,
        e_publicsell,
        e_setenv,
        e_addShare,
        e_stakeinfo,
        e_burnShare,
        e_shareMint,
} from "../generated/TTSwap_Token/TTSwap_Token";

import { BI_128, ZERO_BI, ONE_BI } from "./util/constants";

export function handle_e_setenv(event: e_setenv): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;

                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }

        ttsenv.marketcontract = event.params.marketcontract.toHexString();
        ttsenv.save();
}



export function handle_e_addShare(event: e_addShare): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;

                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }
        let ttsshare = tts_share.load(event.params.recipient.toHexString());
        if (ttsshare === null) {
                ttsshare = new tts_share(event.params.recipient.toHexString());
                ttsshare.share_owner = event.params.recipient.toHexString();
                ttsshare.share_leftamount = event.params.leftamount;
                ttsshare.share_metric = event.params.metric;
                ttsshare.share_chips = BigInt.fromU32(event.params.chips);
                ttsshare.save();
        }
        ttsenv.shares_index = ttsenv.shares_index.plus(ONE_BI);
        ttsenv.left_share = ttsenv.left_share.plus(event.params.leftamount);
        ttsenv.save();
}

export function handle_e_shareMint(event: e_shareMint): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;

                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }
        ttsenv.left_share = ttsenv.left_share.minus(event.params.mintamount);
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.mintamount
        );

        ttsenv.save();

        let ttsshare = tts_share.load(event.params.owner.toString());
        if (ttsshare !== null) {
                ttsshare.share_leftamount = ttsshare.share_leftamount.minus(
                        event.params.mintamount
                );
                ttsshare.share_metric = ttsshare.share_metric.plus(ONE_BI);
                ttsshare.save();
        }
}

export function handle_e_burnShare(event: e_burnShare): void {
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;
                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }
        let ttsshare = tts_share.load(event.params.owner.toHexString());
        if (ttsshare === null) {
                ttsshare = new tts_share(event.params.owner.toHexString());
                ttsshare.share_owner = "#";
                ttsshare.share_leftamount = ZERO_BI;
                ttsshare.share_metric = ZERO_BI;
                ttsshare.share_chips = ZERO_BI;
        }

        ttsenv.left_share = ttsenv.left_share.minus(ttsshare.share_leftamount);
        ttsenv.save();
        ttsshare.share_owner = "#";
        ttsshare.share_leftamount = ZERO_BI;
        ttsshare.share_metric = ZERO_BI;
        ttsshare.share_chips = ZERO_BI;
        ttsshare.save();
}

export function handle_e_addreferer(event: e_addreferral): void {
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
                marketstate.totalInvestValue = ZERO_BI;
        }
        let newcustomer = Customer.load(event.params.user.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(event.params.user.toHexString());
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.lastgate = "#";

                newcustomer.publicsaleusdt = ZERO_BI;
                newcustomer.publicsaletts = ZERO_BI;
        }
        newcustomer.refer = event.params.referal.toHexString();
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();
        let referralcus = Customer.load(event.params.referal.toHexString());
        if (referralcus === null) {
                referralcus = new Customer(event.params.referal.toHexString());
                referralcus.tradeValue = ZERO_BI;
                referralcus.investValue = ZERO_BI;
                referralcus.disinvestValue = ZERO_BI;
                referralcus.tradeCount = ZERO_BI;
                referralcus.investCount = ZERO_BI;
                referralcus.disinvestCount = ZERO_BI;
                referralcus.userConfig = ZERO_BI;
                referralcus.refer = "#";
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                referralcus.customerno = marketstate.userCount;
                referralcus.totalprofitvalue = ZERO_BI;
                referralcus.totalcommissionvalue = ZERO_BI;
                referralcus.referralnum = ZERO_BI;
                referralcus.stakettsvalue = ZERO_BI;
                referralcus.stakettscontruct = ZERO_BI;
                referralcus.getfromstake = ZERO_BI;
                referralcus.lastoptime = event.block.timestamp;
                referralcus.lastgate = "#";

                referralcus.publicsaleusdt = ZERO_BI;
                referralcus.publicsaletts = ZERO_BI;
        }
        referralcus.referralnum = referralcus.referralnum.plus(ONE_BI);
        referralcus.save();



        let gate = Gate.load(referralcus.lastgate as string);
        if (gate === null) {
                gate = new Gate(
                        referralcus.lastgate as string
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
        gate.referralnum = gate.referralnum.plus(ONE_BI);
        gate.lastoptime = event.block.timestamp;
        gate.save();


        let refer = Refer.load(event.params.referal.toHexString());

        if (refer === null) {
                refer = new Refer(
                        event.params.referal.toHexString()
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
        refer.referralnum = refer.referralnum.plus(ONE_BI);

        refer.save()
        marketstate.save();
}

export function handle_e_publicsell(event: e_publicsell): void {
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
                marketstate.totalInvestValue = ZERO_BI;
        }
        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;

                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }
        ttsenv.publicsell = ttsenv.publicsell.plus(event.params.ttsamount);
        ttsenv.usdt_amount = ttsenv.usdt_amount.plus(event.params.usdtamount);
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.ttsamount
        );

        let newcustomer = Customer.load(event.transaction.from.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(event.transaction.from.toHexString());
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;
                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.lastgate = "#";
                newcustomer.publicsaleusdt = ZERO_BI;
                newcustomer.publicsaletts = ZERO_BI;
                newcustomer.publicsaleusdt = ZERO_BI;
                newcustomer.publicsaletts = ZERO_BI;
        }
        if (newcustomer.publicsaleusdt === ZERO_BI) {
                ttsenv.publicsaleusercount = ttsenv.publicsaleusercount.plus(ONE_BI);
        }
        ttsenv.save();
        newcustomer.publicsaleusdt = newcustomer.publicsaleusdt.plus(event.params.usdtamount);
        newcustomer.publicsaletts = newcustomer.publicsaletts.plus(event.params.ttsamount);
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();

        let ttswap_publicsell_log1=new ttswap_publicsell_log(event.transaction.hash);
        ttswap_publicsell_log1.create_time=event.block.timestamp;
          ttswap_publicsell_log1.user=event.transaction.from.toHexString();
  ttswap_publicsell_log1.ttsamount=event.params.ttsamount;
  ttswap_publicsell_log1.usdtamount=event.params.usdtamount;
  ttswap_publicsell_log1.save();

}

export function handle_e_stakeinfo(event: e_stakeinfo): void {
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
                marketstate.totalInvestValue = ZERO_BI;
        }
        let newcustomer = Customer.load(event.params.recipient.toHexString());
        if (newcustomer === null) {
                newcustomer = new Customer(
                        event.params.recipient.toHexString()
                );
                newcustomer.tradeValue = ZERO_BI;
                newcustomer.investValue = ZERO_BI;
                newcustomer.disinvestValue = ZERO_BI;
                newcustomer.tradeCount = ZERO_BI;
                newcustomer.investCount = ZERO_BI;
                newcustomer.disinvestCount = ZERO_BI;
                newcustomer.userConfig = ZERO_BI;
                newcustomer.refer = "#";
                marketstate.userCount = marketstate.userCount.plus(ONE_BI);
                newcustomer.customerno = marketstate.userCount;

                newcustomer.totalprofitvalue = ZERO_BI;
                newcustomer.totalcommissionvalue = ZERO_BI;
                newcustomer.referralnum = ZERO_BI;
                newcustomer.stakettsvalue = ZERO_BI;
                newcustomer.stakettscontruct = ZERO_BI;
                newcustomer.getfromstake = ZERO_BI;
                newcustomer.lastgate = "#";
                newcustomer.publicsaleusdt = ZERO_BI;
                newcustomer.publicsaletts = ZERO_BI;
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

        refer.stakettsvalue = refer.stakettsvalue.minus(newcustomer.stakettsvalue);
        refer.stakettscontruct = refer.stakettscontruct.minus(newcustomer.stakettscontruct);



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

        gate.stakettsvalue = gate.stakettsvalue.minus(newcustomer.stakettsvalue);
        gate.stakettscontruct = gate.stakettscontruct.minus(newcustomer.stakettscontruct);


        let proofvalue = event.params.proofvalue.div(BI_128);
        let proofcontrunct = event.params.proofvalue.mod(BI_128);
        let profit = event.params.unstakestate.mod(BI_128);
        if (event.params.unstakestate.div(BI_128) !== ZERO_BI) {
                newcustomer.getfromstake = newcustomer.getfromstake.plus(profit);
        }
        newcustomer.stakettsvalue = proofvalue;
        newcustomer.stakettscontruct = proofcontrunct;
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();

        refer.stakettsvalue = refer.stakettsvalue.plus(newcustomer.stakettsvalue);
        refer.stakettscontruct = refer.stakettscontruct.plus(newcustomer.stakettscontruct);
        refer.lastoptime = event.block.timestamp;
        refer.save();

        gate.stakettsvalue = gate.stakettsvalue.plus(newcustomer.stakettsvalue);
        gate.stakettscontruct = gate.stakettscontruct.plus(newcustomer.stakettscontruct);
        gate.lastoptime = event.block.timestamp;
        gate.save();


        let ttsenv = tts_env.load("1");
        if (ttsenv === null) {
                ttsenv = new tts_env("1");
                ttsenv.poolvalue = ZERO_BI;
                ttsenv.poolasset = ZERO_BI;
                ttsenv.poolcontruct = ZERO_BI;

                ttsenv.dao_admin = "#";
                ttsenv.marketcontract = "#";
                ttsenv.usdtcontract = "#";
                ttsenv.publicsell = ZERO_BI;
                ttsenv.lsttime = ZERO_BI;
                ttsenv.actual_amount = ZERO_BI;
                ttsenv.shares_index = ZERO_BI;
                ttsenv.left_share = ZERO_BI;
                ttsenv.usdt_amount = ZERO_BI;
                ttsenv.lasttime = ZERO_BI;
                ttsenv.publicsaleusercount = ZERO_BI;
        }
        ttsenv.lsttime = event.block.timestamp;
        ttsenv.actual_amount = ttsenv.actual_amount.plus(profit);
        ttsenv.poolcontruct = event.params.poolstate.mod(BI_128);
        ttsenv.poolvalue = event.params.stakestate.mod(BI_128);
        ttsenv.poolasset = event.params.poolstate.div(BI_128);
        ttsenv.save();
        marketstate.save();
}

