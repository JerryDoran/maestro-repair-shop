import { Metadata } from 'next';
import TicketSearch from './_components/ticket-search';
import { getTicketSearchResults } from '@/lib/queries/get-tickets-search-results';
import { getOpenTickets } from '@/lib/queries/get-open-tickets';
import TicketTable from './_components/ticket-table';

export const metaData: Metadata = {
  title: 'Tickets Search',
};

export default async function TicketsFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    const results = await getOpenTickets();
    return (
      <>
        <TicketSearch />
        {results.length > 0 ? (
          <TicketTable data={results} />
        ) : (
          <p className='mt-4'>No open tickets found</p>
        )}
      </>
    );
  }

  const results = await getTicketSearchResults(searchText);

  return (
    <div className='space-y-4'>
      <TicketSearch />
      {results.length > 0 ? (
        <TicketTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </div>
  );
}
