import { useTransition } from 'react';
import { HiSaveAs } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

import useDesigner from './hooks/useDesigner';

import { Button } from './ui/button';
import { toast } from './ui/use-toast';

import { updateFormContent } from '@/actions/form';

function SaveFormBtn({ id }: { id: number }) {
	const { elements } = useDesigner();

	const [loading, startTransition] = useTransition();

	const updateForm = async () => {
		try {
			const JSONElements = JSON.stringify(elements);

			await updateFormContent(id, JSONElements);

			toast({
				title: 'Form Saved',
				description: 'Your form has been saved',
			});

			console.log(JSONElements);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	return (
		<Button
			variant={'outline'}
			className='gap-2'
			disabled={loading}
			onClick={() => startTransition(updateForm)}
		>
			<HiSaveAs className='h-4 w-4' />
			Save
			{loading && <FaSpinner className='animate-spin' />}
		</Button>
	);
}

export default SaveFormBtn;
