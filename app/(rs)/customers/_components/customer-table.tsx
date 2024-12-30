'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { selectCustomerSchemaType } from '@/zod-schemas/customer';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontal, TableOfContents } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CustomerTableProps = {
  data: selectCustomerSchemaType[];
};

export default function CustomerTable({ data }: CustomerTableProps) {
  const router = useRouter();

  const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'zip',
  ];

  const columnHelper = createColumnHelper<selectCustomerSchemaType>();

  const actionsCell = ({
    row,
  }: CellContext<selectCustomerSchemaType, unknown>) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/tickets/form?customerId=${row.original.id}`}
              className='w-full'
              prefetch={false}
            >
              New ticket
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/customers/form?customerId=${row.original.id}`}
              className='w-full'
              prefetch={false}
            >
              Edit customer
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  actionsCell.displayName = 'Actions';

  const columns = [
    ...columnHeadersArray.map((columnName) =>
      columnHelper.accessor(columnName, {
        id: columnName,
        header: columnName[0].toUpperCase() + columnName.slice(1),
      })
    ),
    columnHelper.display({
      id: 'actions',
      header: () => <TableOfContents className='h-6 w-6' />,
      cell: actionsCell,
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='mt-6 rounded-lg overflow-hidden border border-border'>
      <Table className='border'>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`bg-secondary ${
                    header.id === 'actions' ? 'w-12' : ''
                  }`}
                >
                  <div
                    className={`${
                      header.id === 'actions' ? 'flex justify-center' : ''
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className='cursor-pointer hover:bg-muted/50 dark:hover:bg-muted/50'
              data-state={row.getIsSelected() ? 'selected' : ''}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className='border'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableHeader></TableHeader>
      </Table>
    </div>
  );
}
