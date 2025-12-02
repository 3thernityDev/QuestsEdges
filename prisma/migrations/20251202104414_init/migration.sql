-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `uuid_mc` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `last_login` DATETIME(3) NULL,
    `total_xp` INTEGER NOT NULL DEFAULT 0,
    `total_points` INTEGER NOT NULL DEFAULT 0,
    `total_challenges_completed` INTEGER NOT NULL DEFAULT 0,
    `skin_url` VARCHAR(255) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_uuid_mc_key`(`uuid_mc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` LONGTEXT NULL,
    `parameters` JSON NULL,

    UNIQUE INDEX `actions_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `creator_id` INTEGER NOT NULL,
    `type` ENUM('hebdo', 'player', 'special') NOT NULL,
    `status` ENUM('pending', 'accepted', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    `title` VARCHAR(100) NOT NULL,
    `description` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `rewardXp` INTEGER NOT NULL DEFAULT 0,
    `rewardPoints` INTEGER NOT NULL DEFAULT 0,
    `rewardItem` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_on_challenges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `challenge_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'accepted', 'completed', 'failed') NOT NULL DEFAULT 'accepted',
    `acceptedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_on_challenges_user_id_challenge_id_key`(`user_id`, `challenge_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `challenge_tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `challenge_id` INTEGER NOT NULL,
    `action_id` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `challenge_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `task_id` INTEGER NOT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `badges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` LONGTEXT NULL,
    `criteria` JSON NOT NULL,

    UNIQUE INDEX `badges_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_badges` (
    `user_id` INTEGER NOT NULL,
    `badge_id` INTEGER NOT NULL,
    `awardedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `badge_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `type` ENUM('new_challenge', 'accepted', 'completed', 'reward', 'badge') NOT NULL,
    `message` LONGTEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `challenges` ADD CONSTRAINT `challenges_creator_id_fkey` FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_on_challenges` ADD CONSTRAINT `users_on_challenges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_on_challenges` ADD CONSTRAINT `users_on_challenges_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenge_tasks` ADD CONSTRAINT `challenge_tasks_challenge_id_fkey` FOREIGN KEY (`challenge_id`) REFERENCES `challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenge_tasks` ADD CONSTRAINT `challenge_tasks_action_id_fkey` FOREIGN KEY (`action_id`) REFERENCES `actions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenge_progress` ADD CONSTRAINT `challenge_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `challenge_progress` ADD CONSTRAINT `challenge_progress_task_id_fkey` FOREIGN KEY (`task_id`) REFERENCES `challenge_tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_badges` ADD CONSTRAINT `user_badges_badge_id_fkey` FOREIGN KEY (`badge_id`) REFERENCES `badges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
