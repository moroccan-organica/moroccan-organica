
const http = require('http');

async function testRouting(formType, product) {
    console.log(`\n--- Testing ${formType || 'default'} / ${product || 'none'} ---`);
    const payload = JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "Test message for routing validation",
        formType: formType,
        product: product
    });

    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/contact',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                console.log("Status:", res.statusCode);
                console.log("Response:", data);
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error("Request failed:", e.message);
            resolve(); // Don't crash
        });

        req.write(payload);
        req.end();
    });
}

async function runTests() {
    await testRouting('general', 'General Inquiry');
    await testRouting('quote', 'Argan Oil');
    await testRouting('other', 'Special Order');
}

runTests();
