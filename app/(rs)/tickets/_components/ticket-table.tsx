'use client';

import type { TicketSearchResultsType } from '@/lib/queries/get-tickets-search-results';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CircleCheckIcon, CircleXIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TicketTableProps = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketTable({ data }: TicketTableProps) {
  const router = useRouter();

  const columnHeadersArray: Array<keyof RowType> = [
    'ticketDate',
    'title',
    'tech',
    'firstName',
    'lastName',
    'email',
    'completed',
  ];

  const columnHelper = createColumnHelper<RowType>();

  const columns = columnHeadersArray.map((columnName) =>
    columnHelper.accessor(
      (row) => {
        //transform the data you want
        const value = row[columnName];
        if (columnName === 'ticketDate' && value instanceof Date) {
          return value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        }
        if (columnName === 'completed') {
          return value ? 'COMPLETED' : 'OPEN';
        }
        return value;
      },
      {
        id: columnName,
        header: columnName[0].toUpperCase() + columnName.slice(1),
        cell: ({ getValue }) => {
          // presentational logic
          const value = getValue();
          if (columnName === 'completed') {
            return (
              <div className='grid place-content-center'>
                {value === 'OPEN' ? (
                  <CircleXIcon className='opacity-25' />
                ) : (
                  <CircleCheckIcon className='text-green-600' />
                )}
              </div>
            );
          }
          return value;
        },
      }
    )
  );

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
                <TableHead key={header.id} className='bg-secondary'>
                  <div>
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
              onClick={() => {
                router.push(`/tickets/form?ticketId=${row.original.id}`);
              }}
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
