import { Metadata } from 'next';
import CustomerSearch from './_components/customer-search';
import { getCustomerSearchResults } from '@/lib/queries/get-customer-search-results';
import CustomerTable from './_components/customer-table';

export const metaData: Metadata = {
  title: 'Customer Search',
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    return <CustomerSearch />;
  }

  const results = await getCustomerSearchResults(searchText);

  return (
    <div className='space-y-4'>
      <CustomerSearch />
      {results.length > 0 ? (
        <CustomerTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </div>
  );
}
