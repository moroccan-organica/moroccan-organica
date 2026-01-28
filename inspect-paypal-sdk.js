const { Client, OrdersController, Environment } = require('@paypal/paypal-server-sdk');

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: 'test',
        oAuthClientSecret: 'test'
    },
    environment: Environment.Sandbox
});

const ordersController = new OrdersController(client);
console.log('OrdersController methods:', Object.getOwnPropertyNames(OrdersController.prototype));
