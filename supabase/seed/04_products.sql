-- PRODUCTS

-- 1. Organic Virgin Argan Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_01', 'cat_argan', 'ARG-VIRGIN-001', 35.00, 200, true, true, true);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc", "keywords") VALUES
('prod_01', 'en', 'Organic Virgin Argan Oil', 'moroccan-wholesale-suppliers-of-argan-oil', 'Buy Organic argan oil 100% pure in bulk...', 'Organic Virgin Argan Oil - 100% Pure Certified | Wholesale', 'Premium organic argan oil wholesale from Morocco...', 'argan oil, organic argan oil, virgin argan oil, wholesale argan oil, certified argan oil'),
('prod_01', 'ar', 'زيت الأركان العضوي البكر', 'زيت-الأركان-العضوي-البكر', 'زيت الأركان العضوي 100% نقي معتمد من المغرب...', 'زيت الأركان العضوي البكر - 100% نقي معتمد', 'زيت الأركان المغربي بالجملة...', NULL),
('prod_01', 'fr', 'Huile d''Argan Vierge Bio', 'huile-argan-vierge-bio', 'Huile d''argan bio 100% pure certifiée du Maroc...', 'Huile d''Argan Vierge Bio - 100% Pure Certifiée', 'Huile d''argan marocaine en gros...', NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_01_1l', 'prod_01', 'ARG-VIRGIN-1L', '1 Liter', 35.00, 100),
('var_01_5l', 'prod_01', 'ARG-VIRGIN-5L', '5 Liters', 160.00, 50),
('var_01_10l', 'prod_01', 'ARG-VIRGIN-10L', '10 Liters', 300.00, 30);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_01', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', true);


-- 2. Prickly Pear Seed Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_02', 'cat_argan', 'PRICKLY-001', 85.00, 50, true, true, true);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_02', 'en', 'Organic Prickly Pear Seed Oil', 'organic-prickly-pear-seed-oil-wholesale', 'Prickly pear seed oil in bulk...', 'Prickly Pear Seed Oil - Organic Wholesale | Anti-Aging', 'Premium prickly pear seed oil from Morocco...'),
('prod_02', 'ar', 'زيت بذور التين الشوكي العضوي', 'زيت-بذور-التين-الشوكي', 'زيت بذور التين الشوكي 100% عضوي معتمد...', 'زيت بذور التين الشوكي العضوي - مضاد للشيخوخة', 'زيت التين الشوكي المغربي...'),
('prod_02', 'fr', 'Huile de Graines de Figue de Barbarie Bio', 'huile-graines-figue-barbarie-bio', 'Huile de graines de figue de barbarie 100% pure et bio certifiée...', 'Huile de Figue de Barbarie Bio - Anti-Âge', 'Huile de figue de barbarie marocaine...');

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_02_1l', 'prod_02', 'PRICKLY-1L', '1 Liter', 850.00, 20),
('var_02_500ml', 'prod_02', 'PRICKLY-500ML', '500ml', 450.00, 30);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_02', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', true);


-- 3. Moroccan Black Soap
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_03', 'cat_essential', 'BLACKSOAP-001', 12.00, 150, true, true, true);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_03', 'en', 'Organic Moroccan Black Soap', 'moroccan-black-soap-suppliers-wholesale-africa-benefits', 'Extra Moroccan Black Soap 100% Organic...', 'Moroccan Black Soap Wholesale - 100% Organic', 'Authentic Moroccan black soap...'),
('prod_03', 'ar', 'الصابون البلدي المغربي العضوي', 'الصابون-البلدي-المغربي', 'الصابون البلدي المغربي 100% عضوي...', 'الصابون البلدي المغربي - 100% عضوي', 'صابون مغربي أصيل...'),
('prod_03', 'fr', 'Savon Noir Marocain Bio', 'savon-noir-marocain-bio', 'Savon noir marocain extra 100% bio...', 'Savon Noir Marocain Bio - En Gros', 'Savon noir marocain authentique...');

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_03_1kg', 'prod_03', 'BLACKSOAP-1KG', '1 Kg', 12.00, 100),
('var_03_5kg', 'prod_03', 'BLACKSOAP-5KG', '5 Kg', 55.00, 50);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_03', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', true);
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
-- 9. Moroccan Blue Tansy
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_09', 'cat_essential', 'ESS-BLUETANSY-001', 95.00, 30, true, true, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_09', 'en', 'Organic Moroccan Blue Tansy Oil', 'moroccan-blue-tansy-essential-oil', 'Rare and precious Moroccan Blue Tansy oil...', 'Blue Tansy Essential Oil - Rare Moroccan Wholesale', 'Rare Blue Tansy oil from Morocco...'),
('prod_09', 'ar', 'زيت التانسي الأزرق المغربي', 'زيت-التانسي-الأزرق', 'زيت التانسي الأزرق المغربي النادر والثمين...', NULL, NULL),
('prod_09', 'fr', 'Huile de Tanaisie Bleue du Maroc Bio', 'huile-tanaisie-bleue', 'Huile de Tanaisie Bleue rare et précieuse...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_09_15ml', 'prod_09', 'BLUETANSY-15ML', '15ml', 95.00, 20),
('var_09_50ml', 'prod_09', 'BLUETANSY-50ML', '50ml', 280.00, 10);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_09', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80', true);


