const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');

const db = new Hyperbee(new Hypercore('./db/prices'), {
  keyEncoding: 'utf-8',
  valueEncoding: 'json'
});

async function savePrices(prices) {
  await db.ready();

  for (const price of prices) {
    await db.put(`${price.id}:${price.timestamp}`, JSON.stringify(price));
  }

  console.log('Data stored successfully');
}

async function getLatestPrices(pairs) {
  await db.ready();
  const prices = [];

  for (const pair of pairs) {
    let latestEntry = null;

    for await (const { value } of db.createReadStream({ reverse: true })) {
      const data = JSON.parse(value);
      if (data.id === pair) {
        latestEntry = data;
        break;
      }
    }

    if (latestEntry) prices.push(latestEntry);
  }

  return prices;
}

module.exports = { savePrices, getLatestPrices };

