-- Migration to add details column to ProductTranslation
ALTER TABLE "ProductTranslation" ADD COLUMN "details" TEXT;