-- 10. Aker Fassi Powder
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_10', 'cat_powders', 'POWDER-AKER-001', 15.00, 200, true, true, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_10', 'en', 'Organic Aker Fassi Powder', 'aker-fassi-powder-benefits', '100% natural Moroccan Aker Fassi powder...', 'Organic Aker Fassi Powder - Moroccan Beauty Secret', 'Pure Aker Fassi powder from Morocco...'),
('prod_10', 'ar', 'مسحوق العكر الفاسي العضوي', 'عكر-فاسي', 'بودرة العكر الفاسي هي من أسرار الجمال المغربي التقليدي...', NULL, NULL),
('prod_10', 'fr', 'Poudre Aker Fassi Bio', 'poudre-aker-fassi', 'Poudre d''Aker Fassi 100% naturelle...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_10_50g', 'prod_10', 'AKER-50G', '50g', 15.00, 100),
('var_10_100g', 'prod_10', 'AKER-100G', '100g', 28.00, 100);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_10', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', true);


-- 11. Nila (Indigo) Powder
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_11', 'cat_powders', 'POWDER-NILA-001', 18.00, 150, true, true, true);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_11', 'en', 'Organic Moroccan Nila Powder', 'moroccan-indigo-powder-benefits', 'Authentic Moroccan Nila (Indigo) powder...', 'Moroccan Nila Powder - Natural Skin Whitening', 'Discover the power of Moroccan Nila powder...'),
('prod_11', 'ar', 'مسحوق النيلة الزرقاء المغربية', 'نيلة-زرقاء', 'مسحوق النيلة المغربية طبيعي 100% ومثالي للبشرة...', NULL, NULL),
('prod_11', 'fr', 'Poudre de Nila Bleue du Maroc', 'poudre-nila-bleue', 'Poudre de Nila bleue authentique du Maroc...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_11_100g', 'prod_11', 'NILA-100G', '100g', 18.00, 80),
('var_11_250g', 'prod_11', 'NILA-250G', '250g', 40.00, 70);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_11', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', true);


-- 12. Sidr Powder
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_12', 'cat_powders', 'POWDER-SIDR-001', 10.00, 180, true, false, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_12', 'en', 'Organic Moroccan Sidr Powder', 'sidr-powder-benefits', '100% pure Sidr (Lote tree) powder...', 'Sidr Powder Morocco - Hair & Skin Care', 'Pure Sidr powder for healthy hair and skin...'),
('prod_12', 'ar', 'مسحوق السدر المغربي العضوي', 'سدر-مغربي', 'مسحوق السدر المغربي الطبيعي 100%...', NULL, NULL),
('prod_12', 'fr', 'Poudre de Sidr Bio du Maroc', 'poudre-sidr-bio', 'Poudre de Sidr pure du Maroc...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_12_250g', 'prod_12', 'SIDR-250G', '250g', 10.00, 100),
('var_12_1kg', 'prod_12', 'SIDR-1KG', '1kg', 35.00, 80);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_12', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', true);


