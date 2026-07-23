<?php
/**
 * Plugin Name:     CTX Blocks 
 * Description:     Additional Blocks for Gutenberg
 * Version:         3.2.0
 * Requires at least: 6.7
 * Requires PHP:      8.3
 * Author:          Thomas Gollenia
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     ctx-blocks
 *
 * @package         create-block
 */

use Contexis\WpGitHubUpdater\WordPressPluginUpdater;
use Contexis\WpGitHubUpdater\PluginMetadata;
use Contexis\WpGitHubUpdater\GitHubRepository;
use Contexis\WpGitHubUpdater\GitHubReleaseProvider;

require_once __DIR__ . '/vendor/autoload.php';

function ctx_block_init() {
	$block_directories = glob( __DIR__ . '/build/blocks/*', GLOB_ONLYDIR );

	if ( ! $block_directories ) {
		return;
	}

	foreach ( $block_directories as $block_directory ) {
		register_block_type( $block_directory );
	}
}

add_action( 'init', 'ctx_block_init' );

require_once __DIR__ . '/lib/Posts.php';



function ctx_blocks_load_textdomain() {
	load_plugin_textdomain('ctx-blocks', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' ); 
}
add_action( 'init', 'ctx_blocks_load_textdomain' );



function modify_render_block_defaults(string $block_content, array $block, $instance): string {
	if($block['blockName'] !== "core/latest-posts" || !key_exists('animateOnScroll', $block['attrs'])) {
		return $block_content;
	}
	
	$block_content = str_replace('<ul class="wp-block-latest-posts__list', '<ul class="wp-block-latest-posts__list ctx-animate-children ctx-' . $block['attrs']['animationType'] . ' ', $block_content);
	
    return $block_content; 

}

add_filter( "render_block", "modify_render_block_defaults", 10, 3 );


function ctx_blocks_register_updater() {
	static $registered = false;

	if ( $registered ) {
		return;
	}

	$plugin = PluginMetadata::fromPluginFile( __FILE__ );
	$repository = new GitHubRepository( 'gollenia', 'ctx-blocks' );
	$release_provider = new GitHubReleaseProvider( $repository, (string) ( $plugin->data['Version'] ?? '' ) );

	( new WordPressPluginUpdater(
		plugin: $plugin,
		repository: $repository,
		releaseProvider: $release_provider,
	) )->registerHooks();

	$registered = true;
}

add_action( 'load-plugins.php', 'ctx_blocks_register_updater' );
add_action( 'load-update-core.php', 'ctx_blocks_register_updater' );
add_action( 'load-update.php', 'ctx_blocks_register_updater' );
