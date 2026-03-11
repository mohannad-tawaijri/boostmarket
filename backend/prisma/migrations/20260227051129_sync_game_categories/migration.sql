-- AlterEnum: Add new values to GameCategory
ALTER TYPE "GameCategory" ADD VALUE IF NOT EXISTS 'RAINBOW_SIX';
ALTER TYPE "GameCategory" ADD VALUE IF NOT EXISTS 'COD_WARZONE';

-- Note: PostgreSQL does not support removing enum values easily.
-- The old 'WARZONE' value will remain in the enum type but won't be used.
-- The UPDATE to rename WARZONE → COD_WARZONE is in the next migration
-- because PostgreSQL cannot use new enum values in the same transaction.
