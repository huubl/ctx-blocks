/**
 * Internal dependencies
 */
import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import './editor.scss';
import icon from './icon';
import Save from './save';
import './style.scss';

/**
 * Wordpress dependencies
 */
import { withColors } from '@wordpress/block-editor';

const { name } = metadata;

const settings = {
	icon: icon,
	deprecated,
	edit: withColors({
		accentColor: 'accentColor',
	})(Edit),

	save: Save,
};

export { name, settings };
