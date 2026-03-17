// Test the contact form API endpoint directly
require('dotenv').config();

async function testContactForm() {
  console.log('Testing Contact Form (/api/contact)...\n');

  const formData = {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    phone: "+44 7700 900123",
    type: "Organic Virgin",
    liters: "200",
    destination: "London, United Kingdom",
    message: "Hello, I am interested in purchasing organic argan oil in bulk for my cosmetics brand. Could you please provide pricing for 200 liters? Thank you.",
    product: "General Inquiry",
    formType: "general"
  };

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! Status:', response.status);
      console.log('Response:', JSON.stringify(result, null, 2));
      console.log('\n📧 Email sent to inquiry@moroccanorganica.com');
    } else {
      console.log('❌ FAILED! Status:', response.status);
      console.log('Error:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testContactForm();
