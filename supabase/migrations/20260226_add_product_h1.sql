-- Migration to add h1 column to ProductTranslation
ALTER TABLE "ProductTranslation" ADD COLUMN IF NOT EXISTS "h1" TEXT;

-- Populate h1 with the current name for existing records
UPDATE "ProductTranslation" 
SET "h1" = "name"
WHERE "h1" IS NULL;
