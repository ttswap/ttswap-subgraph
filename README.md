# TTSwap Subgraph

[TTSwap](https://github.com/ttswap) is an EVM automated market-making protocol built on a constant-value trading model. This repository is a [The Graph](https://thegraph.com/) subgraph that indexes on-chain activity from **TTSwap_Market** and **TTSwap_Token**, exposing queryable GraphQL entities for dashboards, analytics, and integrations.

## Overview

| Data source     | Contract role                                      | Mapping handler        |
|-----------------|----------------------------------------------------|------------------------|
| `TTSwap_Market` | Goods, proofs, swaps, invest/divest, commissions   | `src/ttswap_market.ts` |
| `TTSwap_Token`  | Referrals, public sale, shares, staking, env       | `src/ttswap_token.ts`  |

Shared utilities live under `src/util/` (`entities`, `good`, `marketData`, `customer`, `refer`, `gate`, `token`, `constants`).

The manifest in `subgraph.yaml` targets **Hoodi** testnet by default (update `network`, `source.address`, and `startBlock` before deploying elsewhere). See `deploy_hoodi.md`, `deploy_sepolia.md`, and `deploy_bnbtest.md` for network-specific deploy notes.

### Default contract addresses (mainnet)

| Contract       | Address                                      | Start block |
|----------------|----------------------------------------------|-------------|
| TTSwap_Market  | `0x5C70a413fcb7ea8c8D478D06F31f8963cE4EE635` | 24211660     |
| TTSwap_Token   | `0xE9D469b641bDCC9967AC19aefC038710d98F0B5d` | 24211545     |

### Default contract addresses (Hoodi)

| Contract       | Address                                      | Start block |
|----------------|----------------------------------------------|-------------|
| TTSwap_Market  | `0x3Dcd9C893aC962bE5d77eE9DD99ddE0F3280f132` | 1956415     |
| TTSwap_Token   | `0x9f01cba9ce7Acf87A896A394f016297ce141A989` | 1956410     |

## Indexed events

### TTSwap_Market

| Event | Handler | Purpose |
|-------|---------|---------|
| `e_initMetaGood` | `handle_e_initMetaGood` | Initialize the first (meta) good in the market |
| `e_initGood` | `handle_e_initGood` | Create a new good |
| `e_buyGood` (6 args) | `handle_e_buyGood_v1_14` | Buy / swap (legacy event shape) |
| `e_buyGood` (7 args) | `handle_e_buyGood_v1_16` | Buy / swap (current event shape) |
| `e_payGood` | `handle_e_paygood` | Pay-style good transfer |
| `e_investGood` | `handle_e_investGood` | Add liquidity / invest |
| `e_disinvestProof` | `handle_e_disinvestProof` | Remove liquidity / divest proof |
| `e_updateGoodConfig` | `handle_e_updateGoodConfig` | Good owner updates config |
| `e_modifyGoodConfig` | `handle_e_modifyGoodConfig` | Market operator updates config |
| `e_collectcommission` | `handle_e_collectcommission` | Commission collection |
| `e_goodWelfare` | `handle_e_goodWelfare` | Good welfare distribution |
| `e_changegoodowner` | `handle_e_changegoodowner` | Transfer good ownership |
| `e_getPromiseProof` | `handle_e_getPromiseProof` | Promise proof assignment |

### TTSwap_Token

| Event | Handler | Purpose |
|-------|---------|---------|
| `e_setenv` | `handle_e_setenv` | Link market contract in token env |
| `e_addreferral` | `handle_e_addreferral` | Bind referral relationship |
| `e_publicsell` | `handle_e_publicsell` | Public TTS sale (USDT) |
| `e_addShare` | `handle_e_addShare` | Allocate share chips |
| `e_shareMint` | `handle_e_shareMint` | Mint from share balance |
| `e_burnShare` | `handle_e_burnShare` | Burn share |
| `e_stakeinfo` | `handle_e_stakeinfo` | Staking state update |

## GraphQL schema

Entity definitions are in `schema.graphql`. Names below match GraphQL types (camelCase in queries).

### Protocol & market

- **MarketState** — Global counters: goods, proofs, users, txs, trade/invest/divest totals. `id` = market contract address.
- **MarketData** — Rolling snapshots of `MarketState` by `timetype` (`h`, `d`, `w`, `m`, `y`).
- **GoodState** — Per-good AMM state: ERC-20 metadata, config flags (`isvaluegood`, `islockgood`), reserves (`currentValue`, `currentQuantity`, `virtualQuantity`), invest/fee totals, optional promise pair (`promiseCurrency`, `promiseValue`, `promiseQuantity`), and relations to proofs and `GoodData`.
- **ProofState** — Liquidity proof linking two goods (`good1`, `good2`) with shares and quantities.
- **Transaction** — Per-tx record. `transtype` includes `meta`, `init`, `buy`, `pay`, `invest`, `divest`, and `null`. Links `fromgood` / `togood`, fees, `payhash`, `excuter`, `receive`.
- **GoodData** — OHLC-style snapshots per good (`open`, `high`, `low`, `close` derived from value/quantity price) plus state fields, keyed by `timetype`.

### Users, referrals & gates

- **Customer** — Wallet-level aggregates: trade/invest/divest value and counts, referral id, commission/profit, stake and public-sale totals, `lastgate`, `userConfig`, `customerno`.
- **CustomerData** — Time-stamped snapshots of customer metrics (`create_time`).
- **Refer** / **ReferData** — Referral-tree aggregates and historical snapshots.
- **Gate** / **GateData** — Gate-level aggregates and historical snapshots.

### TTS token

- **tts_env** — Singleton protocol env: pool value/asset/construct, DAO admin, linked contracts, public sale counters, share index.
- **tts_share** — Per-recipient share position (`share_leftamount`, `share_metric`, `share_chips`).
- **ttswap_publicsell_log** — Immutable log of each public sale (`user`, `ttsamount`, `usdtamount`, `create_time`).

### Time-series `timetype` buckets

`MarketData` and `GoodData` use fixed-size rolling windows (see comments in `schema.graphql`):

| `timetype` | Bucket size   | Max rows |
|------------|---------------|----------|
| `h`        | 1 minute      | 60       |
| `d`        | 20 minutes    | 72       |
| `w`        | 3 hours       | 56       |
| `m`        | 12 hours      | 62       |
| `y`        | 5 days        | 73       |

`GoodData.id` is `{goodId}{timetype}{bucketIndex}`; `MarketData.id` is `{timetype}{bucketIndex}`.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Graph CLI](https://github.com/graphprotocol/graph-cli) — installed via this repo’s `package.json`

```bash
npm install
```

### Build

```bash
npm run codegen   # generate types from schema + ABIs
npm run build     # compile AssemblyScript mappings to WASM
```

### Deploy

Subgraph Studio (default slug `ttswap`):

```bash
npm run deploy
```

Or the full pipeline used on Hoodi:

```bash
graph clean && graph codegen && graph build && graph deploy ttswap -l <version-label>
```

Authenticate with Studio before deploying: `graph auth --studio <DEPLOY_KEY>`.

### Local / custom node

```bash
npm run create-local
npm run deploy-local
npm run remove-local
```

Adjust node and IPFS URLs in `package.json` for your environment.

### Tests

```bash
npm test
```

Uses [Matchstick](https://github.com/LimeChain/matchstick) (`matchstick-as`).

## Example queries

### Market state

```graphql
{
  marketStates(first: 1) {
    id
    marketCreator
    goodCount
    proofCount
    userCount
    txCount
    totalTradeValue
    totalInvestValue
    totalDisinvestValue
    totalTradeCount
    totalInvestCount
    totalDisinvestCount
  }
}
```

### Latest daily market snapshot

```graphql
{
  marketDatas(
    first: 1
    where: { timetype: "d" }
    orderBy: modifiedTime
    orderDirection: desc
  ) {
    id
    timetype
    modifiedTime
    goodCount
    proofCount
    userCount
    txCount
    totalTradeValue
    totalInvestValue
    totalDisinvestValue
  }
}
```

### Good with OHLC snapshot

```graphql
{
  goodStates(first: 5, orderBy: modifiedTime, orderDirection: desc) {
    id
    tokenname
    tokensymbol
    isvaluegood
    currentValue
    currentQuantity
    goodData(where: { timetype: "d" }, first: 1, orderBy: modifiedTime, orderDirection: desc) {
      open
      high
      low
      close
      modifiedTime
    }
  }
}
```

### Customer profile

```graphql
{
  customers(where: { id: "0x..." }) {
    id
    refer
    customerno
    tradeValue
    tradeCount
    investValue
    disinvestValue
    totalprofitvalue
    totalcommissionvalue
    stakettsvalue
    publicsaleusdt
    publicsaletts
    lastgate
  }
}
```

### Proof position

```graphql
{
  proofStates(first: 10, orderBy: createTime, orderDirection: desc) {
    id
    owner
    proofValue
    good1 { id tokensymbol }
    good2 { id tokensymbol }
    good1Quantity
    good2Quantity
  }
}
```

### Recent transactions

```graphql
{
  transactions(first: 20, orderBy: timestamp, orderDirection: desc) {
    id
    transtype
    transvalue
    hash
    timestamp
    fromgood { tokensymbol }
    togood { tokensymbol }
    excuter
    receive
  }
}
```

### TTS public sale & env

```graphql
{
  tts_env(id: "1") {
    poolvalue
    publicsell
    actual_amount
    usdt_amount
    publicsaleusercount
    marketcontract
  }
  ttswap_publicsell_logs(first: 10, orderBy: create_time, orderDirection: desc) {
    user
    ttsamount
    usdtamount
    create_time
  }
}
```

## Query endpoint

Published subgraph (Graph Studio):

**https://api.studio.thegraph.com/query/57827/ttswap/version/latest**

Use the Studio playground to explore the schema interactively.

## Project layout

```
├── abis/                 # Contract ABIs
├── schema.graphql        # Entity schema
├── subgraph.yaml         # Manifest (network, contracts, handlers)
├── src/
│   ├── ttswap_market.ts  # Market event handlers
│   ├── ttswap_token.ts   # Token event handlers
│   └── util/             # Shared indexing logic
├── deploy_*.md           # Per-network deploy commands
└── package.json
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug reports and PRs are welcome; please open an issue before large schema or mapping changes.

## License

See `package.json` (`UNLICENSED`).
