/*
  Warnings:

  - You are about to drop the column `accNumber` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `accSubNumber` on the `Transaction` table. All the data in the column will be lost.
  - The values [SPEND,EARN] on the enum `Transaction_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `accountId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountSubId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_ibfk_2`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `accNumber`,
    DROP COLUMN `accSubNumber`,
    ADD COLUMN `accountId` INTEGER NOT NULL,
    ADD COLUMN `accountSubId` INTEGER NOT NULL,
    MODIFY `type` ENUM('SEND', 'RECEIVE', 'EXPENDITURE', 'INCOME') NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD FOREIGN KEY (`accountSubId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