-- 13. Tabrima Powder
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_13', 'cat_powders', 'POWDER-TABRIMA-001', 20.00, 120, true, false, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_13', 'en', 'Organic Moroccan Tabrima Powder', 'tabrima-powder-benefits', 'Traditional Moroccan Tabrima is a mixture...', 'Moroccan Tabrima Powder - Traditional Hammam Herb Blend', 'Authentic Moroccan Tabrima herb blend...'),
('prod_13', 'ar', 'مسحوق التبريمة المغربية الصحراوية', 'تبريمة-مغربية', 'مزيج التبريمة المغربية التقليدي من الأعشاب...', NULL, NULL),
('prod_13', 'fr', 'Poudre de Tabrima Marocaine Traditionnelle', 'poudre-tabrima', 'Mélange traditionnel d''herbes marocaines pour le hammam...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_13_200g', 'prod_13', 'TABRIMA-200G', '200g', 20.00, 60),
('var_13_500g', 'prod_13', 'TABRIMA-500G', '500g', 45.00, 60);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_13', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80', true);


-- 14. Clementine Essential Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('prod_14', 'cat_essential', 'ESS-CLEMENTINE-001', 28.00, 60, true, false, false);

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description", "metaTitle", "metaDesc") VALUES
('prod_14', 'en', 'Organic Clementine Essential Oil', 'clementine-essential-oil', '100% pure Moroccan Clementine essential oil...', 'Clementine Essential Oil - Pure Moroccan Wholesale', 'Premium Clementine oil from Morocco...'),
('prod_14', 'ar', 'زيت الكليمنتين الأساسي العضوي', 'زيت-الكليمنتين', 'زيت الكليمنتين الأساسي النقي 100% من المغرب...', NULL, NULL),
('prod_14', 'fr', 'Huile Essentielle de Clémentine Bio', 'huile-essentielle-clementine', 'Huile essentielle de clémentine 100% pure du Maroc...', NULL, NULL);

INSERT INTO "ProductVariant" ("id", "productId", "sku", "sizeName", "price", "stock") VALUES
('var_14_50ml', 'prod_14', 'CLEM-50ML', '50ml', 28.00, 30),
('var_14_100ml', 'prod_14', 'CLEM-100ML', '100ml', 50.00, 30);

