import { Gate, GateData } from "../../generated/schema";

import { BigInt } from "@graphprotocol/graph-ts";

export function log_GateData(
        gate: Gate,
        modifiedTime: BigInt
): void {
        let data_week = modifiedTime.mod(BigInt.fromU32(1209600)).mod(BigInt.fromU32(150));
        let gateData_week = GateData.load(
                gate.id + "w" + data_week.toString()
        );
        if (gateData_week === null) {
                gateData_week = new GateData(
                        gate.id + "w" + data_week.toString()
                );


        }
        gateData_week.tradeValue = gate.tradeValue;
        gateData_week.investValue = gate.investValue;
        gateData_week.disinvestValue = gate.disinvestValue;
        gateData_week.tradeCount = gate.tradeCount;
        gateData_week.investCount = gate.investCount;
        gateData_week.disinvestCount = gate.disinvestCount;
        gateData_week.totalprofitvalue = gate.totalprofitvalue;
        gateData_week.totalcommissionvalue =
                gate.totalcommissionvalue;
        gateData_week.gateid = gate.id;
        gateData_week.create_time = modifiedTime;
        gateData_week.getfromstake = gate.getfromstake;
        gateData_week.stakettsvalue = gate.stakettsvalue;
        gateData_week.stakettscontruct = gate.stakettscontruct;
        gateData_week.referralnum = gate.referralnum;
        gateData_week.save();
}
