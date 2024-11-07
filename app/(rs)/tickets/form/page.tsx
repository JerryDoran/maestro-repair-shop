import BackButton from '@/components/back-button';
import { getCustomer } from '@/lib/queries/get-customer';
import { getTicket } from '@/lib/queries/get-ticket';

export default async function TicketsFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId, ticketId } = await searchParams;

    if (!customerId && !ticketId) {
      return (
        <>
          <h2 className='text-2xl mb-2'>
            Ticket ID or Customer ID required to load ticket form
          </h2>
          <BackButton title='Go Back' variant='default' />
        </>
      );
    }

    // If only customer Id is supplied to the search params then we need to make a new ticket form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
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
      if (!customer.active) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} is not active
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }

      // Return ticket form
      console.log(customer);
    }

    // Edit ticket if a ticketId is supplied to the searchParams
    if (ticketId) {
      const ticket = await getTicket(parseInt(ticketId));

      if (!ticket) {
        return (
          <>
            <h2 className='text-2xl mb-2'>Ticket ID #{ticketId} not found</h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }
      const customer = await getCustomer(ticket.customerId);

      // return ticket form
      console.log('ticket: ', ticket);
      console.log('customer: ', customer);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  return <div>TicketsFormPage</div>;
}
