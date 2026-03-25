DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ReturnType') THEN
    CREATE TYPE "ReturnType" AS ENUM ('REFUND', 'EXCHANGE');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Return" (
  "id" TEXT PRIMARY KEY,
  "type" "ReturnType" NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "exchangedQuantity" INTEGER,
  "priceDifference" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "note" TEXT,
  "invoiceId" TEXT,
  "returnedProductId" INTEGER NOT NULL,
  "exchangedProductId" INTEGER,
  "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "Return" ADD COLUMN IF NOT EXISTS "exchangedQuantity" INTEGER;

CREATE INDEX IF NOT EXISTS "Return_invoiceId_idx" ON "Return"("invoiceId");
CREATE INDEX IF NOT EXISTS "Return_returnedProductId_idx" ON "Return"("returnedProductId");
CREATE INDEX IF NOT EXISTS "Return_exchangedProductId_idx" ON "Return"("exchangedProductId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Return_invoiceId_fkey'
  ) THEN
    ALTER TABLE "Return"
    ADD CONSTRAINT "Return_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Return_returnedProductId_fkey'
  ) THEN
    ALTER TABLE "Return"
    ADD CONSTRAINT "Return_returnedProductId_fkey"
    FOREIGN KEY ("returnedProductId") REFERENCES "Product"("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Return_exchangedProductId_fkey'
  ) THEN
    ALTER TABLE "Return"
    ADD CONSTRAINT "Return_exchangedProductId_fkey"
    FOREIGN KEY ("exchangedProductId") REFERENCES "Product"("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION;
  END IF;
END $$;
