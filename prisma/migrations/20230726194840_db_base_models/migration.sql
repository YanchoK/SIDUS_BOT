/*
  Warnings:

  - You are about to drop the column `message` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `remindAt` on the `task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bot_id]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chatUrl_id]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `recurring` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `message`,
    DROP COLUMN `remindAt`,
    ADD COLUMN `bot_id` INTEGER NULL DEFAULT 0,
    ADD COLUMN `chatUrl_id` INTEGER NULL,
    ADD COLUMN `content` TEXT NOT NULL,
    ADD COLUMN `remindTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `sent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `user_id` INTEGER NULL,
    MODIFY `recurring` VARCHAR(50) NOT NULL DEFAULT 'Does not repeat';

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(25) NOT NULL,
    `lastName` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatUrl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NOT NULL,
    `url` VARCHAR(100) NOT NULL,
    `user_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `name` VARCHAR(25) NOT NULL,
    `cookies` JSON NULL,
    `user_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Task_bot_id_key` ON `Task`(`bot_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Task_chatUrl_id_key` ON `Task`(`chatUrl_id`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `fk_task_user` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `fk_task_bot` FOREIGN KEY (`bot_id`) REFERENCES `Bot`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `fk_task_chatUrl` FOREIGN KEY (`chatUrl_id`) REFERENCES `ChatUrl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatUrl` ADD CONSTRAINT `fk_chatUrl_user` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Bot` ADD CONSTRAINT `fk_bot_user` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
