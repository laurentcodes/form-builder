'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className='flex w-full h-full flex-col items-center justify-center'>
			<h2 className='text-4xl'>Something went wrong!</h2>
			<Button className='mt-4' onClick={reset}>
				{/* <Link href={'/'}>Go Home</Link> */}
				Retry
			</Button>
		</div>
	);
}

export default ErrorPage;
