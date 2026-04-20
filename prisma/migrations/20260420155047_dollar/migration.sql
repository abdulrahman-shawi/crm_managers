/*
  Warnings:

  - You are about to drop the `checkpoint_blobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoint_migrations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoint_writes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `checkpoints` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `n8n_chat_histories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "Return_exchangedProductId_idx";

-- DropIndex
DROP INDEX "Return_invoiceId_idx";

-- DropIndex
DROP INDEX "Return_returnedProductId_idx";

-- DropTable
DROP TABLE "checkpoint_blobs";

-- DropTable
DROP TABLE "checkpoint_migrations";

-- DropTable
DROP TABLE "checkpoint_writes";

-- DropTable
DROP TABLE "checkpoints";

-- DropTable
DROP TABLE "n8n_chat_histories";
