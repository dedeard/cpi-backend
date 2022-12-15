/*
  Warnings:

  - A unique constraint covering the columns `[target]` on the table `Weight` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Weight_target_key` ON `Weight`(`target`);
