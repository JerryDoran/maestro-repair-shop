import BackButton from '@/components/back-button';
import { getCustomer } from '@/lib/queries/get-customer';
import { getTicket } from '@/lib/queries/get-ticket';
import TicketForm from './_components/ticket-form';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init as kindeInit } from '@kinde/management-api-js';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId, ticketId } = await searchParams;

  if (!customerId && !ticketId) {
    return {
      title: 'Missing Ticket ID or Customer ID',
    };
  }

  if (customerId) {
    return {
      title: `New ticket for Customer #${customerId}`,
    };
  }

  if (ticketId) {
    return {
      title: `Edit Ticket # ${ticketId}`,
    };
  }
}

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

    const { getPermission, getUser } = getKindeServerSession();
    const [managerPermission, user] = await Promise.all([
      getPermission('manager'),
      getUser(),
    ]);

    const isManager = managerPermission?.isGranted;

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
      if (isManager) {
        kindeInit(); // initializes the kinde management api
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({
              id: user.email!,
              description: user.email!,
            }))
          : [];
        return <TicketForm customer={customer} techs={techs} />;
      } else {
        return <TicketForm customer={customer} />;
      }
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
      if (isManager) {
        kindeInit(); // initializes the kinde management api
        const { users } = await Users.getUsers();

        const techs = users
          ? users.map((user) => ({
              id: user.email!,
              description: user.email!,
            }))
          : [];
        return <TicketForm customer={customer} ticket={ticket} techs={techs} />;
      } else {
        const isEditable =
          user.email?.toLowerCase() === ticket.tech.toLowerCase();
        return (
          <TicketForm
            customer={customer}
            ticket={ticket}
            isEditable={isEditable}
          />
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
  return <div>TicketsFormPage</div>;
}
