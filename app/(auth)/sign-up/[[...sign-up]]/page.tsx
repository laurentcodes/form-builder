import { SignUp } from '@clerk/nextjs';

export default function Page() {
	return (
		<main className='w-full h-full flex flex-col items-center justify-center p-8'>
			<SignUp />
		</main>
	);
}
