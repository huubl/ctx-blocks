import { RichText, useBlockProps } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CustomInserterModal from '../../shared/CustomInserter';
import IconRenderer from '../../shared/components/IconRenderer';
import useIconStore from '../../shared/Hooks/useIconStore';
import Inspector from './inspector';
import ButtonModal from './modal';
import Toolbar from './toolbar';
import type { ButtonProps } from './types';

export default function ButtonEdit({ ...props }: ButtonProps) {
	const {
		attributes: { title, size, icon, iconRight, iconOnly },
		setAttributes,
		className,
	} = props;

	const [deleteButton, setDeleteButton] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isInserterOpen, setInserterOpen] = useState(false);

	const template: [string][] = [['core/paragraph']];

	const buttonClasses = [
		className || false,
		'ctx__button',
		iconRight ? 'reverse' : false,
		iconOnly ? 'icon-only' : false,
		size || false,
	]
		.filter(Boolean)
		.join(' ');

	const blockProps = useBlockProps({ className: buttonClasses });

	const {
		selectedIcon,
		allIcons = [],
		isLoading,
	} = useIconStore(icon, isInserterOpen);

	return (
		<div {...blockProps}>
			<Inspector {...props} setShowModal={setShowModal} />
			<Toolbar {...props} setInserterOpen={setInserterOpen} />
			{isInserterOpen && (
				<CustomInserterModal
					icons={allIcons}
					setInserterOpen={setInserterOpen}
					attributes={props.attributes}
					setAttributes={setAttributes}
					isLoading={isLoading}
				/>
			)}
			<span>
				{icon && !isLoading && (
					<IconRenderer icon={selectedIcon} className="ctx-icon" />
				)}
				{!iconOnly && (
					<RichText
						tagName="span"
						value={title || ''}
						disableLineBreaks={true}
						onChange={(value) => setAttributes({ title: value })}
						placeholder={__('Button title', 'ctx-blocks')}
						allowedFormats={['core/bold', 'core/italic']}
						onKeyUp={(event) => {
							if (event.keyCode === 13) {
								if (title === '') {
									return;
								}
								event.preventDefault();
								const newBlock = createBlock('core/paragraph', {});
								props.insertBlocksAfter?.(newBlock);
							}
							if (event.keyCode === 8 && title === '') {
								event.preventDefault();
								if (deleteButton) {
									setDeleteButton(false);
									props.onRemove?.();
									return;
								}
								setDeleteButton(true);
							}
						}}
					/>
				)}
			</span>

			<ButtonModal
				attributes={props.attributes}
				setAttributes={setAttributes}
				showModal={showModal}
				setShowModal={setShowModal}
				template={template}
			/>
		</div>
	);
}
