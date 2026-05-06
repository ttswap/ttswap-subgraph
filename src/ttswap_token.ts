import { BigInt } from "@graphprotocol/graph-ts";

import {
        tts_share,
        Refer,
        Gate,
        ttswap_publicsell_log,
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
import {
        getOrCreateCustomer,
        getOrCreateGate,
        getOrCreateMarketState,
        getOrCreateRefer,
        getOrCreateTtsEnv,
        getOrCreateTtsShare,
} from "./util/entities";

export function handle_e_setenv(event: e_setenv): void {
        let ttsenv = getOrCreateTtsEnv();

        ttsenv.marketcontract = event.params.marketcontract.toHexString();
        ttsenv.save();
}



export function handle_e_addShare(event: e_addShare): void {
        let ttsenv = getOrCreateTtsEnv();
        let shareId = event.params.recipient.toHexString();
        let isNewShare = tts_share.load(shareId) === null;
        let ttsshare = getOrCreateTtsShare(shareId, shareId);
        if (isNewShare) {
                ttsshare.share_leftamount = event.params.leftamount;
                ttsshare.share_metric = event.params.metric;
                ttsshare.share_chips = BigInt.fromU32(event.params.chips);
                ttsenv.shares_index = ttsenv.shares_index.plus(ONE_BI);
        } else if (ttsshare.share_leftamount.equals(ZERO_BI)) {
                // 与合约 if (shares[owner].leftamount == 0) 分支一致 → 整体覆盖
                ttsshare.share_owner = event.params.recipient.toHexString();
                ttsshare.share_leftamount = event.params.leftamount;
                ttsshare.share_metric = event.params.metric;
                ttsshare.share_chips = BigInt.fromU32(event.params.chips);
        } else {
                // 累加 + 取大
                ttsshare.share_leftamount = ttsshare.share_leftamount.plus(event.params.leftamount);
                let newChips = BigInt.fromU32(event.params.chips);
                if (newChips.gt(ttsshare.share_chips)) ttsshare.share_chips = newChips;
                if (event.params.metric.gt(ttsshare.share_metric)) ttsshare.share_metric = event.params.metric;
        }
        ttsshare.save();
        ttsenv.left_share = ttsenv.left_share.minus(event.params.leftamount);
        ttsenv.save();
}

export function handle_e_shareMint(event: e_shareMint): void {
        let ttsenv = getOrCreateTtsEnv();
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.mintamount
        );

        ttsenv.save();

        let ttsshare = tts_share.load(event.params.owner.toHexString());
        if (ttsshare !== null) {
                ttsshare.share_leftamount = ttsshare.share_leftamount.minus(
                        event.params.mintamount
                );
                ttsshare.share_metric = ttsshare.share_metric.plus(ONE_BI);
                ttsshare.save();
        }
}

export function handle_e_burnShare(event: e_burnShare): void {
        let ttsenv = getOrCreateTtsEnv();
        let ttsshare = getOrCreateTtsShare(
                event.params.owner.toHexString(),
                "#"
        );

        ttsenv.left_share = ttsenv.left_share.plus(ttsshare.share_leftamount);
        ttsenv.save();
        ttsshare.share_owner = "#";
        ttsshare.share_leftamount = ZERO_BI;
        ttsshare.share_metric = ZERO_BI;
        ttsshare.share_chips = ZERO_BI;
        ttsshare.save();
}

export function handle_e_addreferral(event: e_addreferral): void {
        let marketstate = getOrCreateMarketState();
        let newcustomer = getOrCreateCustomer(
                event.params.user.toHexString(),
                marketstate
        );
        newcustomer.refer = event.params.referal.toHexString();
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();
        let referralcus = getOrCreateCustomer(
                event.params.referal.toHexString(),
                marketstate
        );
        referralcus.lastoptime = event.block.timestamp;
        referralcus.referralnum = referralcus.referralnum.plus(ONE_BI);
        referralcus.save();

        let gateKey = referralcus.lastgate as string;
        if (gateKey != "#") {
                let gate = getOrCreateGate(gateKey);
                gate.referralnum = gate.referralnum.plus(ONE_BI);
                gate.lastoptime = event.block.timestamp;
                gate.save();
        }

        let refer = getOrCreateRefer(event.params.referal.toHexString());


        refer.lastoptime = event.block.timestamp;
        refer.referralnum = refer.referralnum.plus(ONE_BI);

        refer.save()
        marketstate.save();
}

