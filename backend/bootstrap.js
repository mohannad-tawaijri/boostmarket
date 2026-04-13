const { PrismaClient } = require('@prisma/client');

async function bootstrap() {
  const prisma = new PrismaClient();

  try {
    console.log('==> [bootstrap.js] Adding missing columns...');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "showMessagePopups" BOOLEAN NOT NULL DEFAULT true;
    `);
    console.log('    + showMessagePopups column OK');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "allowDirectPurchase" BOOLEAN NOT NULL DEFAULT true;
    `);
    console.log('    + allowDirectPurchase column OK');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "stock" INTEGER;
    `);
    console.log('    + stock column OK');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "googleId" TEXT;
    `);
    console.log('    + googleId column OK');

    await prisma.$executeRawUnsafe(`
      ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'local';
    `);
    console.log('    + authProvider column OK');

    // Update any services using WIN_BOOST to OTHER
    await prisma.$executeRawUnsafe(`
      UPDATE "services" SET "category" = 'OTHER' WHERE "category" = 'WIN_BOOST';
    `);
    console.log('    + migrated WIN_BOOST services to OTHER');

    await prisma.$executeRawUnsafe(`
      DELETE FROM "_prisma_migrations" WHERE "migration_name" = '20260410000000_add_user_service_fields';
    `);
    console.log('    + cleaned stale migration record');

    console.log('==> [bootstrap.js] All done!');
  } catch (err) {
    console.error('==> [bootstrap.js] ERROR:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

bootstrap();
