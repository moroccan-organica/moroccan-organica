-- Add French translation columns to BlogPost table
ALTER TABLE "BlogPost" 
ADD COLUMN "titleFr" TEXT,
ADD COLUMN "excerptFr" TEXT,
ADD COLUMN "contentFr" TEXT;
