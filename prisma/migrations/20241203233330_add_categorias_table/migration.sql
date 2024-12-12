/*
  Warnings:

  - You are about to drop the column `categoria` on the `Songs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Songs` DROP COLUMN `categories`,
    ADD COLUMN `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `username` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Songs` ADD CONSTRAINT `Songs_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `username` TO `user`;
