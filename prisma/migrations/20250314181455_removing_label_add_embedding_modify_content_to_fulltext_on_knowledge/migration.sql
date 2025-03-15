/*
  Warnings:

  - You are about to drop the column `label` on the `knowledge` table. All the data in the column will be lost.
  - Added the required column `embedding` to the `knowledge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `knowledge` DROP COLUMN `label`,
    ADD COLUMN `embedding` JSON NOT NULL,
    MODIFY `content` TEXT NOT NULL;

-- CreateIndex
CREATE FULLTEXT INDEX `knowledge_content_idx` ON `knowledge`(`content`);
