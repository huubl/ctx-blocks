import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import HtmlRenderer from '../HtmlRenderer';
import type { IconGridProps } from './types';

const IconGrid = ({ icons, onChange, attributes }: IconGridProps) => {
	return (
		<div className="wp-block-icon__inserter-grid">
			{!icons?.length ? (
				<div className="wp-block-icon__inserter-grid-no-results">
					<p>{__('No results found.')}</p>
				</div>
			) : (
				<div className="wp-block-icon__inserter-grid-icons-list">
					{icons.map((icon) => {
						return (
							<Button
								key={icon.name}
								className="wp-block-icon__inserter-grid-icons-list-item"
								onClick={() => onChange(icon.name)}
								variant={icon.name === attributes?.icon ? 'primary' : undefined}
								__next40pxDefaultSize
							>
								<span className="wp-block-icon__inserter-grid-icons-list-item-icon">
									<HtmlRenderer
										wrapperProps={{
											style: { width: '24px' },
										}}
										html={icon.content}
									/>
								</span>
								<span className="wp-block-icon__inserter-grid-icons-list-item-title">
									{icon.label}
								</span>
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default IconGrid;
