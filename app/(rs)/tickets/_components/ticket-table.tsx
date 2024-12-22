'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePolling } from '@/hooks/use-polling';
import type { TicketSearchResultsType } from '@/lib/queries/get-tickets-search-results';

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
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
  CircleCheckIcon,
  CircleXIcon,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Filter from '@/components/react-table/filter';

type TicketTableProps = {
  data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketTable({ data }: TicketTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'ticketDate', desc: false },
  ]);
  const router = useRouter();
  const searchParams = useSearchParams();

  usePolling(300000, searchParams.get('searchText'));

  const pageIndex = useMemo(() => {
    const page = searchParams.get('page');
    return page ? parseInt(page) - 1 : 0;
  }, [searchParams]);

  const columnHeadersArray: Array<keyof RowType> = [
    'ticketDate',
    'title',
    'tech',
    'firstName',
    'lastName',
    'email',
    'completed',
  ];

  const columnWidths = {
    ticketDate: 150,
    title: 250,
    tech: 225,
    email: 225,
    completed: 150,
  };

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
        size:
          columnWidths[columnName as keyof typeof columnWidths] ?? undefined,
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              className='pl-1 w-full flex justify-between'
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              {columnName[0].toUpperCase() + columnName.slice(1)}
              {column.getIsSorted() === 'asc' && (
                <ArrowUp className='ml-2 h-4 w-4' />
              )}
              {column.getIsSorted() === 'desc' && (
                <ArrowDown className='ml-2 h-4 w-4' />
              )}

              {column.getIsSorted() !== 'desc' &&
                column.getIsSorted() !== 'asc' && (
                  <ArrowUpDown className='ml-2 h-4 w-4' />
                )}
            </Button>
          );
        },
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
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },

    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='mt-6 flex flex-col gap-4'>
      <div className='rounded-lg overflow-hidden border border-border'>
        <Table className='border'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className='bg-secondary p-1'
                    style={{ width: header.getSize() }}
                  >
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </div>
                    {header.column.getCanFilter() ? (
                      <div className='grid place-content-center'>
                        <Filter
                          column={header.column}
                          filteredRows={table
                            .getFilteredRowModel()
                            .rows.map((row) => row.getValue(header.column.id))}
                        />
                      </div>
                    ) : null}
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
        </Table>
      </div>
      <div className='flex items-center justify-between gap-1 flex-wrap'>
        <div>
          <p className='whitespace-nowrap font-bold text-sm'>
            {`Page ${
              table.getState().pagination.pageIndex + 1
            } of ${table.getPageCount()}`}
            &nbsp;&nbsp;
            {`[${table.getFilteredRowModel().rows.length} ${
              table.getFilteredRowModel().rows.length !== 1
                ? 'total results'
                : 'result'
            }]`}
          </p>
        </div>
        <div className='flex flex-row gap-1'>
          <div className='flex flex-row gap-1'>
            <Button variant='outline' onClick={() => router.refresh()}>
              Refresh Data
            </Button>
            <Button variant='outline' onClick={() => table.resetSorting()}>
              Reset Sorting
            </Button>
            <Button
              variant='outline'
              onClick={() => table.resetColumnFilters()}
            >
              Reset Filters
            </Button>
          </div>
          <div className='flex flex-row gap-1'>
            <Button
              variant='outline'
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex - 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                const newIndex = table.getState().pagination.pageIndex + 1;
                table.setPageIndex(newIndex);
                const params = new URLSearchParams(searchParams.toString());
                params.set('page', (newIndex + 1).toString());
                router.replace(`?${params.toString()}`, { scroll: false });
              }}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}