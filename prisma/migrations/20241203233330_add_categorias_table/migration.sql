/*
  Warnings:

  - You are about to drop the column `categoria` on the `canciones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `canciones` DROP COLUMN `categoria`,
    ADD COLUMN `categoriaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `usuario` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `categorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `canciones` ADD CONSTRAINT `canciones_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `usuario` TO `user`;
