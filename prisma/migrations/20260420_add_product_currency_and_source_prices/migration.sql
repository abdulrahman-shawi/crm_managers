DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProductCurrency') THEN
    CREATE TYPE "ProductCurrency" AS ENUM ('SAR', 'USD');
  END IF;
END $$;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "pricingCurrency" "ProductCurrency" NOT NULL DEFAULT 'SAR';

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "sourcePrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "Product"
ADD COLUMN IF NOT EXISTS "sourcePriceLow" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "Product"
SET
  "sourcePrice" = COALESCE(NULLIF("sourcePrice", 0), "price"),
  "sourcePriceLow" = COALESCE(NULLIF("sourcePriceLow", 0), "priceLow"),
  "pricingCurrency" = COALESCE("pricingCurrency", 'SAR');