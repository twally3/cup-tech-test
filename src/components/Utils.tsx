import { FC, PropsWithChildren } from 'react';
import classnames from 'classnames';

export const Title: FC<PropsWithChildren> = ({ children }) => (
	<h1 className="text-3xl">{children}</h1>
);

export const Subtitle: FC<PropsWithChildren> = ({ children }) => (
	<h2 className="text-xl">{children}</h2>
);

export const CenteredContainer: FC<PropsWithChildren> = ({ children }) => (
	<div className="absolute inset-0 flex flex-col items-center">
		<div className="container max-w-md p-2 flex-grow flex flex-col justify-between">
			{children}
		</div>
	</div>
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	block?: boolean;
};

export const Button: FC<ButtonProps> = ({ children, block, ...props }) => (
	<button
		className={classnames(
			'bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded my-5',
			{ block: block, 'w-full': block }
		)}
		{...props}
	>
		{children}
	</button>
);
