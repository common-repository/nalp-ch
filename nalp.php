<?php
/**
 * Plugin Name:     Nalp.ch
 * Description:     Example block written with ESNext standard and JSX support – build step required.
 * Version:         0.1.0
 * Author:          The WordPress Contributors
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     nalp
 *
 * @package         create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */
function create_block_nalp_block_init() {
	$dir = __DIR__;

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/nalp" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-block-nalp-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'create-block-nalp-block-editor', 'nalp' );

	$editor_css = 'build/index.css';
	wp_register_style(
		'create-block-nalp-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'create-block-nalp-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	$front_js = 'build/front.js';
	wp_register_script(
		'create-block-nalp-block-client',
		plugins_url( $front_js, __FILE__ ),
		['wp-blocks', 'wp-element', 'wp-editor'],
		filemtime( "$dir/$front_js" )
	);

	register_block_type( 'create-block/nalp', array(
		'editor_script' => 'create-block-nalp-block-editor',
		'editor_style'  => 'create-block-nalp-block-editor',
		'style'         => 'create-block-nalp-block',
		'script'		=> 'create-block-nalp-block-client'
	) );
}
add_action( 'init', 'create_block_nalp_block_init' );
