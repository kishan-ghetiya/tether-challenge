const cron = require('cron');

const { fetchAndProcessData } = require('./fetcher');
const { savePrices } = require('./storage');

const job = new cron.CronJob('*/60 * * * * *', async () => { 
  const prices = await fetchAndProcessData();
    
  if (prices && prices.length > 0) {
    await savePrices(prices);
  
    console.log('Stored prices are:', prices);
  } else {
    console.log('No prices stored');
  }
});

job.start();
console.log('Job running every 60 seconds');
