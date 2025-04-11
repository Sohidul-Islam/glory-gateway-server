const cron = require('node-cron');
const PaymentService = require('../services/PaymentService');

// Schedule to run account limit checks every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled account limit checks');
    await PaymentService.checkAccountLimits();
});

module.exports = cron; 