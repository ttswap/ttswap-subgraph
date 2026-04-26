import { BigInt } from "@graphprotocol/graph-ts";
import {
  Customer,
  Gate,
  MarketState,
  Refer,
  tts_env,
  tts_share,
} from "../../generated/schema";
import { ONE_BI, ZERO_BI } from "./constants";

export function getOrCreateCustomer(
  id: string,
  marketstate: MarketState | null
): Customer {
  let customer = Customer.load(id);
  if (customer === null) {
    customer = new Customer(id);
    customer.refer = "#";
    customer.tradeValue = ZERO_BI;
    customer.investValue = ZERO_BI;
    customer.disinvestValue = ZERO_BI;
    customer.tradeCount = ZERO_BI;
    customer.investCount = ZERO_BI;
    customer.disinvestCount = ZERO_BI;
    customer.userConfig = ZERO_BI;
    customer.totalprofitvalue = ZERO_BI;
    customer.totalcommissionvalue = ZERO_BI;
    customer.referralnum = ZERO_BI;
    customer.getfromstake = ZERO_BI;
    customer.stakettsvalue = ZERO_BI;
    customer.stakettscontruct = ZERO_BI;
    customer.lastgate = "#";
    customer.publicsaleusdt = ZERO_BI;
    customer.publicsaletts = ZERO_BI;
    if (marketstate !== null) {
      marketstate.userCount = marketstate.userCount.plus(ONE_BI);
      customer.customerno = marketstate.userCount;
    } else {
      customer.customerno = ZERO_BI;
    }
  }
  return customer as Customer;
}

export function getOrCreateRefer(id: string): Refer {
  let refer = Refer.load(id);
  if (refer === null) {
    refer = new Refer(id);
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
    refer.lastoptime = BigInt.zero();
  }
  return refer as Refer;
}

export function getOrCreateGate(id: string): Gate {
  let gate = Gate.load(id);
  if (gate === null) {
    gate = new Gate(id);
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
    gate.lastoptime = BigInt.zero();
  }
  return gate as Gate;
}

export function getOrCreateMarketState(): MarketState {
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
  return marketstate as MarketState;
}

export function getOrCreateTtsEnv(): tts_env {
  let env = tts_env.load("1");
  if (env === null) {
    env = new tts_env("1");
    env.poolvalue = ZERO_BI;
    env.poolasset = ZERO_BI;
    env.poolcontruct = ZERO_BI;
    env.dao_admin = "#";
    env.marketcontract = "#";
    env.usdtcontract = "#";
    env.publicsell = ZERO_BI;
    env.lsttime = ZERO_BI;
    env.actual_amount = ZERO_BI;
    env.shares_index = ZERO_BI;
    env.left_share = BigInt.fromString("45000000000000000000");
    env.usdt_amount = ZERO_BI;
    env.lasttime = ZERO_BI;
    env.publicsaleusercount = ZERO_BI;
  }
  return env as tts_env;
}

export function getOrCreateTtsShare(
  id: string,
  defaultOwner: string
): tts_share {
  let share = tts_share.load(id);
  if (share === null) {
    share = new tts_share(id);
    share.share_owner = defaultOwner;
    share.share_leftamount = ZERO_BI;
    share.share_metric = ZERO_BI;
    share.share_chips = ZERO_BI;
  }
  return share as tts_share;
}
