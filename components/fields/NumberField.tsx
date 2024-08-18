'use client';

import { useEffect, useState } from 'react';
import { Bs123 } from 'react-icons/bs';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';

import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from '../FormElements';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';

import useDesigner from '../hooks/useDesigner';

const type: ElementsType = 'NumberField';

const extraAttributes = {
	label: 'Number Field',
	helperText: 'Helper Text',
	required: false,
	placeholder: '0',
};

const propertiesScheme = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
	placeholder: z.string().max(50),
});

export const NumberFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: Bs123,
		label: 'Number Field',
	},
	designerComponent: DesignerComponent,
	formComponent: FormComponent,
	propertiesComponent: PropertiesComponent,

	validate: (
		formElement: FormElementInstance,
		currentValue: string
	): boolean => {
		const element = formElement as CustomInstance;

		if (element.extraAttributes.required) {
			return currentValue.length > 0;
		}

		return true;
	},
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
	const { label, required, placeholder, helperText } = element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label>
				{label}
				{required && '*'}
			</Label>

			<Input readOnly disabled type='number' placeholder={placeholder} />

			{helperText && (
				<p className='text-muted-foreground text-[0.8rem]'>{helperText}</p>
			)}
		</div>
	);
}

function FormComponent({
	elementInstance,
	submitValue,
	isInvalid,
	defaultValue,
}: {
	elementInstance: FormElementInstance;
	submitValue?: SubmitFunction;
	isInvalid?: boolean;
	defaultValue?: string;
}) {
	const [value, setValue] = useState<string>(defaultValue || '');
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		setError(isInvalid === true);
	}, [isInvalid]);

	const element = elementInstance as CustomInstance;

	const { label, required, placeholder, helperText } = element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className={cn(error && 'text-red-500')}>
				{label}
				{required && '*'}
			</Label>

			<Input
				type='number'
				className={cn(error && 'border-red-500')}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
				onBlur={(e) => {
					if (!submitValue) return;

					const valid = NumberFieldFormElement.validate(
						element,
						e.target.value
					);

					setError(!valid);

					if (!valid) return;

					submitValue(element.id, e.target.value);
				}}
				value={value}
			/>

			{helperText && (
				<p
					className={cn(
						'text-muted-foreground text-[0.8rem]',
						error && 'text-red-500'
					)}
				>
					{helperText}
				</p>
			)}
		</div>
	);
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
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
			placeholder: element.extraAttributes.placeholder,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: propertiesFormSchemaType) {
		updateElement(element.id, {
			...element,
			extraAttributes: {
				...element.extraAttributes,
				...values,
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
					name='label'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Label</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>

							<FormDescription>
								The label for the field. <br /> It will be displayed above the
								input field.
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='placeholder'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Placeholder</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>

							<FormDescription>The placeholder of the field</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='helperText'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Helper Text</FormLabel>
							<FormControl>
								<Input
									{...field}
									onKeyDown={(e) => {
										if (e.key === 'Enter') e.currentTarget.blur();
									}}
								/>
							</FormControl>

							<FormDescription>
								The Helper Text of the field <br /> It will be displayed below
								the input field.
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='required'
					render={({ field }) => (
						<FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-md'>
							<div className='space-y-0.5'>
								<FormLabel>Required</FormLabel>

								<FormDescription>
									The Helper Text of the field <br /> It will be displayed below
									the input field.
								</FormDescription>
							</div>

							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
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
