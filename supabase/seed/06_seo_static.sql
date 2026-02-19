-- GLOBAL SEO
INSERT INTO "GlobalSeoSetting" ("id", "ogImage", "twitterHandle", "facebookPage") VALUES
('seo_global', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80', '@moroccanorganica', 'https://facebook.com/moroccanorganica');

INSERT INTO "GlobalSeoTranslation" ("globalSeoSettingId", "language", "siteName", "titleSuffix", "defaultMetaDesc", "defaultKeywords") VALUES
('seo_global', 'en', 'Moroccan Organica', ' | Argan Oil Wholesale Morocco', 'Buy Moroccan organic beauty products...', 'Argan oil, Argan oil benefits for skin...'),
('seo_global', 'fr', 'Moroccan Organica', ' | Vente en Gros Huile d''Argan', 'Achetez des produits de beauté bio marocains...', 'huile d''argan, gros, bio, maroc...'),
('seo_global', 'ar', 'موروكان أورجانيكا', ' | زيت الأرغان المغربي بالجملة', 'اشترِ شركة مستحضرات التجميل العضوية...', 'زيت الأرغان ، فوائد زيت الأرغان للبشرة...');

-- STATIC PAGES
INSERT INTO "public"."StaticPage" ("id", "systemName") VALUES 
('133588b0-6d3a-4ac5-80c4-4a7279485ec9', 'BLOG'), 
('a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'SHOP'), 
('b1d2e3f4-a5c6-4b7d-8e9f-0a1b2c3d4e5f', 'PRODUCTS'), 
('c9a8b7c6-d5e4-4f3b-a2c1-b0a9d8c7e6f5', 'HOME'), 
('d4f5e6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'ABOUT_US'), 
('e1a2b3c4-d5f6-4a7b-8c9d-0e1f2a3b4c5d', 'CONTACT'), 
('f0e9d8c7-b6a5-4432-1a0b-9c8d7e6f5a4b', 'PRIVACY_POLICY'), 
('0a1b2c3d-4e5f-4a6b-7c8d-9e0f1a2b3c4d', 'DELIVERY_INFO'), 
('1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', 'TERMS_CONDITIONS'), 
('2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', 'PRIVATE_LABEL'), 
('3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'HOW_TO_ORDER');

-- STATIC PAGE TRANSLATIONS
INSERT INTO "public"."StaticPageTranslation" ("id", "staticPageId", "language", "h1", "description", "slug", "metaTitle", "metaDesc", "keywords", "ogImage", "canonical") VALUES 
-- BLOG
('56c2d1e0-77a4-4f0e-9b3c-82e1d4a5f6b7', '133588b0-6d3a-4ac5-80c4-4a7279485ec9', 'en', 'Our Blog', null, 'blog', 'Our Blog - Organic Beauty Tips & News | Moroccan Organica', 'Stay updated with our blog...', 'organic beauty blog, argan oil tips', null, null), 
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', '133588b0-6d3a-4ac5-80c4-4a7279485ec9', 'ar', 'مدونتنا', null, 'المدونة', 'مدونتنا - نصائح وأخبار الجمال العضوي', '...', 'مدونة الجمال العضوي', null, null), 
('b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e', '133588b0-6d3a-4ac5-80c4-4a7279485ec9', 'fr', 'Notre Blog', null, 'blog', 'Notre Blog - Conseils de Beauté Bio', '...', 'blog beauté bio', null, null), 

-- SHOP
('c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f', 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'en', 'Our Shop', null, 'shop', 'Shop Moroccan Organica - Premium Wholesale', '...', 'shop argan oil', null, null), 
('d3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7a', 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'ar', 'متجرنا', null, 'المتجر', 'متجر مغربية أورجانيكا', '...', 'متجر زيت أركان', null, null), 
('e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7a8b', 'a2b3c4d5-e6f7-4a8b-9c0d-1e2f3a4b5c6d', 'fr', 'Notre Boutique', null, 'boutique', 'Boutique Moroccan Organica', '...', 'boutique huile d''argan', null, null), 

-- PRODUCTS
('f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7a8b9c', 'b1d2e3f4-a5c6-4b7d-8e9f-0a1b2c3d4e5f', 'en', 'Moroccan beauty products wholesale', null, 'products', 'Moroccan cosmetic wholesale', '...', 'Argan oil, skincare wholesale', null, null), 
('0a1b2c3d-4e5f-4a6b-7c8d-9e0f1a2b3c4e', 'b1d2e3f4-a5c6-4b7d-8e9f-0a1b2c3d4e5f', 'ar', 'البيع بالجملة لمستحضرات التجميل المغربية', null, 'المنتجات', 'زيت الأرغان المغربي الاصلي', '...', 'زيت الأرغان، مستحضرات تجميل', null, null), 
('1b2c3d4e-5f6a-4b7c-8d9e-0f1a2b3c4d5f', 'b1d2e3f4-a5c6-4b7d-8e9f-0a1b2c3d4e5f', 'fr', 'Cosmétiques marocains en gros', null, 'produits', 'Vente en gros de cosmétiques', '...', 'huile d''argan, cosmétiques marocains', null, null),

-- HOME
('2c3d4e5f-6a7b-4c8d-9e0f-1a2b3c4d5e6a', 'c9a8b7c6-d5e4-4f3b-a2c1-b0a9d8c7e6f5', 'en', 'Moroccan beauty products wholesale', '...', '', 'Argan oil wholesale company', '...', 'Argan oil, bulk', null, null),
('3d4e5f6a-7b8c-4d9e-0f1a-2b3c4d5e6f7b', 'c9a8b7c6-d5e4-4f3b-a2c1-b0a9d8c7e6f5', 'fr', 'Vente en gros de produits bio', '...', '', 'Moroccan Organica - Fournisseur Premium', '...', null, null, null),
('4e5f6a7b-8c9d-4e0f-1a2b-3c4d5e6f7a8c', 'c9a8b7c6-d5e4-4f3b-a2c1-b0a9d8c7e6f5', 'ar', 'البيع بالجملة لمنتجات مغربية عضوية', '...', '', 'مغربية أورجانيكا - مورد متميز', '...', 'زيت الأرغان، جمال', null, null),

-- ABOUT_US
('5f6a7b8c-9d0e-4f1a-2b3c-4d5e6f7a8b9d', 'd4f5e6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'en', 'Wholesale of organic cosmetics products', '...', 'about-organica-group-sarl', 'Wholesale of organic cosmetics', '...', 'Organica Group', null, null),
('6a7b8c9d-0e1f-4a2b-3c4d-5e6f7a8b9c0d', 'd4f5e6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'ar', 'منتجات التجميل العضوية بالجملة', '...', 'من-نحن', 'بيع منتجات التجميل بالجملة', '...', 'اورجانيكا جروب', null, null),
('7b8c9d0e-1f2a-4b3c-4d5e-6f7a8b9c0d1e', 'd4f5e6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'fr', 'Vente en gros de produits cosmétiques', '...', 'a-propos', 'À propos d''Organica Group SARL', '...', 'organica group', null, null),

-- CONTACT
('8c9d0e1f-2a3b-4c4d-5e6f-7a8b9c0d1e2f', 'e1a2b3c4-d5f6-4a7b-8c9d-0e1f2a3b4c5d', 'en', 'Keep in touch', '...', 'contact', 'Wholesale of organic cosmetic products', '...', 'Organica group contact', null, null),
('9d0e1f2a-3b4c-4d5e-6f7a-8b9c0d1e2f3a', 'e1a2b3c4-d5f6-4a7b-8c9d-0e1f2a3b4c5d', 'ar', 'ابقى على تواصل', '...', 'اتصل-بنا', 'Organica بيع منتجات التجميل', '...', 'مجموعة Organica', null, null),
('0e1f2a3b-4c5d-4e6f-7a8b-9c0d1e2f3a4b', 'e1a2b3c4-d5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fr', 'Contactez-Nous', '...', 'contact', 'Contactez Moroccan Organica', '...', 'contact moroccan organica', null, null),

-- PRIVACY_POLICY
('1f2a3b4c-5d6e-4f7a-8b9c-0d1e2f3a4b5c', 'f0e9d8c7-b6a5-4432-1a0b-9c8d7e6f5a4b', 'en', 'Privacy Policy', '...', 'privacy-policy', 'Organica Group - Privacy policy', '...', 'Privacy policy', null, null),
('2a3b4c5d-6e7f-4a8b-9c0d-1e2f3a4b5c6d', 'f0e9d8c7-b6a5-4432-1a0b-9c8d7e6f5a4b', 'ar', 'سياسة الخصوصية', '...', 'سياسة-الخصوصية', 'سياسة الخصوصية', '...', null, null, null),
('3b4c5d6e-7f8a-4b9c-0d1e-2f3a4b5c6d7e', 'f0e9d8c7-b6a5-4432-1a0b-9c8d7e6f5a4b', 'fr', 'Politique de Confidentialité', '...', 'politique-confidentialite', 'Confidentialité - Moroccan Organica', '...', null, null, null),

-- DELIVERY_INFO
('4c5d6e7f-8a9b-4c0d-1e2f-3a4b5c6d7e8f', '0a1b2c3d-4e5f-4a6b-7c8d-9e0f1a2b3c4d', 'en', 'Delivery Information', '...', 'delivery-Information', 'Organica Group - Delivery Information', '...', null, null, null),
('5d6e7f8a-9b0c-4d1e-2f3a-4b5c6d7e8f9a', '0a1b2c3d-4e5f-4a6b-7c8d-9e0f1a2b3c4d', 'ar', 'معلومات التوصيل', '...', 'معلومات-التوصيل', 'معلومات التسليم', '...', null, null, null),
('6e7f8a9b-0c1d-4e2f-3a4b-5c6d7e8f9a0b', '0a1b2c3d-4e5f-4a6b-7c8d-9e0f1a2b3c4d', 'fr', 'Informations de Livraison', '...', 'informations-livraison', 'Livraison - Moroccan Organica', '...', null, null, null),

-- TERMS_CONDITIONS
('7f8a9b0c-1d2e-4f3a-4b4c-5d6e7f8a9b0c', '1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', 'en', 'Terms & Conditions', '...', 'terms-conditions', 'Organica Group - Terms', '...', null, null, null),
('8a9b0c1d-2e3f-4a4b-5c6d-7e8f9a0b1c2d', '1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', 'ar', 'شروط الاستخدام', '...', 'الشروط-والأحكام', 'الشروط والأحكام', '...', null, null, null),
('9b0c1d2e-3f4a-4b5c-6d7e-8f9a0b1c2d3e', '1e2f3a4b-5c6d-4e7f-8a9b-0c1d2e3f4a5b', 'fr', 'Termes et Conditions', '...', 'termes-et-conditions', 'Termes et Conditions', '...', null, null, null),

-- PRIVATE_LABEL
('0c1d2e3f-4a5b-4c6d-7e8f-9a0b1c2d3e4f', '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', 'en', 'Private label service', '...', 'argan-oil-private-label-manufacturer', 'Private label products', '...', 'private label', null, null),
('1d2e3f4a-5b6c-4d7e-8f9a-0b1c2d3e4f5a', '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', 'ar', 'خدمة العلامة الخاصة', '...', 'العلامة-التجارية-الخاصة', 'خدمة العلامة الخاصة', '...', 'ملصقات جاهزة', null, null),
('2e3f4a5b-6c7d-4e8f-9a0b-1c2d3e4f5a6b', '2d3e4f5a-6b7c-4d8e-9f0a-1b2c3d4e5f6a', 'fr', 'Services de Marque Privée', '...', 'marque-privee', 'Marque Privée - Moroccan Organica', '...', null, null, null),

-- HOW_TO_ORDER
('3f4a5b6c-7d8e-4f9a-0b1c-2d3e4f5a6b7c', '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'en', 'How to Order & Payment', '...', 'how-to-order-pay', 'How to Order', '...', 'how to order', null, null),
('4a5b6c7d-8e9f-4a0b-1c2d-3e4f5a6b7c8d', '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'ar', 'كيفية الطلب والدفع', '...', 'كيفية-الطلب', 'كيفية الطلب', '...', null, null, null),
('5b6c7d8e-9f0a-4b1c-2d3e-4f5a6b7c8d9e', '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f', 'fr', 'Comment Commander', '...', 'comment-commander', null, null, null, null, null);