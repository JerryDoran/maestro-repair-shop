import BackButton from '@/components/back-button';
import { getCustomer } from '@/lib/queries/get-customer';
import { getTicket } from '@/lib/queries/get-ticket';
import TicketForm from './_components/ticket-form';

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
      return <TicketForm customer={customer} />;
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
      console.log('TICKET: ', ticket);
      console.log('CUSTOMER: ', customer);
      return <TicketForm customer={customer} ticket={ticket} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  return <div>TicketsFormPage</div>;
}
