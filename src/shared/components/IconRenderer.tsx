import clsx from 'clsx';
import type { CSSProperties } from 'react';
import type { icon } from '../CustomInserter/types';
import HtmlRenderer from '../HtmlRenderer';

type IconRendererProps = {
	icon?: icon;
	html?: string;
	className?: string;
	style?: CSSProperties;
};

const IconRenderer = ({ icon, html, className, style }: IconRendererProps) => {
	const iconToDisplay = html ?? icon?.content ?? '';

	if (!iconToDisplay) {
		return null;
	}

	return (
		<HtmlRenderer
			html={iconToDisplay}
			wrapperProps={{
				className: clsx(className),
				style: {
					fill: 'currentColor',
					...style,
				},
			}}
		/>
	);
};

export default IconRenderer;
