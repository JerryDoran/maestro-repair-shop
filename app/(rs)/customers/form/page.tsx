import BackButton from '@/components/back-button';
import { getCustomer } from '@/lib/queries/get-customer';

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams; // will return customerId as a string
    console.log(customerId);

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId)); // need to convert customerId to a number because it is stored in database that way

      if (!customer) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }
      console.log(customer);
      // Put customer form component
    } else {
      // new customer form component
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  return <div>page</div>;
}
