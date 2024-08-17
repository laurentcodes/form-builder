import { TextFieldFormElement } from './fields/TextField';
import { TitleFieldFormElement } from './fields/TitleField';

export type ElementsType = 'TextField' | 'TitleField';

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
	type: ElementsType;

	construct: (id: string) => FormElementInstance;

	designerBtnElement: {
		icon: any;
		label: string;
	};

	designerComponent: React.FC<{
		elementInstance: FormElementInstance;
	}>;
	formComponent: React.FC<{
		elementInstance: FormElementInstance;
		submitValue?: SubmitFunction;
		isInvalid?: boolean;
		defaultValue?: string;
	}>;
	propertiesComponent: React.FC<{
		elementInstance: FormElementInstance;
	}>;

	validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
	id: string;
	type: ElementsType;
	extraAttributes?: Record<string, any>;
};

type FormElementType = {
	[key in ElementsType]: FormElement;
};

export const FormElements: FormElementType = {
	TextField: TextFieldFormElement,
	TitleField: TitleFieldFormElement,
};
