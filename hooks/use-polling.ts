/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function usePolling(ms: number = 60000, searchParam: string | null) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Interval running');
      if (!searchParam) {
        console.log('Refreshing data');
        router.refresh(); // refetches data
      }
    }, ms);

    return () => clearInterval(interval);
  }, [ms, searchParam]);
}
