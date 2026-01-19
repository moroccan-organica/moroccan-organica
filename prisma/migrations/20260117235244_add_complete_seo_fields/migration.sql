-- AlterTable
ALTER TABLE `CategoryTranslation` ADD COLUMN `canonical` VARCHAR(191) NULL,
    ADD COLUMN `keywords` VARCHAR(191) NULL,
    ADD COLUMN `ogImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `PostTranslation` ADD COLUMN `canonical` VARCHAR(191) NULL,
    ADD COLUMN `keywords` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductTranslation` ADD COLUMN `canonical` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `StaticPageTranslation` ADD COLUMN `canonical` VARCHAR(191) NULL,
    ADD COLUMN `keywords` VARCHAR(191) NULL,
    ADD COLUMN `ogImage` VARCHAR(191) NULL;
