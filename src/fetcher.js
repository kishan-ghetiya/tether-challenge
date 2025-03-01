require('dotenv').config();
const axios = require('axios');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');

const db = new Hyperbee(new Hypercore('./db/prices'), {
  keyEncoding: 'utf-8',
  valueEncoding: 'json'
});

async function fetchAndProcessData() {
  try {
    const { data: topCoins } = await axios.get(process.env.COINGECKO_PUBLIC_API, {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: 5, page: 1 },
    });    
    
    const promises = topCoins.map((coin) =>
      axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}/tickers`)
    );
    const tickerResponses = await Promise.allSettled(promises);
    
    const storedPrices = [];

    for (let i = 0; i < topCoins.length; i++) {
      const coin = topCoins[i];
      const response = tickerResponses[i];

      if (response.status !== "fulfilled") {
        console.warn(`Skipping ${coin.symbol} due to API error:`, response.reason.message);
        continue;
      }

      const topExchanges = response.value.data.tickers.slice(0, 3);
      if (topExchanges.length === 0) continue;

      const avgPrice = topExchanges.reduce((sum, t) => sum + t.last, 0) / topExchanges.length;
      const entry = {
        timestamp: Date.now(),
        id: coin.id,
        symbol: coin.symbol,
        price: avgPrice,
        exchanges: topExchanges.map((t) => t.market.name),
      };

      await db.put(`${coin.id}:${entry.timestamp}`, entry);
      storedPrices.push(entry);
    }

    return storedPrices;
  } catch (error) {
    console.log('ERROR', error);
    console.error("Error fetching data:", error.message);
    return [];
  }
}

module.exports = { fetchAndProcessData };
