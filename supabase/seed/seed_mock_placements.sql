-- TOP SALE PRODUCTS (Price = 0, Stock = 0, No Images, Placement = topsale)
-- All 9 products from the "TOP SELLING PRODUCTS" mock data
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "placement") VALUES
('cf89b6f1-628b-4f51-a9f4-18c94eb10e3d', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-ARG-001', 0, 0, true, 'topsale'),
('d3a43f8e-8a1d-405c-9d62-4bc78a0113f9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-PRK-001', 0, 0, true, 'topsale'),
('618f6d3a-2a4b-4b19-94d3-00e704e9c7bc', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-BLK-001', 0, 0, true, 'topsale'),
('e7b955c4-754e-4f11-9a70-8b1b22e022f4', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-ROS-001', 0, 0, true, 'topsale'),
('8b19316d-3e5a-4b95-a4b5-685d3920c5d7', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-RHS-001', 0, 0, true, 'topsale'),
('2a59f632-d17e-40d6-99c5-6821d3f545a9', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-CUL-001', 0, 0, true, 'topsale'),
('99587de5-546f-408c-b026-666d9266e74b', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-AKR-001', 0, 0, true, 'topsale'),
('c382f679-05d5-4f40-84dc-660c04a08c5d', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-NIL-001', 0, 0, true, 'topsale'),
('46c18f3d-5b31-4192-805c-352b204de552', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'TS-SDR-001', 0, 0, true, 'topsale');

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
-- 1. Organic Argan Oil
('cf89b6f1-628b-4f51-a9f4-18c94eb10e3d', 'en', 'Organic Argan Oil', 'ts-organic-argan-oil', '100% pure, cold-pressed organic Argan oil. Rich in Vitamin E and antioxidants for hair, skin, and nails.'),
('cf89b6f1-628b-4f51-a9f4-18c94eb10e3d', 'ar', 'زيت الأركان العضوي', 'ts-organic-argan-oil-ar', 'زيت أركان عضوي 100٪ نقي ومعصور على البارد. غني بفيتامين E ومضادات الأكسدة للشعر والبشرة والأظافر.'),
('cf89b6f1-628b-4f51-a9f4-18c94eb10e3d', 'fr', 'Huile d''Argan Bio', 'ts-organic-argan-oil-fr', 'Huile d''argan bio 100% pure et pressée à froid. Riche en vitamine E et antioxydants.'),

-- 2. Prickly Pear Seed Oil
('d3a43f8e-8a1d-405c-9d62-4bc78a0113f9', 'en', 'Prickly Pear Seed Oil', 'ts-prickly-pear-seed-oil', 'The world''s most precious oil. Powerful anti-aging properties, tightens pores, and restores skin elasticity.'),
('d3a43f8e-8a1d-405c-9d62-4bc78a0113f9', 'ar', 'زيت بذور التين الشوكي', 'ts-prickly-pear-seed-oil-ar', 'الزيت الأغلى في العالم. خصائص قوية مضادة للشيخوخة، يشد المسام، ويستعيد مرونة الجلد.'),
('d3a43f8e-8a1d-405c-9d62-4bc78a0113f9', 'fr', 'Huile de Figue de Barbarie', 'ts-prickly-pear-seed-oil-fr', 'L''huile la plus précieuse au monde. Puissantes propriétés anti-âge, resserre les pores.'),

-- 3. Moroccan Black Soap
('618f6d3a-2a4b-4b19-94d3-00e704e9c7bc', 'en', 'Moroccan Black Soap', 'ts-moroccan-black-soap', 'Traditional Beldi soap made from macerated olives. Exfoliates, cleanses, and prepares skin for exfoliation.'),
('618f6d3a-2a4b-4b19-94d3-00e704e9c7bc', 'ar', 'الصابون المغربي الأسود', 'ts-moroccan-black-soap-ar', 'صابون بلدي تقليدي مصنوع من الزيتون المنقوع. يقشر وينظف ويحضر البشرة للتقشير.'),
('618f6d3a-2a4b-4b19-94d3-00e704e9c7bc', 'fr', 'Savon Noir Marocain', 'ts-moroccan-black-soap-fr', 'Savon Beldi traditionnel à base d''olives macérées. Exfolie et nettoie.'),

-- 4. Pure Rose Water
('e7b955c4-754e-4f11-9a70-8b1b22e022f4', 'en', 'Pure Rose Water', 'ts-pure-rose-water', 'Distilled from Rosa Damascena. Natural toner that hydrates, soothes, and refreshes all skin types.'),
('e7b955c4-754e-4f11-9a70-8b1b22e022f4', 'ar', 'ماء الورد النقي', 'ts-pure-rose-water-ar', 'مقطر من الورد الدمشقي. تونر طبيعي يرطب ويهدئ وينعش جميع أنواع البشرة.'),
('e7b955c4-754e-4f11-9a70-8b1b22e022f4', 'fr', 'Eau de Rose Pure', 'ts-pure-rose-water-fr', 'Distillée à partir de Rosa Damascena. Tonique naturel qui hydrate et apaise.'),

-- 5. Rhassoul Clay
('8b19316d-3e5a-4b95-a4b5-685d3920c5d7', 'en', 'Rhassoul Clay', 'ts-rhassoul-clay', 'Mineral-rich clay from the Atlas Mountains. Purifies, cleanses, and detoxifies skin and hair.'),
('8b19316d-3e5a-4b95-a4b5-685d3920c5d7', 'ar', 'طين الغاسول', 'ts-rhassoul-clay-ar', 'طين غني بالمعادن من جبال الأطلس. ينقي وينظف ويزيل السموم من البشرة والشعر.'),
('8b19316d-3e5a-4b95-a4b5-685d3920c5d7', 'fr', 'Argile Rhassoul', 'ts-rhassoul-clay-fr', 'Argile riche en minéraux des montagnes de l''Atlas. Purifie et détoxifie.'),

-- 6. Culinary Argan Oil
('2a59f632-d17e-40d6-99c5-6821d3f545a9', 'en', 'Culinary Argan Oil', 'ts-culinary-argan-oil', 'Toasted Argan oil with a nutty flavor. Rich in nutrients, perfect for salads, dips, and cooking.'),
('2a59f632-d17e-40d6-99c5-6821d3f545a9', 'ar', 'زيت الأركان للطبخ', 'ts-culinary-argan-oil-ar', 'زيت أركان محمص بنكهة البندق. غني بالعناصر الغذائية ، مثالي للسلطات والطبخ.'),
('2a59f632-d17e-40d6-99c5-6821d3f545a9', 'fr', 'Huile d''Argan Culinaire', 'ts-culinary-argan-oil-fr', 'Huile d''argan torréfiée au goût de noisette. Riche en nutriments.'),

-- 7. Aker Fassi Powder
('99587de5-546f-408c-b026-666d9266e74b', 'en', 'Aker Fassi Powder', 'ts-aker-fassi-powder', 'Natural poppy and pomegranate powder. Used for lip & cheek tint and traditional skincare treatments.'),
('99587de5-546f-408c-b026-666d9266e74b', 'ar', 'مسحوق العكر الفاسي', 'ts-aker-fassi-powder-ar', 'مسحوق الخشخاش والرمان الطبيعي. يستخدم لتلوين الشفاه والخدود.'),
('99587de5-546f-408c-b026-666d9266e74b', 'fr', 'Poudre Aker Fassi', 'ts-aker-fassi-powder-fr', 'Poudre naturelle de coquelicot et de grenade. Soins traditionnels.'),

-- 8. Nila Powder
('c382f679-05d5-4f40-84dc-660c04a08c5d', 'en', 'Nila Powder', 'ts-nila-powder', 'Royal blue indigo powder from the Sahara. Known for its brightening and anti-inflammatory properties.'),
('c382f679-05d5-4f40-84dc-660c04a08c5d', 'ar', 'مسحوق النيلة', 'ts-nila-powder-ar', 'مسحوق النيلي الأزرق الملكي من الصحراء. معروف بخصائصه المشرقة.'),
('c382f679-05d5-4f40-84dc-660c04a08c5d', 'fr', 'Poudre de Nila', 'ts-nila-powder-fr', 'Poudre d''indigo bleu royal du Sahara. Reconnue pour l''éclaircissement.'),

-- 9. Sidr Powder
('46c18f3d-5b31-4192-805c-352b204de552', 'en', 'Sidr Powder', 'ts-sidr-powder', 'Natural Jujube leaves powder. Excellent natural shampoo alternative that strengthens and volumizes hair.'),
('46c18f3d-5b31-4192-805c-352b204de552', 'ar', 'مسحوق السدر', 'ts-sidr-powder-ar', 'مسحوق أوراق العناب الطبيعي. بديل ممتاز ومقوي للشعر.'),
('46c18f3d-5b31-4192-805c-352b204de552', 'fr', 'Poudre de Sidr', 'ts-sidr-powder-fr', 'Poudre de feuilles de jujubier naturelles. Alternative au shampooing.');


-- FEATURED PRODUCTS (Price = 0, Stock = 0, No Images, Placement = featured)
-- 7 highlighted items from hero slides
INSERT INTO "Product" ("id", "categoryId", "sku", "basePrice", "stock", "isAvailable", "placement") VALUES
('f3305a41-3b7c-4870-8f69-d58853b02df1', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-001', 0, 0, true, 'featured'),
('09c25de1-1188-466d-a77e-2f88eb0abcc2', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-002', 0, 0, true, 'featured'),
('7d0d62d2-8b7c-4545-97fc-7b9af1006e88', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-003', 0, 0, true, 'featured'),
('516ef062-8706-4fc6-b258-c923d3879f98', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-004', 0, 0, true, 'featured'),
('ba4b8c6e-8120-43b9-a29d-ef343dbbc081', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-005', 0, 0, true, 'featured'),
('1c62b9a7-86c5-4a25-a7b6-c567a151b72e', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-006', 0, 0, true, 'featured'),
('94e242cf-3269-450b-9df6-7b2cc8e21950', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'FEAT-SLIDE-007', 0, 0, true, 'featured');

INSERT INTO "ProductTranslation" ("productId", "language", "name", "slug", "description") VALUES
('f3305a41-3b7c-4870-8f69-d58853b02df1', 'en', 'Moroccan Beauty Products Wholesale', 'feat-beauty-wholesale', 'Trusted Wholesale Suppliers of argan oil and different cosmetics products based on organic oils in Morocco.'),
('f3305a41-3b7c-4870-8f69-d58853b02df1', 'ar', 'منتجات التجميل المغربية بالجملة', 'feat-beauty-wholesale-ar', 'موردو الجملة الموثوق بهم لزيت الأركان ومستحضرات التجميل المختلفة.'),
('f3305a41-3b7c-4870-8f69-d58853b02df1', 'fr', 'Produits de Beauté Marocains en Gros', 'feat-beauty-wholesale-fr', 'Fournisseurs en gros de confiance d''huile d''argan et de divers produits.'),

('09c25de1-1188-466d-a77e-2f88eb0abcc2', 'en', 'Argan Oil of Morocco', 'feat-argan-morocco', 'Argan oil for Hair, The Liquid Gold for your Skin, Hair, and Nails.'),
('09c25de1-1188-466d-a77e-2f88eb0abcc2', 'ar', 'زيت الأركان المغربي الأصيل', 'feat-argan-morocco-ar', 'زيت الأركان للشعر، الذهب السائل لبشرتك وشعرك وأظافرك.'),
('09c25de1-1188-466d-a77e-2f88eb0abcc2', 'fr', 'Huile d''Argan du Maroc', 'feat-argan-morocco-fr', 'L''Or Liquide pour votre peau, vos cheveux et vos ongles.'),

('7d0d62d2-8b7c-4545-97fc-7b9af1006e88', 'en', 'Argan Oil Bulk Export', 'feat-argan-bulk-export', 'Specialist in Pure Organic Argan Oil and 100% Organic Prickly Pear Seed Cactus Oil, distributed and packaged in bulk.'),
('7d0d62d2-8b7c-4545-97fc-7b9af1006e88', 'ar', 'تصدير زيت الأركان بالجملة', 'feat-argan-bulk-export-ar', 'متخصصون في زيت الأركان، معبأ بالجملة.'),
('7d0d62d2-8b7c-4545-97fc-7b9af1006e88', 'fr', 'Exportation d''Huile d''Argan en Gros', 'feat-argan-bulk-export-fr', 'Spécialiste de l''Huile d''Argan, distribuée et conditionnée en vrac.'),

('516ef062-8706-4fc6-b258-c923d3879f98', 'en', 'Organic Products Fast Shipping', 'feat-organic-fast-shipping', 'We are able to ship our argan oil by air cargo worldwide with a short transit time.'),
('516ef062-8706-4fc6-b258-c923d3879f98', 'ar', 'شحن سريع للمنتجات العضوية', 'feat-organic-fast-shipping-ar', 'قادرون على شحن زيت الأركان الخاص بنا عن طريق الشحن الجوي في جميع أنحاء العالم.'),
('516ef062-8706-4fc6-b258-c923d3879f98', 'fr', 'Expédition Rapide de Produits Bio', 'feat-organic-fast-shipping-fr', 'Nous expédions par fret aérien dans le monde entier.'),

('ba4b8c6e-8120-43b9-a29d-ef343dbbc081', 'en', 'Pure Prickly Pear Seed Oil', 'feat-pure-prickly-pear', 'High grade cosmetic Prickly pear cactus seeds oil production.'),
('ba4b8c6e-8120-43b9-a29d-ef343dbbc081', 'ar', 'زيت التين الشوكي النقي', 'feat-pure-prickly-pear-ar', 'إنتاج عالي الجودة لزيت بذور الصبار.'),
('ba4b8c6e-8120-43b9-a29d-ef343dbbc081', 'fr', 'Huile de Pépins de Figue de Barbarie', 'feat-pure-prickly-pear-fr', 'Production d''huile de figue de barbarie de haute qualité cosmétique.'),

('1c62b9a7-86c5-4a25-a7b6-c567a151b72e', 'en', 'Moroccan Rhassoul Clay', 'feat-mr-rhassoul', 'Moroccan Rhassoul clay is the best organic solution to keep your face and skin clean and soft.'),
('1c62b9a7-86c5-4a25-a7b6-c567a151b72e', 'ar', 'طين الغاسول المغربي', 'feat-mr-rhassoul-ar', 'طين الغاسول المغربي هو أفضل حل عضوي للحفاظ على نظافة وجهك وبشرتك.'),
('1c62b9a7-86c5-4a25-a7b6-c567a151b72e', 'fr', 'Argile Rhassoul Marocaine', 'feat-mr-rhassoul-fr', 'L''argile Rhassoul est la meilleure solution bio pour garder votre peau propre.'),

('94e242cf-3269-450b-9df6-7b2cc8e21950', 'en', 'Moroccan Black Soap', 'feat-mr-black-soap', 'Moroccan BLACK SOAP with vitamin E is the best organic solution to keep your face and skin clean and soft.'),
('94e242cf-3269-450b-9df6-7b2cc8e21950', 'ar', 'الصابون المغربي الأسود', 'feat-mr-black-soap-ar', 'الصابون المغربي الأسود هو أفضل حل عضوي للحفاظ على نظافتك.'),
('94e242cf-3269-450b-9df6-7b2cc8e21950', 'fr', 'Savon Noir Marocain', 'feat-mr-black-soap-fr', 'Le SAVON NOIR marocain à la vitamine E est la meilleure solution bio.');