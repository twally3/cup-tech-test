import {
	Activity as ActivityType,
	Round as RoundType,
	Question as QuestionType
} from '../api/api';
import { FC, useCallback, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Subtitle, Title } from './Utils';
import { ProgressBar } from './ProgressBar';

type Action =
	| { type: 'INCREMENT_QUESTION' }
	| { type: 'SET_RESULTS'; value: boolean };

type State = {
	count: number;
	rounds: RoundType[];
	round: RoundType;
	roundIdx: number;
	questions: QuestionType[];
	question: QuestionType;
	questionIdx: number;
	results: boolean[];
	isComplete: boolean;
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case 'INCREMENT_QUESTION':
			if (state.questionIdx + 1 < state.questions.length) {
				return {
					...state,
					questionIdx: state.questionIdx + 1,
					question: state.questions[state.questionIdx + 1]
				};
			} else if (state.roundIdx + 1 < state.rounds.length) {
				return {
					...state,
					roundIdx: state.roundIdx + 1,
					round: state.rounds[state.roundIdx + 1],
					questionIdx: 0,
					question: state.rounds[state.roundIdx + 1].questions[0]
				};
			} else {
				return { ...state, isComplete: true };
			}
		case 'SET_RESULTS':
			return { ...state, results: [...state.results, action.value] };
		default:
			return state;
	}
};

type ActivityParams = {
	activity: ActivityType;
};

export const Activity: FC<ActivityParams> = ({ activity }) => {
	const [hasCompletedSetup, setHasCompletedSetup] = useState(false);
	const [showRoundScreen, setShowRoundScreen] = useState(false);
	const [state, dispatch] = useReducer(reducer, {
		count: 0,
		rounds: activity.questions,
		round: activity.questions[0],
		roundIdx: 0,
		questions: activity.questions[0].questions,
		question: activity.questions[0].questions[0],
		questionIdx: 0,
		results: [],
		isComplete: false
	});

	useEffect(() => {
		if (!hasCompletedSetup) setHasCompletedSetup(true);
		if (state.round.round_title === null) return;
		setShowRoundScreen(true);
	}, [state.round]);

	const onClicked = (correctButton: boolean) => {
		dispatch({
			type: 'SET_RESULTS',
			value: state.question.is_correct === correctButton
		});
		dispatch({
			type: 'INCREMENT_QUESTION'
		});
	};

	const startRound = useCallback(() => void setShowRoundScreen(false), []);

	if (!hasCompletedSetup) return <></>;

	if (showRoundScreen)
		return (
			<>
				<div>
					<Title>{activity.activity_name}</Title>
					<Subtitle>{state.round.round_title}</Subtitle>
				</div>
				<Button block={true} onClick={startRound}>
					Start Round
				</Button>
			</>
		);

	if (state.isComplete)
		return (
			<div className="container max-w-md p-2">
				<Title>{activity.activity_name}</Title>
				<Subtitle>Results</Subtitle>

				<div className="my-2">
					{state.rounds.map((round, i) => (
						<section key={i}>
							<h3 className="text-l font-bold">{round.round_title ?? ''}</h3>
							<ul>
								{round.questions.map((_, j) => (
									<li key={j} className="flex justify-between">
										<span>Q{j + 1}</span>
										<span>
											{state.results[i * round.questions.length + j] === true
												? 'CORRECT'
												: 'FALSE'}
										</span>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
				<Link to="/" className="text-sky-500 hover:text-sky-600">
					Home
				</Link>
			</div>
		);

	const totalQuestions = state.rounds.reduce(
		(current, next) => current + next.questions.length,
		0
	);

	return (
		<>
			<div>
				<ProgressBar current={state.results.length} total={totalQuestions} />
				<Title>
					{activity.activity_name}{' '}
					{state.round.round_title !== null
						? `/ ${state.round.round_title}`
						: ''}
				</Title>
				<Subtitle>Q{state.questionIdx + 1}.</Subtitle>
			</div>
			<p>{state.question.stimulus}</p>
			<div>
				<Button block={true} onClick={onClicked.bind(null, true)}>
					Correct
				</Button>
				<Button block={true} onClick={onClicked.bind(null, false)}>
					Incorrect
				</Button>
			</div>
		</>
	);
};
