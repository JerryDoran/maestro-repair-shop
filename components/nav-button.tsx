import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type NavButtonProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  className?: string;
};

export default function NavButton({
  icon: Icon,
  label,
  href,
  //localhost:3000/home
  http: className,
}: NavButtonProps) {
  return (
    <Button
      variant='ghost'
      size='icon'
      aria-label={label}
      title={label}
      className='rounded-full p-0'
      asChild
    >
      {href ? (
        <Link href={href}>
          <Icon className={className} />
        </Link>
      ) : (
        <Icon className={className} />
      )}
    </Button>
  );
}
