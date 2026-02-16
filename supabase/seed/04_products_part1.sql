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
