'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/inputs/input-with-label';

import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from '@/zod-schemas/customer';

type CustomerFormProps = {
  customer?: selectCustomerSchemaType;
};

export default function CustomerForm({ customer }: CustomerFormProps) {
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
  };

  const form = useForm<insertCustomerSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  async function submitForm(data: insertCustomerSchemaType) {
    console.log(data);
  }

  return (
    <div className='flex flex-col gap-1 sm:px-8'>
      <div>
        <h2 className='text-2xl font-bold'>
          {customer?.id ? 'Edit' : 'New'} Customer Form
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
          </div>
          <p>{JSON.stringify(form.getValues())}</p>
        </form>
        {/* <Button></Button> */}
      </Form>
    </div>
  );
}
