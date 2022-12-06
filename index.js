// Setting up Express server
const express = require('express')
// Import Moralis
const Moralis = require('moralis').default
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils")

const app = express()
const port = 3000

const MORALIS_API_KEY = "lgNtzu3ylU5YmKnnYr6BjVTU930P4xDZQlCukbZTnfZaS7lyTmYNiq3O1NkY8skF"
const address = '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d'; // Decentraland contract address
const chain = EvmChain.ETHEREUM;

async function getTradesData() {
    const response = await Moralis.EvmApi.nft.getNFTTrades({
        address,
        chain,
        limit: 10,
    });

    // Format the output to return name, amount and metadata
    const trades = response.result.map((trade) => ({
        transaction_hash: trade.result.transactionHash,
        token_ids: trade.result.tokenIds,
        price: trade.result.price.toString(),
        block_timestamp: trade.result.blockTimestamp,
    }))

    return {trades}
}

app.set('json spaces', 2); // Setting express options json to 2 spaces

app.get("/trades", async (req, res) => {
    try {
      // Get and return the trades data
      const data = await getTradesData()
      res.status(200)
      res.json(data)
    } catch (error) {
      // Handle errors
      console.error(error)
      res.status(500)
      res.json({ error: error.message })
    }
})

const startServer = async () => {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startServer()