/*
  Warnings:

  - You are about to drop the `cpi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cpi` DROP FOREIGN KEY `CPI_consumerId_fkey`;

-- DropTable
DROP TABLE `cpi`;

-- CreateTable
CREATE TABLE `Index` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumerId` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `condition` INTEGER NOT NULL,
    `benefit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Index` ADD CONSTRAINT `Index_consumerId_fkey` FOREIGN KEY (`consumerId`) REFERENCES `Consumer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
