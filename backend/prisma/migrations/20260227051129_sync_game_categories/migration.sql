-- AlterEnum: Add new values to GameCategory
ALTER TYPE "GameCategory" ADD VALUE IF NOT EXISTS 'RAINBOW_SIX';
ALTER TYPE "GameCategory" ADD VALUE IF NOT EXISTS 'COD_WARZONE';

-- Rename WARZONE to COD_WARZONE for existing records
UPDATE "services" SET "game" = 'COD_WARZONE' WHERE "game" = 'WARZONE';

-- Note: PostgreSQL does not support removing enum values easily.
-- The old 'WARZONE' value will remain in the enum type but won't be used.
