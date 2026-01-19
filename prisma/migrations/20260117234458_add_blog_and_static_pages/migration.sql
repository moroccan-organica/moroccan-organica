/*
  Warnings:

  - A unique constraint covering the columns `[language,slug]` on the table `CategoryTranslation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[language,slug]` on the table `ProductTranslation` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postalCode` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentProvider` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variantNameSnapshot` on table `OrderItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sizeName` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Address` MODIFY `postalCode` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `paymentProvider` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `variantNameSnapshot` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ProductTranslation` MODIFY `description` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `ProductVariant` MODIFY `sizeName` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `authorName` VARCHAR(191) NULL,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Post_published_idx`(`published`),
    INDEX `Post_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `language` ENUM('en', 'ar', 'fr') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDesc` TEXT NULL,
    `ogImage` VARCHAR(191) NULL,

    INDEX `PostTranslation_postId_idx`(`postId`),
    INDEX `PostTranslation_slug_idx`(`slug`),
    UNIQUE INDEX `PostTranslation_postId_language_key`(`postId`, `language`),
    UNIQUE INDEX `PostTranslation_language_slug_key`(`language`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaticPage` (
    `id` VARCHAR(191) NOT NULL,
    `systemName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StaticPage_systemName_key`(`systemName`),
    INDEX `StaticPage_systemName_idx`(`systemName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StaticPageTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `staticPageId` VARCHAR(191) NOT NULL,
    `language` ENUM('en', 'ar', 'fr') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDesc` TEXT NULL,

    INDEX `StaticPageTranslation_staticPageId_idx`(`staticPageId`),
    INDEX `StaticPageTranslation_slug_idx`(`slug`),
    UNIQUE INDEX `StaticPageTranslation_staticPageId_language_key`(`staticPageId`, `language`),
    UNIQUE INDEX `StaticPageTranslation_language_slug_key`(`language`, `slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CategoryTranslation_language_slug_key` ON `CategoryTranslation`(`language`, `slug`);

-- CreateIndex
CREATE UNIQUE INDEX `ProductTranslation_language_slug_key` ON `ProductTranslation`(`language`, `slug`);

-- AddForeignKey
ALTER TABLE `PostTranslation` ADD CONSTRAINT `PostTranslation_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StaticPageTranslation` ADD CONSTRAINT `StaticPageTranslation_staticPageId_fkey` FOREIGN KEY (`staticPageId`) REFERENCES `StaticPage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
