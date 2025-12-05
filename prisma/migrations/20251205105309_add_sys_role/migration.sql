-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'admin', 'moderator', 'sys') NOT NULL DEFAULT 'user';
