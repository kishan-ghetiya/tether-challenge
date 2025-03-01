require('dotenv').config();
const RPC = require('@hyperswarm/rpc');
const DHT = require('hyperdht');

const dht = new DHT();
const rpc = new RPC({ dht });

const serverPublicKey = Buffer.from(process.env.SERVER_PUBLIC_KEY, 'hex'); // server key

async function getLatestPrices(pairs) {
  try {
    const payload = { pairs };

    const response = await rpc.request(
      serverPublicKey,
      'getLatestPrices',
      Buffer.from(JSON.stringify(payload))
    );

    const responseString = response.toString();

    const jsonResponse = JSON.parse(responseString);
    console.log('Latest Prices: ', jsonResponse);
  } catch (error) {
    console.error('Error fetching latest prices:', error.message);
  }
}

async function getHistoricalPrices(pairs, from, to) {
  try {
    const payload = { pairs, from, to };

    const response = await rpc.request(
      serverPublicKey,
      'getHistoricalPrices',
      Buffer.from(JSON.stringify(payload))
    );

    const responseString = response.toString();
    console.log('Raw Response:', responseString);

    const jsonResponse = JSON.parse(responseString);
    console.log('Historical Prices: ', jsonResponse);
  } catch (error) {
    console.error('Error fetching historical prices:', error.message);
  }
}

async function main() {
  await getLatestPrices(['bitcoin', 'ethereum']);

  await getHistoricalPrices(['bitcoin'], Date.now() - 86400000, Date.now());

  await rpc.destroy();
  await dht.destroy();
}

main().catch(console.error);
