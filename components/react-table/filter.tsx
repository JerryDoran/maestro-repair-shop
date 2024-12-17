import { Column } from '@tanstack/react-table';
import DebouncedInput from './debounced-input';

type FilterProps<T> = {
  column: Column<T, unknown>;
};

export default function Filter<T>({ column }: FilterProps<T>) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type='text'
      value={(columnFilterValue ?? '') as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search... (${
        [...column.getFacetedUniqueValues()].filter((arr) => arr[0]).length
      })`}
      className='w-full border shadow rounded bg-card'
    />
  );
}
