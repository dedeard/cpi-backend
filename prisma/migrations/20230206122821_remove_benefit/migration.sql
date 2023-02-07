/*
  Warnings:

  - You are about to drop the column `benefit` on the `index` table. All the data in the column will be lost.
  - You are about to drop the column `benefit` on the `mask` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `index` DROP COLUMN `benefit`;

-- AlterTable
ALTER TABLE `mask` DROP COLUMN `benefit`;
