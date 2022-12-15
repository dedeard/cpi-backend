-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consumer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mask` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `owner` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `condition` INTEGER NOT NULL,
    `benefit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `target` VARCHAR(191) NOT NULL,
    `value` DECIMAL(65, 30) NOT NULL,
    `tren` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CPI` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `consumerId` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `condition` INTEGER NOT NULL,
    `benefit` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CPI` ADD CONSTRAINT `CPI_consumerId_fkey` FOREIGN KEY (`consumerId`) REFERENCES `Consumer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
