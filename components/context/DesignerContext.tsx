'use client';

import {
	useState,
	createContext,
	ReactNode,
	Dispatch,
	SetStateAction,
} from 'react';

import { FormElementInstance } from '../FormElements';

type DesignerContextType = {
	elements: FormElementInstance[];
	setElements: Dispatch<SetStateAction<FormElementInstance[]>>;
	selectedElement: FormElementInstance | null;
	addElement: (index: number, element: FormElementInstance) => void;
	updateElement: (id: string, element: FormElementInstance) => void;
	removeElement: (id: string) => void;
	setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export function DesignerContextProvider({ children }: { children: ReactNode }) {
	const [elements, setElements] = useState<FormElementInstance[]>([]);
	const [selectedElement, setSelectedElement] =
		useState<FormElementInstance | null>(null);

	const addElement = (index: number, element: FormElementInstance) => {
		setElements((prevElements) => {
			const newElements = [...prevElements];

			newElements.splice(index, 0, element);

			return newElements;
		});
	};

	const updateElement = (id: string, element: FormElementInstance) => {
		setElements((prevElements) => {
			const newElements = [...prevElements];

			const index = newElements.findIndex((el) => el.id === id);

			if (index !== -1) {
				newElements[index] = element;
			}

			return newElements;
		});
	};

	const removeElement = (id: string) => {
		setElements((prevElements) =>
			prevElements.filter((element) => element.id !== id)
		);
	};

	return (
		<DesignerContext.Provider
			value={{
				elements,
				setElements,
				selectedElement,
				addElement,
				updateElement,
				removeElement,
				setSelectedElement,
			}}
		>
			{children}
		</DesignerContext.Provider>
	);
}
