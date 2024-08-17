'use client';

import { Button } from './ui/button';

function VisitBtn({ shareUrl }: { shareUrl: string }) {
	const shareLink =
		typeof window !== 'undefined'
			? `${window.location.origin}/submit/${shareUrl}`
			: '';

	return (
		<Button
			className='w-[200px]'
			onClick={() => window.open(shareLink, '_blank')}
		>
			Visit
		</Button>
	);
}

export default VisitBtn;
