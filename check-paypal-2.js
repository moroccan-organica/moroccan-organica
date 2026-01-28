const paypal = require('@paypal/paypal-server-sdk');
const keys = Object.keys(paypal);
console.log(keys.filter(k => k.includes('Order') || k.includes('Client') || k.includes('Controller')));
