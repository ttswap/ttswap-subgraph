import { Customer, CustomerData } from "../../generated/schema";

import { BigInt } from "@graphprotocol/graph-ts";

export function log_CustomerData(
        customer: Customer,
        modifiedTime: BigInt
): void {
        let data_week = modifiedTime.mod(BigInt.fromU32(604800)).mod(BigInt.fromU32(300));
        let customerData_week = CustomerData.load(
                customer.id + "w" + data_week.toString()
        );
        if (customerData_week === null) {
                customerData_week = new CustomerData(
                        customer.id + "w" + data_week.toString()
                );

        }
        customerData_week.refer = customer.refer;
        customerData_week.tradeValue = customer.tradeValue;
        customerData_week.investValue = customer.investValue;
        customerData_week.disinvestValue = customer.disinvestValue;
        customerData_week.tradeCount = customer.tradeCount;
        customerData_week.investCount = customer.investCount;
        customerData_week.disinvestCount = customer.disinvestCount;
        customerData_week.userConfig = customer.userConfig;
        customerData_week.customerno = customer.customerno;
        customerData_week.totalprofitvalue = customer.totalprofitvalue;
        customerData_week.totalcommissionvalue =
                customer.totalcommissionvalue;
        customerData_week.customerid = customer.id;
        customerData_week.create_time = modifiedTime;
        customerData_week.referralnum = customer.referralnum;
        customerData_week.getfromstake = customer.getfromstake;
        customerData_week.stakettsvalue = customer.stakettsvalue;
        customerData_week.stakettscontruct = customer.stakettscontruct;
        customerData_week.lastgate = customer.lastgate;
        customerData_week.save();
}
