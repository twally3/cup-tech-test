import { z } from 'zod';

export type Question = {
	is_correct: boolean;
	stimulus: string;
	feedback: string;
};

export type Round = {
	round_title: string | null;
	questions: Question[];
};

export type Activity = {
	activity_name: string;
	questions: Round[];
};

type Schema = {
	name: string;
	heading: string;
	activities: Activity[];
};

const questionSchema = z.object({
	is_correct: z.boolean(),
	stimulus: z.string(),
	order: z.number(),
	feedback: z.string()
});

const roundSchema = z.object({
	round_title: z.string(),
	order: z.number(),
	questions: z.array(questionSchema)
});

const activitySchema = z.object({
	activity_name: z.string(),
	order: z.number(),
	questions: z.array(z.union([questionSchema, roundSchema]))
});

const schema = z.object({
	name: z.string(),
	heading: z.string(),
	activities: z.array(activitySchema)
});

const URI =
	'https://d1lfhvgtz0amuj.cloudfront.net/interview.mock.data/payload.json';

const orderData = <
	T extends
		| z.infer<typeof questionSchema>
		| z.infer<typeof roundSchema>
		| z.infer<typeof activitySchema>
>(
	x: T[]
): T[] =>
	x
		.sort((a, b) => a.order - b.order)
		.map(item =>
			'questions' in item
				? { ...item, questions: orderData(item.questions) }
				: item
		);

// Add questions that arent in rounds to anonymous rounds
const inflateRounds = (payload: z.infer<typeof schema>): Schema => {
	const activities = payload.activities.map(activity => {
		return {
			...activity,
			questions: activity.questions.reduce((current, next) => {
				if ('round_title' in next) return [...current, next];
				if (!current.length) return [{ round_title: null, questions: [] }];
				current[current.length - 1].questions.push(next);
				return current;
			}, [] as Round[])
		};
	});
	return {
		...payload,
		activities
	};
};

export const getData = () => {
	return fetch(URI)
		.then(r => r.json())
		.then(x => schema.parse(x))
		.then(x => ({ ...x, activities: orderData(x.activities) }))
		.then(x => inflateRounds(x));
};
