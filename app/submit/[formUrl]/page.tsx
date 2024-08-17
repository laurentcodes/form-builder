import FormSubmitComponent from '@/components/FormSubmitComponent';
import { FormElementInstance } from '@/components/FormElements';

import { getFormByUrl } from '@/actions/form';

async function Page({ params }: { params: { formUrl: string } }) {
	const form = await getFormByUrl(params.formUrl);

	if (!form) {
		throw new Error('Form not found');
	}

	const content = JSON.parse(form.content) as FormElementInstance[];

	return <FormSubmitComponent formUrl={params.formUrl} content={content} />;
}

export default Page;
