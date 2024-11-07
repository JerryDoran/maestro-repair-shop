'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ButtonHTMLAttributes } from 'react';

type BackButtonProps = {
  title: string;
  className?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function BackButton({
  title,
  className,
  variant,
  ...props
}: BackButtonProps) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      className={className}
      onClick={() => router.back()}
      {...props}
    >
      {title}
    </Button>
  );
}
