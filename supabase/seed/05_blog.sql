-- BLOG POSTS (Post Table)

INSERT INTO "Post" ("id", "published", "authorName", "publishedAt") VALUES
('blog_01', true, 'Admin User', '2025-01-15 00:00:00'),
('blog_02', true, 'Admin User', '2025-01-10 00:00:00');

INSERT INTO "PostTranslation" ("postId", "language", "title", "slug", "content", "metaTitle", "metaDesc", "ogImage") VALUES
('blog_01', 'en', 'The Benefits of Moroccan Argan Oil', 'benefits-moroccan-argan-oil', 'Moroccan argan oil has been used for centuries...', 'The Amazing Benefits of Moroccan Argan Oil | Moroccan Organica', 'Discover the incredible beauty and health benefits...', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80'),
('blog_01', 'ar', 'فوائد زيت الأركان المغربي', 'فوائد-زيت-الأركان-المغربي', 'يستخدم زيت الأركان المغربي منذ قرون...', 'فوائد زيت الأركان المغربي المذهلة', 'اكتشف الفوائد الجمالية والصحية المذهلة لزيت الأركان المغربي الأصيل...', NULL),
('blog_01', 'fr', 'Les Bienfaits de l''Huile d''Argan Marocaine', 'bienfaits-huile-argan-marocaine', 'L''huile d''argan marocaine est utilisée depuis des siècles...', 'Les Bienfaits Incroyables de l''Huile d''Argan Marocaine', 'Découvrez les incroyables bienfaits beauté et santé de l''huile d''argan marocaine authentique...', NULL),

('blog_02', 'en', 'Traditional Moroccan Spices: A Culinary Journey', 'traditional-moroccan-spices', 'Moroccan cuisine is renowned worldwide...', 'Traditional Moroccan Spices Guide | Moroccan Organica', 'Explore the world of traditional Moroccan spices...', NULL),
('blog_02', 'ar', 'التوابل المغربية التقليدية: رحلة طهوية', 'التوابل-المغربية-التقليدية', 'يشتهر المطبخ المغربي في جميع أنحاء العالم بنكهاته الغنية وتوابله العطرية.', NULL, NULL, NULL),
('blog_02', 'fr', 'Épices Marocaines Traditionnelles: Un Voyage Culinaire', 'epices-marocaines-traditionnelles', 'La cuisine marocaine est réputée dans le monde entier pour ses saveurs riches et ses épices aromatiques.', NULL, NULL, NULL);
