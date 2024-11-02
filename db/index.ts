import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

// Set up the database connection to neon postgres database
const sql = neon(process.env.DATABASE_URL!);

// logger
// const db = drizzle(sql, {logger: true})
const db = drizzle(sql);

export { db };
