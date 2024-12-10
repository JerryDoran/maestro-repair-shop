/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from '@/zod-schemas/customer';
import { useAction } from 'next-safe-action/hooks';
import { saveCustomerAction } from '@/actions/save-customer-action';

import { states } from '@/constants/states-array';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/inputs/input-with-label';
import TextareaWithLabel from '@/components/inputs/textarea-with-label';
import SelectWithLabel from '@/components/inputs/select-with-label';
import CheckboxWithLabel from '@/components/inputs/checkbox-with-label';
import { Loader, Loader2 } from 'lucide-react';

type CustomerFormProps = {
  customer?: selectCustomerSchemaType;
};

export default function CustomerForm({ customer }: CustomerFormProps) {
  const { getPermission, isLoading } = useKindeBrowserClient();
  const isManager = !isLoading && getPermission('manager')?.isGranted;

  const { toast } = useToast();

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    firstName: customer?.firstName ?? '',
    lastName: customer?.lastName ?? '',
    address1: customer?.address1 ?? '',
    address2: customer?.address2 ?? '',
    city: customer?.city ?? '',
    state: customer?.state ?? '',
    zip: customer?.zip ?? '',
    phone: customer?.phone ?? '',
    email: customer?.email ?? '',
    notes: customer?.notes ?? '',
    active: customer?.active ?? true,
  };

  const form = useForm<insertCustomerSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  const {
    execute: executeSave,
    result: saveResult,
    isExecuting: isSaving,
    reset: resetSaveAction,
  } = useAction(saveCustomerAction, {
    onSuccess: ({ data }) => {
      toast({
        variant: 'default',
        title: 'Success! 🎉',
        description: data?.message,
      });
    },

    onError: ({ error }) => {
      toast({
        variant: 'destructive',
        title: 'Error 🥲',
        description: 'Something went wrong!',
      });
    },
  });

  async function submitForm(data: insertCustomerSchemaType) {
    executeSave(data); // passes the form data to the server action
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {customer?.id ? 'Edit' : 'New'} Customer{' '}
          {customer?.id ? `#${customer.id}` : 'Form'}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className='flex flex-col md:flex-row gap-4 md:gap-8'
        >
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='First Name'
              nameInSchema='firstName'
            />

            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Last Name'
              nameInSchema='lastName'
            />

            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Address 1'
              nameInSchema='address1'
            />

            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Address 2'
              nameInSchema='address2'
            />

            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='City'
              nameInSchema='city'
            />
            <SelectWithLabel<insertCustomerSchemaType>
              fieldTitle='State'
              nameInSchema='state'
              data={states}
            />
          </div>
          <div className='flex flex-col gap-4 w-full max-w-xs'>
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Zip Code'
              nameInSchema='zip'
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Email'
              nameInSchema='email'
            />
            <InputWithLabel<insertCustomerSchemaType>
              fieldTitle='Phone'
              nameInSchema='phone'
            />
            <TextareaWithLabel<insertCustomerSchemaType>
              fieldTitle='Notes'
              nameInSchema='notes'
              className='h-40'
            />
            {isLoading ? (
              <p>Loading...</p>
            ) : isManager && customer?.id ? (
              <CheckboxWithLabel<insertCustomerSchemaType>
                fieldTitle='Active'
                nameInSchema='active'
                message='Yes'
              />
            ) : null}

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
          </div>
        </form>
        {/* <Button></Button> */}
      </Form>
    </div>
  );
}
