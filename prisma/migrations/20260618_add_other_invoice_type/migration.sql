-- AlterEnum
ALTER TYPE "InvoiceType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "productId" DROP NOT NULL;
