import { Path, Rect, SVG } from '@wordpress/components';
import clsx from 'clsx';

type IconPlaceholderProps = {
	className?: string;
	style?: React.CSSProperties;
};

const IconPlaceholder = ({ className, style }: IconPlaceholderProps) => (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 60 60"
		preserveAspectRatio="none"
		fill="none"
		aria-hidden="true"
		className={clsx('wp-block-icon__placeholder', className)}
		style={style}
	>
		<Rect width="60" height="60" fill="currentColor" fillOpacity={0.1} />
		<Path
			vectorEffect="non-scaling-stroke"
			stroke="currentColor"
			strokeOpacity={0.25}
			d="M60 60 0 0"
		/>
	</SVG>
);

export default IconPlaceholder;
