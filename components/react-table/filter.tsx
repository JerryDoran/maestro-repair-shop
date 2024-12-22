import { Column } from '@tanstack/react-table';
import DebouncedInput from './debounced-input';

type FilterProps<T> = {
  column: Column<T, unknown>;
  filteredRows: string[];
};

export default function Filter<T>({ column, filteredRows }: FilterProps<T>) {
  const columnFilterValue = column.getFilterValue();

  const uniqueFilterdValues = new Set(filteredRows);

  const sortedUniqueValues = [...uniqueFilterdValues].sort();

  return (
    <>
      <datalist id={column.id + '-list'}>
        {sortedUniqueValues.map((value, index) => (
          <option key={`${index}-${column.id}`} value={value}>
            {value}
          </option>
        ))}
      </datalist>
      <DebouncedInput
        type='text'
        value={(columnFilterValue ?? '') as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${uniqueFilterdValues.size})`}
        className='w-full border shadow rounded bg-card'
        list={column.id + '-list'}
      />
    </>
  );
}
