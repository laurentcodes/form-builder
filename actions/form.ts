'use server';

import { currentUser } from '@clerk/nextjs/server';

import prisma from '@/lib/prisma';

import { formSchema, formSchemaType } from '@/schemas/form';

class UserNotFoundErr extends Error {}

export async function getFormStats() {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const stats = await prisma.form.aggregate({
		where: {
			userId: user.id,
		},
		_sum: {
			visits: true,
			submissions: true,
		},
	});

	const visits = stats._sum.visits || 0;
	const submissions = stats._sum.submissions || 0;

	let submissionRate = 0;

	if (visits > 0) {
		submissionRate = Math.round((submissions / visits) * 100);
	}

	const bounceRate = 100 - submissionRate;

	return {
		visits,
		submissions,
		submissionRate,
		bounceRate,
	};
}

export async function createForm(data: formSchemaType) {
	const validation = formSchema.safeParse(data);

	if (!validation.success) {
		throw new Error('Invalid form data');
	}

	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const { name, description } = data;

	const form = await prisma.form.create({
		data: {
			userId: user.id,
			name,
			description,
		},
	});

	if (!form) {
		throw new Error('Failed to create form');
	}

	return form.id;
}

export async function getForms() {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const forms = await prisma.form.findMany({
		where: {
			userId: user.id,
		},
		orderBy: {
			createdAt: 'desc',
		},
	});

	return forms;
}

export async function getFormById(id: number) {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const form = await prisma.form.findUnique({
		where: {
			userId: user.id,
			id,
		},
	});

	return form;
}

export async function updateFormContent(id: number, jsonContent: string) {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	await prisma.form.update({
		where: {
			userId: user.id,
			id,
		},
		data: {
			content: jsonContent,
		},
	});
}

export async function publishForm(id: number) {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const form = await prisma.form.update({
		where: {
			userId: user.id,
			id,
		},
		data: {
			published: true,
		},
	});

	return form;
}

export async function getFormByUrl(url: string) {
	const form = await prisma.form.update({
		select: { content: true },
		data: {
			visits: {
				increment: 1,
			},
		},
		where: {
			shareUrl: url,
		},
	});

	return form;
}

export async function submitFormSubmission(url: string, jsonContent: string) {
	const form = await prisma.form.update({
		data: {
			submissions: {
				increment: 1,
			},
			FormSubmissions: {
				create: {
					content: jsonContent,
				},
			},
		},
		where: {
			shareUrl: url,
			published: true,
		},
	});

	return form;
}

export async function getFormWithSubmissions(id: number) {
	const user = await currentUser();

	if (!user) {
		throw new UserNotFoundErr();
	}

	const form = await prisma.form.findUnique({
		where: {
			userId: user.id,
			id,
		},
		include: {
			FormSubmissions: true,
		},
	});

	return form;
}
