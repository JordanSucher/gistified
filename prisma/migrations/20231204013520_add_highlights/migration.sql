/*
  Warnings:

  - Added the required column `content` to the `Highlight` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Highlight" ADD COLUMN     "content" TEXT NOT NULL;
