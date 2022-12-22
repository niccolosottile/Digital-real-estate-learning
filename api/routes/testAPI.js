var express = require('express');
var router = express.Router();
// Import Moralis
const Moralis = require('moralis').default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const address = '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d'; // Decentraland contract address
const chain = EvmChain.ETHEREUM;

async function getTradesData() {
    const response = await Moralis.EvmApi.nft.getNFTTrades({
        address,
        chain,
        limit: 10,
    });

    // Format the output to return metadata
    const trades = response.result.map((trade) => ({
        transaction_hash: trade.result.transactionHash,
        token_ids: trade.result.tokenIds,
        price: trade.result.price.toString(),
        block_timestamp: trade.result.blockTimestamp,
    }));

    return {trades};
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