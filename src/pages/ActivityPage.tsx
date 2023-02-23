import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getData } from '../api/api';
import { Activity } from '../components/Activity';
import { CenteredContainer } from '../components/Utils';

export function ActivityPage() {
	const params = useParams();
	const { data, isError, isLoading } = useQuery('data', getData);

	if (isLoading) return <div>Loading...</div>;
	if (isError || !data) return <div>Something went wrong!</div>;

	const activityId = Number(params.id);
	const activity = data.activities[activityId];

	return (
		<CenteredContainer>
			<Activity activity={activity} />
		</CenteredContainer>
	);
}
