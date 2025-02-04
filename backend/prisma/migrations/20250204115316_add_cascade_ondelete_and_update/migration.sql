-- DropForeignKey
ALTER TABLE `botType` DROP FOREIGN KEY `botType_userId_fkey`;

-- DropForeignKey
ALTER TABLE `knowledge` DROP FOREIGN KEY `knowledge_botTypeId_fkey`;

-- DropIndex
DROP INDEX `botType_userId_fkey` ON `botType`;

-- DropIndex
DROP INDEX `knowledge_botTypeId_fkey` ON `knowledge`;

-- AddForeignKey
ALTER TABLE `botType` ADD CONSTRAINT `botType_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `knowledge` ADD CONSTRAINT `knowledge_botTypeId_fkey` FOREIGN KEY (`botTypeId`) REFERENCES `botType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