export function handle_e_publicsell(event: e_publicsell): void {
        let marketstate = getOrCreateMarketState();
        let ttsenv = getOrCreateTtsEnv();
        ttsenv.publicsell = ttsenv.publicsell.plus(event.params.ttsamount);
        ttsenv.usdt_amount = ttsenv.usdt_amount.plus(event.params.usdtamount);
        ttsenv.actual_amount = ttsenv.actual_amount.plus(
                event.params.ttsamount
        );

        let newcustomer = getOrCreateCustomer(
                event.transaction.from.toHexString(),
                marketstate
        );
        marketstate.save();
        if (newcustomer.publicsaleusdt.equals(ZERO_BI)) {
                ttsenv.publicsaleusercount = ttsenv.publicsaleusercount.plus(ONE_BI);
        }
        newcustomer.publicsaleusdt = newcustomer.publicsaleusdt.plus(event.params.usdtamount);
        newcustomer.publicsaletts = newcustomer.publicsaletts.plus(event.params.ttsamount);
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();

        let id = event.transaction.hash.concatI32(event.logIndex.toI32());
        let ttswap_publicsell_log1 = new ttswap_publicsell_log(id);
        ttswap_publicsell_log1.create_time = event.block.timestamp;
        ttswap_publicsell_log1.user = event.transaction.from.toHexString();
        ttswap_publicsell_log1.ttsamount = event.params.ttsamount;
        ttswap_publicsell_log1.usdtamount = event.params.usdtamount;
        ttswap_publicsell_log1.save();
        ttsenv.save();

}

export function handle_e_stakeinfo(event: e_stakeinfo): void {
        let marketstate = getOrCreateMarketState();
        let newcustomer = getOrCreateCustomer(
                event.params.recipient.toHexString(),
                marketstate
        );

        let referStr = newcustomer.refer;
        let hasRefer = referStr != null && referStr != "#";
        let gateKey = newcustomer.lastgate as string;
        let hasGate = gateKey != "#";

        if (hasRefer) {
                let rid = referStr as string;
                let refer = getOrCreateRefer(rid);
                refer.stakettsvalue = refer.stakettsvalue.minus(
                        newcustomer.stakettsvalue
                );
                refer.stakettscontruct = refer.stakettscontruct.minus(
                        newcustomer.stakettscontruct
                );
                refer.save();
        }

        if (hasGate) {
                let gate = getOrCreateGate(gateKey);
                gate.stakettsvalue = gate.stakettsvalue.minus(
                        newcustomer.stakettsvalue
                );
                gate.stakettscontruct = gate.stakettscontruct.minus(
                        newcustomer.stakettscontruct
                );
                gate.save();
        }

        let ttsenv = getOrCreateTtsEnv();
        let proofvalue = event.params.proofvalue.div(BI_128);
        let proofcontrunct = event.params.proofvalue.mod(BI_128);
        let profit = event.params.unstakestate.mod(BI_128);
        if (event.params.unstakestate.div(BI_128).gt(ZERO_BI)) {
                newcustomer.getfromstake = newcustomer.getfromstake.plus(profit);
                ttsenv.actual_amount = ttsenv.actual_amount.plus(profit);
        }
        newcustomer.stakettsvalue = proofvalue;
        newcustomer.stakettscontruct = proofcontrunct;
        newcustomer.lastoptime = event.block.timestamp;
        newcustomer.save();

        if (hasRefer) {
                let refer = Refer.load(referStr as string);
                if (refer !== null) {
                        refer.stakettsvalue = refer.stakettsvalue.plus(
                                newcustomer.stakettsvalue
                        );
                        refer.stakettscontruct = refer.stakettscontruct.plus(
                                newcustomer.stakettscontruct
                        );
                        refer.lastoptime = event.block.timestamp;
                        refer.save();
                }
        }

        if (hasGate) {
                let gate = Gate.load(gateKey);
                if (gate !== null) {
                        gate.stakettsvalue = gate.stakettsvalue.plus(
                                newcustomer.stakettsvalue
                        );
                        gate.stakettscontruct = gate.stakettscontruct.plus(
                                newcustomer.stakettscontruct
                        );
                        gate.lastoptime = event.block.timestamp;
                        gate.save();
                }
        }

        ttsenv.lasttime = event.block.timestamp;
        ttsenv.actual_amount = ttsenv.actual_amount.plus(profit);
        ttsenv.poolcontruct = event.params.poolstate.mod(BI_128);
        ttsenv.poolvalue = event.params.stakestate.mod(BI_128);
        ttsenv.poolasset = event.params.poolstate.div(BI_128);
        ttsenv.save();
        marketstate.save();
}

