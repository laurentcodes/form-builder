import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { FaIcons } from 'react-icons/fa';
import { MdOutlinePublish } from 'react-icons/md';

import { Button } from './ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from './ui/use-toast';

import { publishForm } from '@/actions/form';

function PublishFormBtn({ id }: { id: number }) {
	const router = useRouter();

	const [loading, startTransition] = useTransition();

	async function publish() {
		try {
			await publishForm(id);

			toast({
				title: 'Success',
				description: 'Form published successfully!',
			});

			router.refresh();
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong!',
				variant: 'destructive',
			});
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
					<MdOutlinePublish className='h-4 w-4' />
					Publish
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to publish this form?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Once published, you will no longer be able to edit this form. <br />
						<span className='font-medium'>
							By publishing this form, you will make it available to the public
							and you will be able to collect submissions.
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						disabled={loading}
						onClick={(e) => {
							e.preventDefault();
							startTransition(publish);
						}}
					>
						Publish {loading && <FaIcons className='animate-spin' />}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default PublishFormBtn;
