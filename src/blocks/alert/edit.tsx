/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
 * Wordpress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';


export default function AlertEdit({...props}) {

		const {
			attributes: {
				alertText,
				title,
				isDismissable
			},
			setAttributes,
			className,
			alertColor
		} = props;

		const textColor = props.colorUtils.getMostReadableColor(alertColor.color);

		const blockProps = useBlockProps({
			className: `${className} ctx-blocks-alert`,
			style:{background: alertColor.color, color: textColor}
		})

		return (
			<>
				<Inspector
						{ ...props }
				/>
				<div { ...blockProps } >
					{isDismissable &&
						<span className={"ctx-close"}>
							<span>×</span>
						</span>
					}

					<RichText
						tagName="h3"
						label={__("Title", 'ctx-blocks')}
						value={ title }
						onChange={ (value: string) => setAttributes({ title: value }) }
						placeholder={__("Alert Title", 'ctx-blocks')}
						
					/>
					
					<RichText
						tagName="p"
						value={ alertText }
						onChange={ (value: string) => setAttributes({ alertText: value }) }
						placeholder={__("Type message here...", 'ctx-blocks')}
						
					/>
					
				</div>
			</>
		);

}