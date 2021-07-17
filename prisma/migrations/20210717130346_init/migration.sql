/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Account.userId_name_unique` ON `Account`(`userId`, `name`);
