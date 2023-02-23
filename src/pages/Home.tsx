import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getData } from '../api/api';
import { CenteredContainer, Subtitle, Title } from '../components/Utils';

export function Home() {
	const { data, isError, isLoading } = useQuery('data', getData);

	if (isLoading) return <div>Loading...</div>;

	if (isError || !data) return <div>Something went wrong!</div>;

	return (
		<CenteredContainer>
			<div>
				<Title>{data.name}</Title>
				<Subtitle>{data.heading}</Subtitle>

				<ul className="py-2">
					{data.activities.map((activity, i) => (
						<li key={i}>
							<Link
								to={`/activities/${i}`}
								className="text-sky-500 hover:text-sky-600"
							>
								{activity.activity_name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</CenteredContainer>
	);
}
