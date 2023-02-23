import type { FC } from 'react';
import classNames from 'classnames';

type ProgressBarProps = {
	current: number;
	total: number;
};

export const ProgressBar: FC<ProgressBarProps> = ({ current, total }) => (
	<div className="flex gap-1 rounded-full overflow-hidden">
		{Array.from({ length: total }).map((_, i) => (
			<div
				key={i}
				className={classNames(`flex-grow p-1`, {
					'bg-sky-600': i <= current,
					'bg-sky-300': i > current
				})}
			></div>
		))}
	</div>
);
