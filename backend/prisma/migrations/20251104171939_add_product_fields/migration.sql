/*
  Warnings:

  - Added the required column `category` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `best_selling` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `category` ENUM('BELTS', 'BUCKLE', 'ACCESSORIES') NOT NULL,
    ADD COLUMN `characteristics` JSON NULL,
    ADD COLUMN `description_complete` VARCHAR(191) NULL,
    ADD COLUMN `images` JSON NULL,
    ADD COLUMN `in_promotion` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `new` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `promotional_price` DECIMAL(10, 2) NULL,
    ADD COLUMN `stock` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `typeBelt` ENUM('CLASSIC', 'CASUAL', 'EXECUTIVE', 'SPORTY', 'SOCIAL') NULL;
