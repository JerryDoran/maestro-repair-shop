'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/inputs/input-with-label';
import TextareaWithLabel from '@/components/inputs/textarea-with-label';
import SelectWithLabel from '@/components/inputs/select-with-label';
import CheckboxWithLabel from '@/components/inputs/checkbox-with-label';

import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType,
} from '@/zod-schemas/ticket';
import { selectCustomerSchemaType } from '@/zod-schemas/customer';

type TicketFormProps = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
};

export default function TicketForm({ customer, ticket }: TicketFormProps) {
  const defaultValues: insertTicketSchemaType = {
    id: ticket?.id ?? '(New)',
    customerId: ticket?.customerId ?? customer.id,
    title: ticket?.title ?? '',
    description: ticket?.description ?? '',
    completed: ticket?.completed ?? false,
    tech: ticket?.tech ?? 'new-ticket@example.com',
  };

  const form = useForm<insertTicketSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertTicketSchema),
    defaultValues,
  });

  async function submitForm(data: insertTicketSchemaType) {
    console.log(data);
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id ? 'Edit' : 'New'} Ticket{' '}
          {ticket?.id ? `# ${ticket.id}` : 'Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='flex flex-col md:flex-row gap-4 md:gap-8'
        >
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle='Title'
              nameInSchema='title'
            />
            <InputWithLabel<insertTicketSchemaType>
              fieldTitle='Tech'
              nameInSchema='tech'
              disabled
            />
            <CheckboxWithLabel<insertTicketSchemaType>
              fieldTitle='Completed'
              nameInSchema='completed'
              message='Yes'
            />
            <div className='my-8 space-y-1 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md'>
              <h3 className='text-lg'>Customer Info</h3>
              <hr className='w-4/5' />
              <p className='text-sm'>
                {customer.firstName} {customer.lastName}
              </p>
              <p className='text-sm'>{customer.address1}</p>
              {customer.address2 ? <p>{customer.address2}</p> : null}
              <p className='text-sm'>
                {customer.city}, {customer.state} {customer.zip}
              </p>
              <hr className='w-4/5' />
              <p className='text-sm'>{customer.email}</p>
              <p className='text-sm'>{customer.phone}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <TextareaWithLabel<insertTicketSchemaType>
              fieldTitle='Description'
              nameInSchema='description'
              className='h-96'
            />
            <div className='flex gap-2'>
              <Button
                type='submit'
                className='w-3/4'
                variant='default'
                title='Save'
              >
                Save
              </Button>
              <Button
                type='button'
                variant='destructive'
                title='Reset'
                onClick={() => form.reset(defaultValues)}
              >
                Reset
              </Button>
            </div>
          </div>
        </form>
        {/* <Button></Button> */}
      </Form>
    </div>
  );
}
