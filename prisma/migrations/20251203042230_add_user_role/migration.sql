-- AlterTable
ALTER TABLE `users` ADD COLUMN `role` ENUM('user', 'admin', 'moderator') NOT NULL DEFAULT 'user';
