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
