'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LuHeading2 } from 'react-icons/lu';

import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from '../FormElements';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import useDesigner from '../hooks/useDesigner';

const type: ElementsType = 'SubTitleField';

const extraAttributes = {
	title: 'Subtitle Field',
};

const propertiesScheme = z.object({
	title: z.string().min(2).max(50),
});

export const SubTitleFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: LuHeading2,
		label: 'Subtitle Field',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,

	validate: (): boolean => true,
};

type CustomInstance = FormElementInstance & {
	extraAttributes: typeof extraAttributes;
};

type propertiesFormSchemaType = z.infer<typeof propertiesScheme>;

function DesignerComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as CustomInstance;
	const { title } = element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className='text-muted-foreground'>Subtitle Field</Label>
			<p className='text-lg'>{title}</p>
		</div>
	);
}

function FormComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
	submitValue?: SubmitFunction;
	isInvalid?: boolean;
	defaultValue?: string;
}) {
	const element = elementInstance as CustomInstance;

	const { title } = element.extraAttributes;

	return <p className='text-lg'>{title}</p>;
}

function PropertiesComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const { updateElement } = useDesigner();

	const element = elementInstance as CustomInstance;

	const form = useForm<propertiesFormSchemaType>({
		resolver: zodResolver(propertiesScheme),
		mode: 'onBlur',
		defaultValues: {
			title: element.extraAttributes.title,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: propertiesFormSchemaType) {
		const { title } = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				title,
			},
		});
	}

	return (
		<Form {...form}>
			<form
				onBlur={form.handleSubmit(applyChanges)}
				className='space-y-3'
				onSubmit={(e) => e.preventDefault()}
			>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subtitle</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
