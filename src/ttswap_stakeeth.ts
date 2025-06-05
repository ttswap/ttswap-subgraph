import { Address, BigInt, dataSource, Bytes } from "@graphprotocol/graph-ts";

import { ttswap_stakeeth_env } from "../generated/schema";

import {
        e_stakeRocketPoolETH,
        e_rocketpoolUnstaked,
        e_stakeeth_invest,
        e_stakeeth_devest,
        e_collecttts,
        e_stakeSETH,
        e_stakeSWETH,
        e_unstakeSWETH,
        e_unstakeSETH,
} from "../generated/TTSwap_StakeETH/TTSwap_StakeETH";

import {  BI_128, ZERO_BI } from "./util/constants";


export function handle_e_stakeSETH(event: e_stakeSETH): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.TotalState0 = event.params.totalState.div(BI_128);
        ttsstakeenv.TotalState1 = event.params.totalState.mod(BI_128);
        ttsstakeenv.ethShare0 = event.params.sethShare.div(BI_128);
        ttsstakeenv.ethShare1 = event.params.sethShare.mod(BI_128);
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.total_restakedAmount =
                ttsstakeenv.total_restakedAmount.plus(event.params.stakeamount);

        ttsstakeenv.save();
}

export function handle_e_stakeSWETH(event: e_stakeSWETH): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.TotalState0 = event.params.totalState.div(BI_128);
        ttsstakeenv.TotalState1 = event.params.totalState.mod(BI_128);
        ttsstakeenv.wethShare0 = event.params.swethShare.div(BI_128);
        ttsstakeenv.wethShare1 = event.params.swethShare.mod(BI_128);
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.total_restakedAmount =
                ttsstakeenv.total_restakedAmount.plus(event.params.stakeamount);
        ttsstakeenv.save();
}

export function handle_e_unstakeSWETH(event: e_unstakeSWETH): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.TotalState0 = event.params.totalState.div(BI_128);
        ttsstakeenv.TotalState1 = event.params.totalState.mod(BI_128);
        ttsstakeenv.wethShare0 = event.params.swethShare.div(BI_128);
        ttsstakeenv.wethShare1 = event.params.swethShare.mod(BI_128);
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.Total_reward = ttsstakeenv.Total_reward.plus(
                event.params.unstakeAmount.div(BI_128)
        );
        ttsstakeenv.save();
}

export function handle_e_unstakeSETH(event: e_unstakeSETH): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.TotalState0 = event.params.totalState.div(BI_128);
        ttsstakeenv.TotalState1 = event.params.totalState.mod(BI_128);
        ttsstakeenv.wethShare0 = event.params.sethShare.div(BI_128);
        ttsstakeenv.wethShare1 = event.params.sethShare.mod(BI_128);
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.Total_reward = ttsstakeenv.Total_reward.plus(
                event.params.unstakeAmount.div(BI_128)
        );
        ttsstakeenv.save();
}

export function handle_e_collecttts(event: e_collecttts): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.total_ttsreward = ttsstakeenv.total_ttsreward.plus(
                event.params.amount.div(BI_128)
        );
        ttsstakeenv.total_ttstoreth = ttsstakeenv.total_ttstoreth.plus(
                event.params.amount.mod(BI_128)
        );
        ttsstakeenv.save();
}

export function handle_e_rocketpoolUnstaked(event: e_rocketpoolUnstaked): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.rocketReward = ttsstakeenv.rocketReward.plus(
                event.params.reward
        );
        ttsstakeenv.TotalState0 = event.params.totalState.div(BI_128);
        ttsstakeenv.TotalState1 = event.params.totalState.mod(BI_128);
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.save();
}

export function handle_e_stakeRocketPoolETH(event: e_stakeRocketPoolETH): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.TotalStake0 = event.params.totalStake.div(BI_128);
        ttsstakeenv.TotalStake1 = event.params.totalStake.mod(BI_128);
        ttsstakeenv.save();
}

export function handle_e_stakeeth_invest(event: e_stakeeth_invest): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.save();
}

export function handle_e_stakeeth_devest(event: e_stakeeth_devest): void {
        let ttsstakeenv = ttswap_stakeeth_env.load(
                Bytes.fromHexString(dataSource.address.toString())
        );

        if (ttsstakeenv === null) {
                ttsstakeenv = new ttswap_stakeeth_env(
                        Bytes.fromHexString(dataSource.address.toString())
                );
                ttsstakeenv.TotalState0 = ZERO_BI;
                ttsstakeenv.TotalState1 = ZERO_BI;
                ttsstakeenv.ethShare0 = ZERO_BI;
                ttsstakeenv.ethShare1 = ZERO_BI;
                ttsstakeenv.wethShare0 = ZERO_BI;
                ttsstakeenv.wethShare1 = ZERO_BI;
                ttsstakeenv.TotalStake0 = ZERO_BI;
                ttsstakeenv.TotalStake1 = ZERO_BI;
                ttsstakeenv.Total_stake = ZERO_BI;
                ttsstakeenv.Total_reward = ZERO_BI;
                ttsstakeenv.reth_staking0 = ZERO_BI;
                ttsstakeenv.reth_staking1 = ZERO_BI;
                ttsstakeenv.total_restakedAmount = ZERO_BI;
                ttsstakeenv.total_restakedAward = ZERO_BI;
                ttsstakeenv.total_ttsreward = ZERO_BI;
                ttsstakeenv.total_ttstoreth = ZERO_BI;
                ttsstakeenv.rocketReward = ZERO_BI;
        }
        ttsstakeenv.reth_staking0 = event.params.rethStaking.div(BI_128);
        ttsstakeenv.reth_staking1 = event.params.rethStaking.mod(BI_128);
        ttsstakeenv.save();
}
