const { Client, OrdersController, Environment } = require('@paypal/paypal-server-sdk');

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: 'test',
        oAuthClientSecret: 'test'
    },
    environment: Environment.Sandbox
});

const ordersController = new OrdersController(client);
console.log('createOrder details:', ordersController.ordersCreate); // Oops, I should check the one I found
console.log('createOrder details:', ordersController.createOrder.toString());
console.log('getOrder details:', ordersController.getOrder.toString());
console.log('captureOrder details:', ordersController.captureOrder.toString());
