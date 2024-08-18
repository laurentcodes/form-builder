'use client';

import { useEffect, useState } from 'react';
import { RxDropdownMenu } from 'react-icons/rx';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
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

import { toast } from '../ui/use-toast';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
} from '../ui/select';
import { Switch } from '../ui/switch';

import useDesigner from '../hooks/useDesigner';

const type: ElementsType = 'SelectField';

const extraAttributes = {
	label: 'Select Field',
	helperText: 'Helper Text',
	required: false,
	placeholder: 'Value Here...',
	options: [],
};

const propertiesScheme = z.object({
	label: z.string().min(2).max(50),
	helperText: z.string().max(200),
	required: z.boolean().default(false),
	placeholder: z.string().max(50),
	options: z.array(z.string()).default([]),
});

export const SelectFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: RxDropdownMenu,
		label: 'Select Field',
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

			<Select>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</Select>

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

	const { label, required, placeholder, helperText, options } =
		element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full'>
			<Label className={cn(error && 'text-red-500')}>
				{label}
				{required && '*'}
			</Label>

			<Select
				defaultValue={value}
				onValueChange={(value) => {
					setValue(value);

					if (!submitValue) return;

					const valid = SelectFieldFormElement.validate(element, value);
					setError(!valid);

					submitValue(element.id, value);
				}}
			>
				<SelectTrigger className={cn('w-full', error && 'border-red-500')}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

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
	const { updateElement, setSelectedElement } = useDesigner();

	const element = elementInstance as CustomInstance;

	const form = useForm<propertiesFormSchemaType>({
		resolver: zodResolver(propertiesScheme),
		mode: 'onSubmit',
		defaultValues: {
			label: element.extraAttributes.label,
			helperText: element.extraAttributes.helperText,
			required: element.extraAttributes.required,
			placeholder: element.extraAttributes.placeholder,
			options: element.extraAttributes.options,
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

		toast({
			title: 'Success',
			description: 'Properties saved successfully',
		});

		setSelectedElement(null);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(applyChanges)} className='space-y-3'>
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

				<Separator />

				<FormField
					control={form.control}
					name='options'
					render={({ field }) => (
						<FormItem>
							<div className='flex justify-between items-center'>
								<FormLabel>Options</FormLabel>
								<Button
									variant={'outline'}
									className='gap-2'
									onClick={(e) => {
										e.preventDefault();
										form.setValue('options', [...field.value, 'New Option']);
									}}
								>
									<AiOutlinePlus />
									Add
								</Button>
							</div>

							<div className='flex flex-col gap-2'>
								{form.watch('options').map((option, index) => (
									<div
										key={index}
										className='flex items-center justify-between gap-1'
									>
										<Input
											placeholder=''
											value={option}
											onChange={(e) => {
												field.value[index] = e.target.value;
												field.onChange(field.value);
											}}
										/>

										<Button
											variant={'ghost'}
											size={'icon'}
											onClick={(e) => {
												e.preventDefault();

												const newOptions = [...field.value];
												newOptions.splice(index, 1);

												field.onChange(newOptions);
											}}
										>
											<AiOutlineClose />
										</Button>
									</div>
								))}
							</div>

							<FormDescription>
								The Helper Text of the field <br /> It will be displayed below
								the input field.
							</FormDescription>

							<FormMessage />
						</FormItem>
					)}
				/>

				<Separator />

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

				<Separator />

				<Button className='w-full' type='submit'>
					Save
				</Button>
			</form>
		</Form>
	);
}
