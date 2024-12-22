import { db } from '@/db';
import { customers } from '@/db/schema';
import { ilike, or, sql } from 'drizzle-orm';

export async function getCustomerSearchResults(searchText: string) {
  const results = await db
    .select()
    .from(customers)
    .where(
      or(
        ilike(customers.email, `%${searchText}%`), // wildcard search
        ilike(customers.phone, `%${searchText}%`), // wildcard search
        ilike(customers.city, `%${searchText}%`), // wildcard search
        ilike(customers.zip, `%${searchText}%`), // wildcard search
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`
      )
    ).orderBy(customers.lastName);

  return results;
}
