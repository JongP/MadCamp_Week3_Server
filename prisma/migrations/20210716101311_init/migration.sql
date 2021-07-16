/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Account.name_unique` ON `Account`;

-- CreateIndex
CREATE UNIQUE INDEX `Account.name_userId_unique` ON `Account`(`name`, `userId`);
