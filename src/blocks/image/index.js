/**
 * Internal dependencies
 */
import edit from './edit';
import icon from './icon';
import metadata from './block.json';
import './editor.scss';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n'; 

const { name, title, description } = metadata;

const settings = {
	...metadata,
	title: __( title, 'ctx-blocks' ),
	description: __( description, 'ctx-blocks' ),
	icon,
	edit,
	save: () => { return null }
};

export { name, settings };