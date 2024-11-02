// used as a dev tool
import { db } from './index';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: './db/migrations',
    });
    console.log('Migration completed');
  } catch (error) {
    console.error('[MIGRATION ERROR]: ', error);
    process.exit(1);
  }
}

main();
