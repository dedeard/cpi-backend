/*
  Warnings:

  - A unique constraint covering the columns `[consumerId]` on the table `Index` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Index_consumerId_key` ON `Index`(`consumerId`);
