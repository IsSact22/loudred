-- AlterTable
ALTER TABLE `users` MODIFY `usuario` VARCHAR(255) NOT NULL;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `usuario` TO `user`;
