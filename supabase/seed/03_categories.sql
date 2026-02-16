-- Categories
INSERT INTO "Category" ("id", "image") VALUES
('cat_argan', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'),
('cat_essential', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'),
('cat_spices', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80'),
('cat_powders', 'https://images.unsplash.com/photo-1596040033229-a0b4c8af6c10?w=800&q=80');

-- Category Translations
INSERT INTO "CategoryTranslation" ("categoryId", "language", "name", "slug", "metaTitle", "metaDesc") VALUES
('cat_argan', 'en', 'Argan Oil', 'argan-oil', 'Pure Moroccan Argan Oil', 'Discover our premium selection of authentic Moroccan argan oil'),
('cat_argan', 'ar', 'زيت الأركان', 'زيت-الأركان', 'زيت الأركان المغربي النقي', 'اكتشف مجموعتنا المتميزة من زيت الأركان المغربي الأصيل'),
('cat_argan', 'fr', 'Huile d''Argan', 'huile-argan', 'Huile d''Argan Marocaine Pure', 'Découvrez notre sélection premium d''huile d''argan marocaine authentique'),

('cat_essential', 'en', 'Essential Oils', 'essential-oils', 'Moroccan Essential Oils', 'Organic essential oils from Morocco'),
('cat_essential', 'ar', 'الزيوت الأساسية', 'الزيوت-الأساسية', 'الزيوت الأساسية المغربية', 'زيوت أساسية عضوية من المغرب'),
('cat_essential', 'fr', 'Huiles Essentielles', 'huiles-essentielles', 'Huiles Essentielles Marocaines', 'Huiles essentielles biologiques du Maroc'),

('cat_spices', 'en', 'Spices', 'spices', 'Authentic Moroccan Spices', 'Traditional Moroccan spices and blends'),
('cat_spices', 'ar', 'التوابل', 'التوابل', 'التوابل المغربية الأصيلة', 'التوابل والخلطات المغربية التقليدية'),
('cat_spices', 'fr', 'Épices', 'epices', 'Épices Marocaines Authentiques', 'Épices et mélanges marocains traditionnels'),

('cat_powders', 'en', 'Powders & Herbs', 'powders-herbs', 'Moroccan Organic Powders & Herbs', 'Authentic Moroccan beauty powders including Nila, Aker Fassi, and Sidr.'),
('cat_powders', 'ar', 'البودرة والأعشاب', 'بودرة-وأعشاب', 'بودرة وأعشاب مغربية عضوية', 'مساحيق التجميل المغربية الأصيلة بما في ذلك النيلة والعكر الفاسي والسدر.'),
('cat_powders', 'fr', 'Poudres & Herbes', 'poudres-herbes', 'Poudres et Herbes Bio du Maroc', 'Poudres de beauté marocaines authentiques : Nila, Aker Fassi, Sidr.');
