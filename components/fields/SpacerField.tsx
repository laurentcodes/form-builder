'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LuSeparatorHorizontal } from 'react-icons/lu';

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
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

import useDesigner from '../hooks/useDesigner';

const type: ElementsType = 'SpacerField';

const extraAttributes = {
	height: 20, // px
};

const propertiesScheme = z.object({
	height: z.number().min(5).max(50),
});

export const SpacerFieldFormElement: FormElement = {
	type,
	construct: (id: string) => ({
		id,
		type,
		extraAttributes,
	}),
	designerBtnElement: {
		icon: LuSeparatorHorizontal,
		label: 'Spacer Field',
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
	const { height } = element.extraAttributes;

	return (
		<div className='flex flex-col gap-2 w-full items-center'>
			<Label className='text-muted-foreground'>Spacer Field: {height}px</Label>
			<LuSeparatorHorizontal className='h-8 w-8' />
		</div>
	);
}

function FormComponent({
	elementInstance,
}: {
	elementInstance: FormElementInstance;
}) {
	const element = elementInstance as CustomInstance;

	const { height } = element.extraAttributes;

	return <div style={{ height, width: '100%' }}></div>;
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
			height: element.extraAttributes.height,
		},
	});

	useEffect(() => {
		form.reset(element.extraAttributes);
	}, [element, form]);

	function applyChanges(values: propertiesFormSchemaType) {
		const { height } = values;
		updateElement(element.id, {
			...element,
			extraAttributes: {
				height,
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
					name='height'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Height (px): {form.watch('height')}</FormLabel>
							<FormControl>
								<Slider
									defaultValue={[field.value]}
									min={5}
									max={50}
									step={1}
									onValueChange={(value) => {
										field.onChange(value[0]);
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
