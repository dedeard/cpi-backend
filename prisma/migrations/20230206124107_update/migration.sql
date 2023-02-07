/*
  Warnings:

  - You are about to alter the column `value` on the `weight` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(2,2)`.

*/
-- AlterTable
ALTER TABLE `weight` MODIFY `value` DECIMAL(2, 2) NOT NULL;
