-- Rename WARZONE to COD_WARZONE for existing records
-- This runs in a separate transaction after the enum values were committed
-- in the previous migration (PostgreSQL requirement).
UPDATE "services" SET "game" = 'COD_WARZONE' WHERE "game" = 'WARZONE';
