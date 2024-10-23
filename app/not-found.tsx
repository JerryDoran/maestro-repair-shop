import Image from 'next/image';

export const metaData = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className='px-2 w-full'>
      <div className='flex flex-col justify-center items-center mx-auto gap-4 h-screen'>
        <h2 className='text-2xl font-bold'>Page Not Found!</h2>
        <Image
          src='/images/not-found.png'
          alt='Page not found'
          width={300}
          height={300}
          sizes='300px'
          className='rounded-xl m-0'
          priority={true}
          title='Page Not Found'
        />
      </div>
    </div>
  );
}
