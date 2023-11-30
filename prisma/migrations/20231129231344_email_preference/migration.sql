-- CreateEnum
CREATE TYPE "EmailPreference" AS ENUM ('never', 'daily', 'weekly');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailPreference" "EmailPreference" NOT NULL DEFAULT 'never';
