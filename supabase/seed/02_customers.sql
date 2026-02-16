-- Sample Customer
INSERT INTO "Customer" ("id", "email", "phone", "firstName", "lastName", "isWholesale", "marketingOptIn")
VALUES (
    'cust_01', 
    'customer@example.com', 
    '+212612345678', 
    'Ahmed', 
    'Benali', 
    false, 
    true
) ON CONFLICT ("email") DO NOTHING;

-- Customer Address
INSERT INTO "Address" ("id", "customerId", "label", "addressLine1", "city", "postalCode", "country", "phone")
VALUES (
    'addr_01', 
    'cust_01', 
    'Home', 
    '123 Rue Mohammed V', 
    'Casablanca', 
    '20000', 
    'Morocco', 
    '+212612345678'
);
