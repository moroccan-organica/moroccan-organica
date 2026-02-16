-- Cleanup existing data in reverse order of dependencies
TRUNCATE TABLE "PostTranslation", "Post", "GlobalSeoTranslation", "GlobalSeoSetting", "BlogMedia", "BlogPost", "BlogCategory", "StaticPageTranslation", "StaticPage", "ProductVariant", "ProductTranslation", "ProductImage", "Product", "CategoryTranslation", "Category", "OrderItem", "Order", "Address", "Customer", "User" CASCADE;
