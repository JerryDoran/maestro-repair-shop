/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/inputs/input-with-label';
import TextareaWithLabel from '@/components/inputs/textarea-with-label';
import SelectWithLabel from '@/components/inputs/select-with-label';
import CheckboxWithLabel from '@/components/inputs/checkbox-with-label';
import { useToast } from '@/hooks/use-toast';
import { useAction } from 'next-safe-action/hooks';
import { saveTicketAction } from '@/actions/save-ticket-action';
import { Loader2 } from 'lucide-react';
import DisplayServerActionResponse from '@/components/display-server-action-response';

import {
  insertTicketSchema,
  type insertTicketSchemaType,
  type selectTicketSchemaType,
} from '@/zod-schemas/ticket';
import { selectCustomerSchemaType } from '@/zod-schemas/customer';

type TicketFormProps = {
  customer: selectCustomerSchemaType;
  ticket?: selectTicketSchemaType;
  techs?: {
    id: string;
    description: string;
  }[];
  isEditable?: boolean;
};

export default function TicketForm({
  customer,
  ticket,
  techs,
  isEditable = true,
}: TicketFormProps) {
  const isManager = Array.isArray(techs);

  const { toast } = useToast();

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

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveTicketAction, {
    onSuccess: ({ data }) => {
      if (data?.message) {
        toast({
          variant: 'default',
          title: 'Success! 🎉',
          description: data?.message,
        });
      }
    },

    onError: ({ error }) => {
      toast({
        variant: 'destructive',
        title: 'Error 🥲',
        description: 'Something went wrong!',
      });
    },
  });

  async function submitForm(data: insertTicketSchemaType) {
    executeSave(data);
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <DisplayServerActionResponse result={saveResult} />
      <div>
        <h2 className='text-2xl font-bold'>
          {ticket?.id && isEditable
            ? `Edit Ticket # ${ticket?.id}`
            : ticket?.id
            ? `View Ticket # ${ticket?.id}`
            : 'New Ticket Form'}
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
              disabled={!isEditable}
            />
            {isManager ? (
              <SelectWithLabel<insertTicketSchemaType>
                fieldTitle='Tech ID'
                nameInSchema='tech'
                data={[
                  {
                    id: 'new-ticket@example.com',
                    description: 'new-ticket@example.com',
                  },
                  ...techs,
                ]}
              />
            ) : (
              <InputWithLabel<insertTicketSchemaType>
                fieldTitle='Tech'
                nameInSchema='tech'
                disabled={true}
              />
            )}

            {ticket?.id ? (
              <CheckboxWithLabel<insertTicketSchemaType>
                fieldTitle='Completed'
                nameInSchema='completed'
                message='Yes'
                disabled={!isEditable}
              />
            ) : null}

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
              disabled={!isEditable}
            />
            {isEditable ? (
              <div className='flex gap-2'>
                <Button
                  type='submit'
                  className='w-3/4'
                  variant='default'
                  title='Save'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className='mr-2 size-4 animate-spin' /> Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  title='Reset'
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </div>
        </form>
        {/* <Button></Button> */}
      </Form>
    </div>
  );
}
