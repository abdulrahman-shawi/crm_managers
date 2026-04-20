ALTER TABLE "GeneralSettings"
ADD COLUMN IF NOT EXISTS "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1;

ALTER TABLE "GeneralSettings"
ALTER COLUMN "currency" SET DEFAULT 'SAR';

UPDATE "GeneralSettings"
SET "currency" = 'SAR'
WHERE "id" = 1
  AND ("currency" IS NULL OR "currency" = 'EUR');