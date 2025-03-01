const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');
const Hypercore = require('hypercore');
const Hyperbee = require('hyperbee');

const db = new Hyperbee(new Hypercore('./db/prices'), {
  keyEncoding: 'utf-8',
  valueEncoding: 'json'
});

const dht = new DHT();
const rpc = new RPC({ dht });

async function getLatestPrices(pairs) {
  await db.ready();
  const prices = [];

  for (const pair of pairs) {
    let latestEntry = null;

    for await (const { value } of db.createReadStream({ reverse: true })) {
      // console.log('Raw value from Hyperbee:', value);
      
      if (value.id === pair) {
        latestEntry = value;
        break;
      }
    }

    if (latestEntry) prices.push(latestEntry);
  }

  return prices;
}

async function getHistoricalPrices(pairs, from, to) {
  await db.ready();
  const history = [];

  for (const pair of pairs) {
    let values = [];

    for await (const { key, value } of db.createReadStream({ gte: `${pair}:${from}`, lte: `${pair}:${to}` })) {
      values.push(value);
    }

    history.push({ pair, values });
  }

  return history;
}

async function startServer() {
  const server = rpc.createServer();
  await server.listen();

  console.log('RPC Server running on: ', server.publicKey.toString('hex'));

  server.respond('getLatestPrices', async (reqRaw) => {    
    try {
      const req = JSON.parse(reqRaw.toString());
      const prices = await getLatestPrices(req.pairs);

      return Buffer.from(JSON.stringify(prices));
    } catch (err) {
      console.error('Error in getLatestPrices:', err);
      return Buffer.from(JSON.stringify({ error: err.message }));
    }
  });

  server.respond('getHistoricalPrices', async (reqRaw) => {
    try {
      const req = JSON.parse(reqRaw.toString());
      const history = await getHistoricalPrices(req.pairs, req.from, req.to);

      return Buffer.from(JSON.stringify(history));
    } catch (err) {
      console.error('Error in getHistoricalPrices:', err);

      return Buffer.from(JSON.stringify({ error: err.message }));
    }
  });
}

startServer().catch(console.error);
