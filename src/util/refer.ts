import { Refer, ReferData } from "../../generated/schema";

import { BigInt } from "@graphprotocol/graph-ts";

export function log_ReferData(
        refer: Refer,
        modifiedTime: BigInt
): void {
        let data_week = modifiedTime.mod(BigInt.fromU32(1209600)).mod(BigInt.fromU32(100));
        let referData_week = ReferData.load(
                refer.id + "w" + data_week.toString()
        );
        if (referData_week === null) {
                referData_week = new ReferData(
                        refer.id + "w" + data_week.toString()
                );
        }
        referData_week.tradeValue = refer.tradeValue;
        referData_week.investValue = refer.investValue;
        referData_week.disinvestValue = refer.disinvestValue;
        referData_week.tradeCount = refer.tradeCount;
        referData_week.investCount = refer.investCount;
        referData_week.disinvestCount = refer.disinvestCount;

        referData_week.totalprofitvalue = refer.totalprofitvalue;
        referData_week.totalcommissionvalue =
                refer.totalcommissionvalue;
        referData_week.referid = refer.id;
        referData_week.create_time = modifiedTime;
        referData_week.referralnum = refer.referralnum;
        referData_week.getfromstake = refer.getfromstake;
        referData_week.stakettsvalue = refer.stakettsvalue;
        referData_week.stakettscontruct = refer.stakettscontruct;
        referData_week.lastoptime = refer.lastoptime;
        referData_week.save();
}
