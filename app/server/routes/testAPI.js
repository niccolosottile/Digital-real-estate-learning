var express = require('express');
var router = express.Router();
// Import Moralis
const Moralis = require('moralis').default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const address = '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d'; // Decentraland contract address
const chain = EvmChain.ETHEREUM;

async function getTradesData() {
    let cursor = null;
    let all_trades = [];

    do {
        const response = await Moralis.EvmApi.nft.getNFTTrades({
            address,
            chain,
            limit: 100,
            cursor: cursor
        });

        const trades = response.result.map((trade) => ({
            transaction_hash: trade.transactionHash,
            token_ids: trade.tokenIds,
            price: trade.price.toString(),
            block_timestamp: trade.blockTimestamp,
        }));

        all_trades = all_trades.concat(trades);
        cursor = response.pagination.cursor;
    } while (cursor != "" && cursor != null);

    return all_trades;
}

router.get('/', async(req, res, next) => {
    try {
        const data = await getTradesData();
        res.status(200);
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error: error.message });
    }
});

module.exports = router;