-- 4. Damascena Rose Water
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_04', 'cat_essential', 'ROSEWATER-001', 18.00, 120, true, true, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_04', 'en', 'Pure Damascena Rose Water', 'wholesale-pure-rosewater-from-morocco-organic-natural', 'Pure natural organic Damascena rose water...', 'Damascena Rose Water - Pure Organic Wholesale', 'Pure Moroccan rose water...'),
('prod_04', 'ar', 'ماء الورد الدمشقي النقي', 'ماء-الورد-الدمشقي', 'ماء الورد الدمشقي الطبيعي العضوي...', 'ماء الورد الدمشقي - عضوي نقي', 'ماء ورد مغربي نقي...'),
('prod_04', 'fr', 'Eau de Rose Damascena Pure', 'eau-rose-damascena-pure', 'Eau de rose damascena pure naturelle bio...', 'Eau de Rose Damascena - Bio Pure', 'Eau de rose marocaine pure...');

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_04_1l', 'prod_04', 'ROSEWATER-1L', '1 Liter', 18.00, 80),
('var_04_10l', 'prod_04', 'ROSEWATER-10L', '10 Liters', 160.00, 40);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_04', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', true);


-- 5. Ghassoul Lava Clay
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_05', 'cat_essential', 'GHASSOUL-001', 8.00, 200, true, true, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_05', 'en', 'Moroccan Ghassoul Lava Clay Powder', 'moroccan-rhassoul-clay-powder-bulk-wholesale-suppliers', 'Moroccan Rhassoul (Ghassoul) clay powder 100% organic...', 'Ghassoul Lava Clay Powder - Wholesale Organic', 'Authentic Moroccan ghassoul clay...'),
('prod_05', 'ar', 'طين الغسول المغربي البركاني', 'طين-الغسول-المغربي', 'مسحوق طين الغسول المغربي 100% عضوي...', 'طين الغسول المغربي - عضوي بالجملة', 'طين غسول مغربي أصيل...'),
('prod_05', 'fr', 'Poudre d''Argile Ghassoul Marocaine', 'argile-ghassoul-marocaine', 'Poudre d''argile Rhassoul (Ghassoul) marocaine 100% bio...', 'Argile Ghassoul Marocaine - Bio En Gros', 'Argile ghassoul marocaine authentique...');

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_05_1kg', 'prod_05', 'GHASSOUL-1KG', '1 Kg', 8.00, 150),
('var_05_25kg', 'prod_05', 'GHASSOUL-25KG', '25 Kg', 180.00, 50);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_05', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', true);


-- 6. Culinary Argan Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_06', 'cat_spices', 'ARG-CULINARY-001', 40.00, 100, true, true, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_06', 'en', 'Organic Culinary Argan Oil', 'culinary-argan-oil-of-morocco', 'Argan oil for culinary use...', 'Culinary Argan Oil of Morocco - Organic Certified', 'Organic culinary argan oil from Morocco...'),
('prod_06', 'ar', 'زيت الأركان الطهوي العضوي', 'زيت-الأركان-الطهوي', 'زيت الأركان للطبخ - الزيت المعجزة من المغرب...', 'زيت الأركان الطهوي المغربي - عضوي معتمد', 'زيت أركان طهوي عضوي من المغرب...'),
('prod_06', 'fr', 'Huile d''Argan Culinaire Bio', 'huile-argan-culinaire-bio', 'Huile d''argan culinaire - l''huile miracle du Maroc...', 'Huile d''Argan Culinaire du Maroc - Bio Certifiée', 'Huile d''argan culinaire bio du Maroc...');

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_06_1l', 'prod_06', 'ARG-CULINARY-1L', '1 Liter', 40.00, 60),
('var_06_5l', 'prod_06', 'ARG-CULINARY-5L', '5 Liters', 185.00, 40);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_06', 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80', true);


-- 7. Rosemary Essential Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_07', 'cat_essential', 'ESS-ROSEMARY-001', 25.00, 80, true, false, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_07', 'en', 'Organic Rosemary Essential Oil', 'rosemary-essential-oil', '100% pure and natural Rosemary essential oil...', 'Rosemary Essential Oil Wholesale - Pure & Natural', 'Premium Moroccan Rosemary essential oil...'),
('prod_07', 'ar', 'زيت إكليل الجبل الأساسي العضوي', 'زيت-إكليل-الجبل', 'زيت إكليل الجبل الأساسي نقي وطبيعي 100% من المغرب...', NULL, NULL),
('prod_07', 'fr', 'Huile Essentielle de Romarin Bio', 'huile-essentielle-romarin', 'Huile essentielle de romarin 100% pure et naturelle du Maroc...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_07_100ml', 'prod_07', 'ROSEMARY-100ML', '100ml', 25.00, 50),
('var_07_1l', 'prod_07', 'ROSEMARY-1L', '1 Liter', 180.00, 30);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_07', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80', true);


-- 8. Cedarwood Essential Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_08', 'cat_essential', 'ESS-CEDAR-001', 22.00, 100, true, false, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_08', 'en', 'Organic Atlas Cedarwood Essential Oil', 'cedarwood-essential-oil', 'Authentic Atlas Cedarwood oil...', 'Atlas Cedarwood Essential Oil - Moroccan Wholesale', 'Pure Atlas Cedarwood oil from Morocco...'),
('prod_08', 'ar', 'زيت خشب الأرز الأطلسي الأساسي', 'زيت-خشب-الأرز', 'زيت خشب الأرز الأطلسي الأصيل من جبال المغرب...', NULL, NULL),
('prod_08', 'fr', 'Huile Essentielle de Cèdre de l''Atlas Bio', 'huile-essentielle-cedre', 'Huile de cèdre de l''Atlas authentique des montagnes marocaines...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_08_100ml', 'prod_08', 'CEDAR-100ML', '100ml', 22.00, 60),
('var_08_1l', 'prod_08', 'CEDAR-1L', '1 Liter', 150.00, 40);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_08', 'https://images.unsplash.com/photo-1611080511005-4202302484a0?w=800&q=80', true);
