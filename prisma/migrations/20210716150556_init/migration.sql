-- AlterTable
ALTER TABLE `Account` ADD COLUMN `version` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Transaction` MODIFY `accountSubId` INTEGER;
