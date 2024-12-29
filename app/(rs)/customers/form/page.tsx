import BackButton from '@/components/back-button';
import { getCustomer } from '@/lib/queries/get-customer';
import CustomerForm from './_components/customer-form';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId) return { title: 'New Customer' };

  return { title: `Edit customer #${customerId}` };
}

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission('manager');
    const isManager = managerPermission?.isGranted;

    const { customerId } = await searchParams; // will return customerId as a string

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

      // Put customer form component
      return <CustomerForm isManager={isManager} customer={customer} />;
    } else {
      // new customer form component
      return <CustomerForm isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  return <div>page</div>;
}
