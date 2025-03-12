/*
  Warnings:

  - You are about to alter the column `name` on the `agent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `label` on the `knowledge` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `agent` MODIFY `name` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `knowledge` MODIFY `label` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `username` VARCHAR(50) NULL;
