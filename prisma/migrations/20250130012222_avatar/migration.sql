/*
  Warnings:

  - You are about to alter the column `avatar` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `avatar` VARCHAR(191) NULL DEFAULT '/avatars/default-avatar.jpg';
