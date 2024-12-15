import { File, HomeIcon, UsersRound, LogOut } from 'lucide-react';
import Link from 'next/link';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

import { Button } from '@/components/ui/button';
import NavButton from '@/components/nav-button';
import { ModeToggle } from '@/components/mode-toggle';
import NavButtonMenu from '@/components/nav-button-menu';

export default function Header() {
  return (
    <header className='animate-slide bg-background h-12 p-2 px-4 xl:px-0 border-b sticky top-0 z-20'>
      <div className='flex h-8 items-center justify-between w-full'>
        <div className='flex items-center gap-2'>
          <NavButton href='/home' label='Home' icon={HomeIcon} />
          <Link
            href='/home'
            className='flex justify-center items-center gap-2 ml-0'
            title='Home'
          >
            <h1 className='hidden sm:block text-xl font-bold m-0'>
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className='flex items-center'>
          <NavButton href='/tickets' label='Tickets' icon={File} />
          <NavButtonMenu
            label='Customers Menu'
            icon={UsersRound}
            choices={[
              { title: 'Search Customers', href: '/customers' },
              { title: 'NewCustomer', href: '/customers/form' },
            ]}
          />
          <ModeToggle />
          <Button
            variant='ghost'
            size='icon'
            aria-label='Logout'
            title='Logout'
            className='rounded-full'
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
