-- GLOBAL SEO
INSERT INTO "GlobalSeoSetting" ("id", "ogImage", "twitterHandle", "facebookPage") VALUES
('seo_global', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80', '@moroccanorganica', 'https://facebook.com/moroccanorganica');

INSERT INTO "GlobalSeoTranslation" ("globalSeoSettingId", "language", "siteName", "titleSuffix", "defaultMetaDesc", "defaultKeywords") VALUES
('seo_global', 'en', 'Moroccan Organica', ' | Argan Oil Wholesale Morocco', 'Buy Moroccan organic beauty products...', 'Argan oil, Argan oil benefits for skin...'),
('seo_global', 'fr', 'Moroccan Organica', ' | Vente en Gros Huile d''Argan', 'Achetez des produits de beauté bio marocains...', 'huile d''argan, gros, bio, maroc...'),
('seo_global', 'ar', 'موروكان أورجانيكا', ' | زيت الأرغان المغربي بالجملة', 'اشترِ شركة مستحضرات التجميل العضوية...', 'زيت الأرغان ، فوائد زيت الأرغان للبشرة...');

-- STATIC PAGES (BLOG, SHOP, PRODUCTS, HOME, ABOUT_US, CONTACT, PRIVACY_POLICY, DELIVERY_INFO, TERMS_CONDITIONS, PRIVATE_LABEL, HOW_TO_ORDER, etc.)
INSERT INTO "StaticPage" ("id", "systemName") VALUES
('page_blog', 'BLOG'),
('page_shop', 'SHOP'),
('page_products', 'PRODUCTS'),
('page_home', 'HOME'),
('page_about', 'ABOUT_US'),
('page_contact', 'CONTACT');

INSERT INTO "StaticPageTranslation" ("staticPageId", "language", "h1", "slug", "metaTitle", "metaDesc") VALUES
('page_blog', 'en', 'Our Blog', 'blog', 'Our Blog - Organic Beauty Tips...', 'Stay updated with our blog...'),
('page_blog', 'ar', 'مدونتنا', 'المدونة', 'مدونتنا - نصائح وأخبار الجمال...', 'ابق على تواصل مع مدونتنا...'),
('page_blog', 'fr', 'Notre Blog', 'blog', 'Notre Blog - Conseils de Beauté...', 'Restez informé avec notre blog...'),

('page_shop', 'en', 'Our Shop', 'shop', 'Shop Moroccan Organica - Premium...', 'Explore our range...'),
('page_shop', 'ar', 'متجرنا', 'المتجر', 'متجر مغربية أورجانيكا - مستحضرات...', 'اكتشف مجموعتنا...'),
('page_shop', 'fr', 'Notre Boutique', 'boutique', 'Boutique Moroccan Organica - Cosmétiques...', 'Découvrez notre gamme...');

-- (And so on for other pages if needed, abbreviated here for clarity)
