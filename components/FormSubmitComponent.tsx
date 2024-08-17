'use client';

import { useRef, useState, useTransition } from 'react';

import { ImSpinner2 } from 'react-icons/im';
import { HiCursorClick } from 'react-icons/hi';

import { FormElementInstance, FormElements } from './FormElements';

import { Button } from './ui/button';
import { toast } from './ui/use-toast';

import { submitFormSubmission } from '@/actions/form';

function FormSubmitComponent({
	formUrl,
	content,
}: {
	formUrl: string;
	content: FormElementInstance[];
}) {
	const formValues = useRef<{ [key: string]: string }>({});
	const formErrors = useRef<{ [key: string]: boolean }>({});

	const [pending, startTransition] = useTransition();

	const [renderKey, setRenderKey] = useState<number>(new Date().getTime());
	const [submitted, setSubmitted] = useState<boolean>(false);

	const validateForm: () => boolean = () => {
		for (const field of content) {
			const actualValue = formValues.current[field.id] || '';
			const valid = FormElements[field.type].validate(field, actualValue);

			if (!valid) {
				formErrors.current[field.id] = true;
			}
		}

		if (Object.keys(formErrors.current).length > 0) {
			return false;
		}

		return true;
	};

	const submitValue = (key: string, value: string) => {
		formValues.current[key] = value;
	};

	const submitForm = async () => {
		formErrors.current = {};

		const validForm = validateForm();

		if (!validForm) {
			setRenderKey(new Date().getTime());

			toast({
				title: 'Error',
				description: 'Check form for errors',
				variant: 'destructive',
			});

			return;
		}

		try {
			const jsonContent = JSON.stringify(formValues.current);

			await submitFormSubmission(formUrl, jsonContent);

			setSubmitted(true);
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong',
				variant: 'destructive',
			});
		}
	};

	if (submitted)
		return (
			<div className='flex justify-center w-full h-full items-center p-8'>
				<div className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
					<h1 className='text-2xl font-bold'>Form Submitted</h1>
					<p className='text-muted-foreground'>
						Thank you for your submission!
					</p>
				</div>
			</div>
		);

	return (
		<div className='flex justify-center w-full h-full items-center p-8'>
			<div
				key={renderKey}
				className='max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'
			>
				{content.map((element) => {
					const FormElement = FormElements[element.type].formComponent;

					return (
						<FormElement
							key={element.id}
							elementInstance={element}
							submitValue={submitValue}
							isInvalid={formErrors.current[element.id]}
							defaultValue={formValues.current[element.id]}
						/>
					);
				})}

				<Button
					className='mt-8'
					onClick={() => startTransition(submitForm)}
					disabled={pending}
				>
					{!pending && (
						<div className='flex items-center'>
							<HiCursorClick className='mr-2' />
							Submit
						</div>
					)}

					{pending && <ImSpinner2 className='animate-spin' />}
				</Button>
			</div>
		</div>
	);
}

export default FormSubmitComponent;
