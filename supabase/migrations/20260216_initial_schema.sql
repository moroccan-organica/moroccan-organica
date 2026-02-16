-- ENABLE EXTENSION FOR UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DROP EXISTING (IF RE-RUNNING)
DROP TABLE IF EXISTS "PostTranslation" CASCADE;
DROP TABLE IF EXISTS "Post" CASCADE;
DROP TABLE IF EXISTS "GlobalSeoTranslation" CASCADE;
DROP TABLE IF EXISTS "GlobalSeoSetting" CASCADE;
DROP TABLE IF EXISTS "BlogMedia" CASCADE;
DROP TABLE IF EXISTS "BlogPost" CASCADE;
DROP TABLE IF EXISTS "BlogCategory" CASCADE;
DROP TABLE IF EXISTS "StaticPageTranslation" CASCADE;
DROP TABLE IF EXISTS "StaticPage" CASCADE;
DROP TABLE IF EXISTS "ProductVariant" CASCADE;
DROP TABLE IF EXISTS "ProductTranslation" CASCADE;
DROP TABLE IF EXISTS "ProductImage" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "CategoryTranslation" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Address" CASCADE;
DROP TABLE IF EXISTS "Customer" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "LanguageCode";
DROP TYPE IF EXISTS "OrderStatus";
DROP TYPE IF EXISTS "UserRole";

-- 2. CREATE ENUMS
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STAFF');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "LanguageCode" AS ENUM ('en', 'ar', 'fr');

-- 3. CREATE TABLES
CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Customer" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "email" TEXT UNIQUE NOT NULL,
    "phone" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isWholesale" BOOLEAN NOT NULL DEFAULT false,
    "companyName" TEXT,
    "taxId" TEXT,
    "totalSpent" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "lastOrderDate" TIMESTAMP(3),
    "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Address" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "customerId" TEXT NOT NULL REFERENCES "Customer"("id") ON DELETE CASCADE,
    "label" TEXT,
    "addressLine1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Morocco',
    "phone" TEXT
);

CREATE TABLE "Order" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "reference" TEXT UNIQUE NOT NULL,
    "customerId" TEXT NOT NULL REFERENCES "Customer"("id"),
    "shippingAddressId" TEXT NOT NULL REFERENCES "Address"("id"),
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentProvider" TEXT NOT NULL,
    "paymentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Category" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Product" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "categoryId" TEXT NOT NULL REFERENCES "Category"("id"),
    "basePrice" DECIMAL(10,2) NOT NULL,
    "sku" TEXT UNIQUE NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isTopSale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ProductVariant" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "sku" TEXT UNIQUE NOT NULL,
    "sizeName" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "OrderItem" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
    "variantId" TEXT NOT NULL REFERENCES "ProductVariant"("id"),
    "productNameSnapshot" TEXT NOT NULL,
    "variantNameSnapshot" TEXT,
    "priceSnapshot" DECIMAL(10,2) NOT NULL,
    "quantity" INTEGER NOT NULL
);

CREATE TABLE "CategoryTranslation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "categoryId" TEXT NOT NULL REFERENCES "Category"("id") ON DELETE CASCADE,
    "language" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "canonical" TEXT,
    UNIQUE("categoryId", "language"),
    UNIQUE("language", "slug")
);

CREATE TABLE "ProductTranslation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "language" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "canonical" TEXT,
    UNIQUE("productId", "language"),
    UNIQUE("language", "slug")
);

CREATE TABLE "ProductImage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "BlogCategory" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BlogPost" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "slug" TEXT UNIQUE NOT NULL,
    "excerpt" TEXT,
    "excerptAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "featuredImageUrl" TEXT,
    "authorId" TEXT NOT NULL REFERENCES "User"("id"),
    "categoryId" TEXT REFERENCES "BlogCategory"("id") ON DELETE SET NULL,
    "tags" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "readTimeMinutes" INTEGER NOT NULL DEFAULT 5,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "BlogMedia" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "postId" TEXT REFERENCES "BlogPost"("id") ON DELETE SET NULL,
    "mediaType" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "storagePath" TEXT,
    "altText" TEXT,
    "caption" TEXT,
    "fileSizeBytes" INTEGER,
    "mimeType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "StaticPage" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "systemName" TEXT UNIQUE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "StaticPageTranslation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "staticPageId" TEXT NOT NULL REFERENCES "StaticPage"("id") ON DELETE CASCADE,
    "language" "LanguageCode" NOT NULL,
    "h1" TEXT,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "canonical" TEXT,
    UNIQUE("staticPageId", "language"),
    UNIQUE("language", "slug")
);

CREATE TABLE "GlobalSeoSetting" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "ogImage" TEXT,
    "twitterHandle" TEXT,
    "facebookPage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "GlobalSeoTranslation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "globalSeoSettingId" TEXT NOT NULL REFERENCES "GlobalSeoSetting"("id") ON DELETE CASCADE,
    "language" "LanguageCode" NOT NULL,
    "siteName" TEXT,
    "titleSuffix" TEXT,
    "defaultMetaDesc" TEXT,
    "defaultKeywords" TEXT,
    UNIQUE("globalSeoSettingId", "language")
);

CREATE TABLE "Post" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "PostTranslation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "postId" TEXT NOT NULL REFERENCES "Post"("id") ON DELETE CASCADE,
    "language" "LanguageCode" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "slug" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "canonical" TEXT,
    UNIQUE("language", "slug"),
    UNIQUE("postId", "language")
);

-- 4. INDEXES
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Address_customerId_idx" ON "Address"("customerId");
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
CREATE INDEX "Order_status_idx" ON "Order"("status");
CREATE INDEX "Product_sku_idx" ON "Product"("sku");
CREATE INDEX "BlogPost_slug_idx" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "StaticPage_systemName_idx" ON "StaticPage"("systemName");
CREATE INDEX "Post_publishedAt_idx" ON "Post"("publishedAt");
