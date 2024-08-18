import { ReactNode } from 'react';
import { format, formatDistance } from 'date-fns';

import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';

import { getFormById, getFormWithSubmissions } from '@/actions/form';

import { ElementsType, FormElementInstance } from '@/components/FormElements';

import VisitBtn from '@/components/VisitBtn';
import FormLinkShare from '@/components/FormLinkShare';

import { StatsCard } from '../../page';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	const form = await getFormById(Number(id));

	if (!form) {
		throw new Error('Form not found');
	}

	const { visits, submissions } = form;

	let submissionRate = 0;

	if (visits > 0) {
		submissionRate = Math.round((submissions / visits) * 100);
	}

	const bounceRate = 100 - submissionRate;
	const submissionRateColor =
		submissionRate > 50 ? 'text-green-600' : 'text-red-600';
	1;
	return (
		<>
			<div className='py-10 border-b border-muted'>
				<div className='flex justify-between container'>
					<h1 className='text-4xl font-bold truncate'>{form.name}</h1>

					<VisitBtn shareUrl={form.shareUrl} />
				</div>
			</div>

			<div className='py-4 border-b border-muted'>
				<div className='container flex gap-2 items-center justify-between'>
					<FormLinkShare shareUrl={form.shareUrl} />
				</div>
			</div>

			<div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container'>
				<StatsCard
					title='Total Visits'
					icon={<LuView className='text-blue-600' />}
					helperText='All Time Form Visits'
					value={visits.toLocaleString() || ''}
					loading={false}
					className='shadow-md shadow-blue-600'
				/>

				<StatsCard
					title='Total Submissions'
					icon={<FaWpforms className='text-yellow-600' />}
					helperText='All Time Form Submissions'
					value={submissions.toLocaleString() || ''}
					loading={false}
					className='shadow-md shadow-yellow-600'
				/>

				<StatsCard
					title='Submission Rate'
					icon={<HiCursorClick className='text-green-600' />}
					helperText='Submission Rate'
					value={submissionRate.toLocaleString() + '%' || ''}
					loading={false}
					className='shadow-md shadow-green-600'
				/>

				<StatsCard
					title='Bounce Rate'
					icon={<TbArrowBounce className='text-red-600' />}
					helperText='Bounce Rate'
					value={bounceRate.toLocaleString() + '%' || ''}
					loading={false}
					className='shadow-md shadow-red-600'
				/>
			</div>

			<div className='container pt-10'>
				<SubmissionsTable id={form.id} />
			</div>
		</>
	);
}

type Row = { [key: string]: string } & { submittedAt: Date };

async function SubmissionsTable({ id }: { id: number }) {
	const form = await getFormWithSubmissions(id);

	if (!form) {
		throw new Error('Form not found');
	}

	const formElements = JSON.parse(form.content) as FormElementInstance[];
	const columns: {
		id: string;
		label: string;
		required: boolean;
		type: ElementsType;
	}[] = [];

	formElements.forEach((element) => {
		switch (element.type) {
			case 'TextField':
			case 'NumberField':
			case 'TextAreaField':
			case 'DateField':
			case 'SelectField':
			case 'CheckboxField':
				columns.push({
					id: element.id,
					label: element.extraAttributes?.label,
					required: element.extraAttributes?.required,
					type: element.type,
				});

				break;

			default:
				break;
		}
	});

	const rows: Row[] = [];

	form.FormSubmissions.forEach((submission) => {
		const content = JSON.parse(submission.content);

		rows.push({
			...content,
			submittedAt: submission.createdAt,
		});
	});

	return (
		<>
			<h1 className='text-2xl font-bold my-4'>Submissions</h1>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.id} className='uppercase'>
									{column.label}
								</TableHead>
							))}
							<TableHead className='text-muted-foreground text-right uppercase'>
								Submitted At
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={index}>
								{columns.map((column) => (
									<RowCell
										key={column.id}
										type={column.type}
										value={row[column.id]}
									/>
								))}
								<TableCell className='text-muted-foreground text-right'>
									{formatDistance(row.submittedAt, new Date(), {
										addSuffix: true,
									})}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
	let node: ReactNode = value;

	switch (type) {
		case 'DateField':
			if (!value) break;

			const date = new Date(value);
			node = <Badge variant={'outline'}>{format(date, 'dd/MM/yyyy')}</Badge>;

			break;
		case 'CheckboxField':
			const checked = value === 'true';
			node = <Checkbox checked={checked} disabled />;
	}

	return <TableCell>{node}</TableCell>;
}

export default Page;
