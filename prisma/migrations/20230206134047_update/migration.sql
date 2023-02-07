/*
  Warnings:

  - You are about to alter the column `price` on the `index` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `mask` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `index` MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `condition` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `mask` MODIFY `price` DECIMAL(10, 2) NOT NULL,
    MODIFY `condition` VARCHAR(191) NOT NULL;
