'use client';

import { useEffect, useState } from 'react';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { CalendarIcon } from '@radix-ui/react-icons';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { cn } from '@/lib/utils';

import {
	ElementsType,
	FormElement,
	FormElementInstance,
	SubmitFunction,
} from '../FormElements';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
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

const type: ElementsType = 'DateField';

const extraAttributes = {
	label: 'Date Field',
	helperText: 'Pick a Date',
	required: false,
};

const propertiesScheme = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
});

export const DateFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: BsFillCalendarDateFill,
		label: 'Date Field',
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

			<Button
				variant={'outline'}
				className='w-full justify-start text-left font-normal'
			>
				<CalendarIcon className='mr-2 h-4 w-4' />
				<span>Pick a Date</span>
			</Button>

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
	const [date, setDate] = useState<Date | undefined>(
		defaultValue ? new Date(defaultValue) : undefined
	);
	const [error, setError] = useState<boolean>(false);

	useEffect(() => {
		setError(isInvalid === true);
	}, [isInvalid]);

	const element = elementInstance as CustomInstance;

	const { label, required, helperText } = element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className={cn(error && 'text-red-500')}>
				{label}
				{required && '*'}
			</Label>

			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'w-full justify-start text-left font-normal',
							!date && 'text-muted-foreground',
							error && 'border-red-500'
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? format(date, 'PPP') : 'Pick a Date'}
					</Button>
				</PopoverTrigger>

				<PopoverContent className='w-auto p-0' align='start'>
					<Calendar
						mode='single'
						selected={date}
						onSelect={(date) => {
							setDate(date);

							if (!submitValue) return;

							const value = date?.toUTCString() || '';
							const valid = DateFieldFormElement.validate(element, value);

							setError(!valid);
							submitValue(element.id, value);
						}}
						initialFocus
					/>
				</PopoverContent>
			</Popover>

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
