/*
  Warnings:

  - You are about to drop the column `balance` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Category` DROP COLUMN `balance`,
    ADD COLUMN `budget` INTEGER NOT NULL DEFAULT 0;
