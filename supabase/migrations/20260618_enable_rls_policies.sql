-- Enable Row Level Security on all public tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CategoryTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductVariant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogMedia" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaticPage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaticPageTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSeoSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GlobalSeoTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostTranslation" ENABLE ROW LEVEL SECURITY;

-- Public read access for storefront content (anon / authenticated API roles)
CREATE POLICY "public_read_categories"
  ON "Category" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_category_translations"
  ON "CategoryTranslation" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_products"
  ON "Product" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_product_translations"
  ON "ProductTranslation" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_product_images"
  ON "ProductImage" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_product_variants"
  ON "ProductVariant" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_blog_categories"
  ON "BlogCategory" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_published_blog_posts"
  ON "BlogPost" FOR SELECT TO anon, authenticated USING (status = 'published');

CREATE POLICY "public_read_blog_media"
  ON "BlogMedia" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_static_pages"
  ON "StaticPage" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_static_page_translations"
  ON "StaticPageTranslation" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_seo_settings"
  ON "GlobalSeoSetting" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_seo_translations"
  ON "GlobalSeoTranslation" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_posts"
  ON "Post" FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "public_read_post_translations"
  ON "PostTranslation" FOR SELECT TO anon, authenticated USING (true);

-- Sensitive tables (User, Customer, Address, Order, OrderItem):
-- RLS enabled with no anon/authenticated policies.
-- Server-side code must use the service_role key (bypasses RLS).
