import { InspectorControls } from '@wordpress/block-editor';
import {
	Button,
	CheckboxControl,
	Icon,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import icons from './icons';
import type { ButtonProps } from './types';

const Inspector = ({ attributes, setAttributes, setShowModal }: ButtonProps) => {
	const { modalFull, action, script, scriptTarget } = attributes;

	return (
		<InspectorControls>
			<PanelBody title={__('Behaviour', 'ctx-blocks')} initialOpen={true}>
				<div className="ctx-style-selector">
					<Button
						onClick={() => setAttributes({ action: 'link' })}
						className={action === 'link' ? 'active' : ''}
					>
						<Icon size={64} className="icon" icon={icons.link} />
						<div>{__('Link', 'ctx-blocks')}</div>
					</Button>
					<Button
						onClick={() =>
							setAttributes({
								action: 'modal',
							})
						}
						className={action === 'modal' ? 'active' : ''}
					>
						<Icon size={64} className="icon" icon={icons.window} />
						<div>{__('Modal', 'ctx-blocks')}</div>
					</Button>
					<Button
						onClick={() => setAttributes({ action: 'script' })}
						className={action === 'script' ? 'active' : ''}
					>
						<Icon size={64} className="icon" icon={icons.script} />
						<div>{__('Script', 'ctx-blocks')}</div>
					</Button>
				</div>

				{action === 'modal' && (
					<>
						<Button
							variant="secondary"
							onClick={() => setShowModal?.(true)}
						>
							{__('Edit modal content', 'ctx-blocks')}
						</Button>
						<CheckboxControl
							label={__('Full screen size', 'ctx-blocks')}
							checked={modalFull}
							onChange={() => setAttributes({ modalFull: !modalFull })}
							__nextHasNoMarginBottom
						/>
					</>
				)}

				{action === 'script' && (
					<>
						<SelectControl
							label={__('Script', 'ctx-blocks')}
							value={script}
							options={[
								{
									label: __('Select a script', 'ctx-blocks'),
									value: '',
								},
								{
									label: __('Toggle Element', 'ctx-blocks'),
									value: 'toggle',
								},
								{
									label: __('Hide Element', 'ctx-blocks'),
									value: 'hide',
								},
								{
									label: __('Show Element', 'ctx-blocks'),
									value: 'show',
								},
								{
									label: __('Scroll to Element', 'ctx-blocks'),
									value: 'scroll',
								},
							]}
							onChange={(value) => {
								setAttributes({ script: value });
							}}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>

						<TextControl
							label={__('Element ID', 'ctx-blocks')}
							value={scriptTarget || ''}
							onChange={(value) => {
								setAttributes({ scriptTarget: value });
							}}
							__next40pxDefaultSize
							__nextHasNoMarginBottom
						/>
					</>
				)}
			</PanelBody>
		</InspectorControls>
	);
};

export default Inspector;
