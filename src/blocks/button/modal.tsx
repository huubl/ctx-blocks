import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { ButtonModalProps } from './types';

const ButtonModal = ({
	attributes: { modalTitle, modalFull },
	setAttributes,
	showModal,
	setShowModal,
	template = [['core/paragraph']],
}: ButtonModalProps) => {
	if (!showModal) {
		return null;
	}

	return (
		<>
			{showModal && (
				<Modal
					title={__('Edit Modal content', 'ctx-blocks')}
					onRequestClose={() => {
						setShowModal(false);
					}}
					isFullScreen={modalFull}
				>
					<RichText
						tagName="h1"
						value={modalTitle || ''}
						onChange={(value) => setAttributes({ modalTitle: value })}
						placeholder={__('Modal title', 'ctx-blocks')}
						allowedFormats={['core/bold', 'core/italic']}
					/>
					<InnerBlocks template={template} />
				</Modal>
			)}
		</>
	);
};

export default ButtonModal;
