import { getFormById } from '@/actions/form';

import FormBuilder from '@/components/FormBuilder';

async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	const form = await getFormById(Number(id));

	if (!form) {
		throw new Error('Form not found');
	}

	return <FormBuilder form={form} />;
}

export default Page;