INSERT INTO "ProductImage" ("productId", "url", "isPrimary") VALUES
('prod_14', 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=800&q=80', true);
-- MIGRATED PRODUCTS FROM OLD DB
-- PRODUCTS SEED (MIGRATED AND ORIGINAL)

-- Product p_old_1: Moroccan cosmetic 100% pure organic argan oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('p_old_1', 'cat_argan', 'OLD-1-MOR', 5.00, 50, true, false, false);
INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
('p_old_1', 'en', 'Moroccan cosmetic 100% pure organic argan oil', 'moroccan-cosmetic-100%-pure-organic-argan-oil-1', 'Pure Moroccan Organic Argan Oil: The Ultimate Natural Elixir for Your Skin, Hair, and Health.
Argan oil, often referred to as ''liquid gold,'' is a precious natural oil derived from the nuts of the Argan tree (Argania spinosa), which is native to Morocco. Known for its numerous benefits, this oil has gained immense popularity in the beauty and wellness world. Pure Moroccan organic argan oil is considered one of the best oils for skincare, haircare, and overall health, making it a must-have in every household.

we''ll explore the incredible benefits of pure Moroccan organic argan oil, how to use it, and why it stands out as a top-tier product in the natural beauty industry.

### Benefits
This organic olive oil is cold-pressed from the finest olives, offering a rich taste and numerous health benefits. Great for cooking, salads, and skincare.'),
('p_old_1', 'ar', 'زيت الأركان المغربي التجميلي العضوي النقي 100%', 'زيت-الأركان-المغربي-التجميلي-العضوي-النقي-100%-ar-1', 'زيت الأرجان المغربي العضوي الخالص: الإكسير الطبيعي المطلق لبشرتك وشعرك وصحتك.
يُشار إلى زيت الأرجان غالبًا باسم ''الذهب السائل''، وهو زيت طبيعي ثمين مشتق من جوز شجرة الأرجان (Argania spinosa)، التي تنمو في المغرب. يُعرف هذا الزيت بفوائده العديدة، وقد اكتسب شعبية هائلة في عالم الجمال والعافية. يُعتبر زيت الأرجان المغربي العضوي الخالص أحد أفضل الزيوت للعناية بالبشرة والعناية بالشعر والصحة العامة، مما يجعله ضروريًا في كل منزل.

سنستكشف الفوائد المذهلة لزيت الأرجان المغربي العضوي الخالص، وكيفية استخدامه، ولماذا يبرز كمنتج من الدرجة الأولى في صناعة التجميل الطبيعي.

### الفوائد
يتم عصر زيت الزيتون العضوي هذا على البارد من أجود الزيتون، مما يمنحه طعمًا غنيًا وفوائد صحية عديدة. رائع للطهي والسلطات والعناية بالبشرة.');

-- Product p_old_3: Organic Argan Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('p_old_3', 'cat_argan', 'OLD-3-ORG', 30.00, 30, true, false, false);
INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
('p_old_3', 'en', 'Organic Argan Oil', 'organic-argan-oil-3', 'Moroccan organic argan oil for skin and hair nourishment.

### Usage
This Moroccan Argan oil is renowned for its ability to improve hair texture and skin elasticity. Cold-pressed for pure quality.

### Benefits
This Moroccan Argan oil is renowned for its ability to improve hair texture and skin elasticity. Cold-pressed for pure quality.'),
('p_old_3', 'ar', 'زيت الأرجان العضوي', 'زيت-الأرجان-العضوي-ar-3', 'زيت الأرجان المغربي العضوي لتغذية البشرة والشعر.

### الاستخدام
يشتهر زيت الأرجان المغربي بقدرته على تحسين ملمس الشعر ومرونة البشرة. معصور على البارد للحصول على جودة نقية.

### الفوائد
غني بفيتامين E والأحماض الدهنية، يرطب زيت الأرجان البشرة ويقلل التجاعيد مع تعزيز الشعر اللامع والناعم.');

-- Product p_old_4: Organic Avocado Oil
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('p_old_4', 'cat_essential', 'OLD-4-ORG', 18.99, 40, true, false, false);
INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
('p_old_4', 'en', 'Organic Avocado Oil', 'organic-avocado-oil-4', 'Cold-pressed organic avocado oil, great for cooking and skin hydration.

### Usage
Avocado oil is cold-pressed from the flesh of avocados, rich in healthy fats and antioxidants. Great for cooking and as a moisturizing agent.

### Benefits
Helps to promote skin hydration, reduce wrinkles, and protect against sun damage. Ideal for sensitive skin.'),
('p_old_4', 'ar', 'زيت الأفوكادو العضوي', 'زيت-الأفوكادو-العضوي-ar-4', 'زيت الأفوكادو العضوي المعصور على البارد، رائع للطهي وترطيب البشرة.

### الاستخدام
يُعصر زيت الأفوكادو من لب الأفوكادو، ويعتبر غنيًا بالدهون الصحية ومضادات الأكسدة. رائع للطهي وكعامل ترطيب.

### الفوائد
يساعد على ترطيب البشرة وتقليل التجاعيد وحمايتها من أضرار الشمس. مثالي للبشرة الحساسة.');

-- Product p_old_5: Organic Hemp Seed Oil	2
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "isFeatured", "isTopSale")
VALUES ('p_old_5', 'cat_essential', 'OLD-5-ORG', 22.00, 60, true, false, false);
INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
('p_old_5', 'en', 'Organic Hemp Seed Oil	2', 'organic-hemp-seed-oil	2-5', 'Cold-pressed organic avocado oil, great for cooking and skin hydration.

### Usage
Jojoba oil is a golden liquid wax extracted from the seeds of the jojoba plant. Ideal for moisturizing and healing dry skin.

### Benefits
Helps restore skin moisture, reduce inflammation, and improve skin texture. Excellent for hair care, especially for dry scalps.'),
('p_old_5', 'ar', 'منتوج', 'منتوج-ar-5', 'زيت الأرجان المغربي العضوي لتغذية البشرة والشعر.

### الاستخدام
زيت الجوجوبا هو شمع سائل ذهبي مستخرج من بذور نبات الجوجوبا. مثالي لترطيب وعلاج البشرة الجافة.

### الفوائد
يساعد في استعادة رطوبة البشرة وتقليل الالتهاب وتحسين ملمس البشرة. ممتاز للعناية بالشعر، خاصة لفروة الرأس الجافة.');

