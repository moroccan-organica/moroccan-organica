-- AlterTable
ALTER TABLE `Product` ADD COLUMN `isTopSale` BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX `Product_isTopSale_idx` ON `Product`(`isTopSale`);
