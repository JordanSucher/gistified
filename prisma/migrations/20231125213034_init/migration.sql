-- CreateEnum
CREATE TYPE "SummaryStatus" AS ENUM ('processing', 'published');

-- AlterTable
ALTER TABLE "Summary" ADD COLUMN     "status" "SummaryStatus" NOT NULL DEFAULT 'processing';
