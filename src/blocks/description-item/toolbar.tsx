import {
	AlignmentToolbar,
	BlockControls,
	LinkControl,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { Popover, ToolbarButton } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { link, plus } from '@wordpress/icons';

import type { DescriptionItemProps, MediaLike } from './types';

const ALLOWED_MEDIA_TYPES = ['image'];

type ToolbarProps = DescriptionItemProps & {
	onSelectMedia: (media?: MediaLike) => void;
};

const Toolbar = (props: ToolbarProps) => {
	const { attributes, setAttributes, onSelectMedia } = props;

	const { textAlign, imageId, imageUrl, url, opensInNewTab, rel } = attributes;

	const [isEditingURL, setIsEditingURL] = useState(false);

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={textAlign}
					onChange={(value) => setAttributes({ textAlign: value })}
				/>
			</BlockControls>
			<BlockControls group="other">
				<MediaReplaceFlow
					mediaId={imageId}
					mediaURL={imageUrl}
					allowedTypes={ALLOWED_MEDIA_TYPES}
					accept="image/*,video/*"
					onSelect={onSelectMedia}
					name={
						!imageUrl
							? __('Add Media', 'ctx-blocks')
							: __('Replace', 'ctx-blocks')
					}
				/>
				{imageUrl && (
					<ToolbarButton
						icon="trash"
						title={__('Remove Media', 'ctx-blocks')}
						onClick={() => {
							setAttributes({
								imageId: 0,
								imageUrl: '',
								focalPoint: undefined,
							});
						}}
					/>
				)}
				<ToolbarButton
					title={__('Select icon', 'ctx-blocks')}
					onClick={() => props.setInserterOpen?.(true)}
				>
					{attributes.icon
						? __('Change icon', 'ctx-blocks')
						: __('Select icon', 'ctx-blocks')}
				</ToolbarButton>
				<ToolbarButton
					icon={link}
					title={__('Link', 'ctx-blocks')}
					onClick={() => setIsEditingURL(true)}
				/>
			</BlockControls>
			{isEditingURL && (
				<Popover
					placement="bottom"
					onClose={() => {
						setIsEditingURL(false);
					}}
					focusOnMount={isEditingURL ? 'firstElement' : false}
					__unstableSlotName="__unstable-block-tools-after"
					shift
				>
					<LinkControl
						value={{ url, opensInNewTab }}
						onChange={(linkObject: { url?: string; opensInNewTab?: boolean }) =>
							setAttributes({
								rel,
								url: linkObject.url,
								opensInNewTab: linkObject.opensInNewTab,
							})
						}
						onRemove={() => {
							setAttributes({
								url: '',
								opensInNewTab: false,
							});
						}}
						forceIsEditingLink={isEditingURL}
					/>
				</Popover>
			)}
		</>
	);
};

export default Toolbar;
