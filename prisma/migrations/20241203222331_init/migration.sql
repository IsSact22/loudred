-- AlterTable
ALTER TABLE `users` MODIFY `usuario` VARCHAR(255) NOT NULL;

-- RedefineIndex
CREATE UNIQUE INDEX `user` ON `users`(`usuario`);
DROP INDEX `usuario` ON `users`;
