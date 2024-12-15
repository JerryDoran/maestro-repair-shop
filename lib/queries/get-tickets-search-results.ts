import { db } from '@/db';
import { tickets, customers } from '@/db/schema';
import { ilike, or, eq, sql, asc } from 'drizzle-orm';

export async function getTicketSearchResults(searchText: string) {
  const results = await db
    .select({
      id: tickets.id,
      ticketDate: tickets.createdAt,
      title: tickets.title,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      tech: tickets.tech,
      completed: tickets.completed,
    })
    .from(tickets)
    .leftJoin(customers, eq(tickets.customerId, customers.id))
    .where(
      or(
        ilike(tickets.title, `%${searchText}%`), // wildcard search
        ilike(tickets.tech, `%${searchText}%`), // wildcard search
        ilike(customers.email, `%${searchText}%`), // wildcard search
        ilike(customers.phone, `%${searchText}%`), // wildcard search
        ilike(customers.city, `%${searchText}%`), // wildcard search
        ilike(customers.zip, `%${searchText}%`), // wildcard search
        sql`lower(concat(${customers.firstName}, ' ', ${
          customers.lastName
        })) LIKE ${`%${searchText.toLowerCase().replace(' ', '%')}%`}`
      )
    )
    .orderBy(asc(tickets.createdAt));

  return results;
}

// Create the type for the drizzle query
export type TicketSearchResultsType = Awaited<
  ReturnType<typeof getTicketSearchResults>
>;