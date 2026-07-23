<?php

/**
 * @var array<string, mixed> $attributes
 * @var string               $content
 */

$image_id    = ! empty( $attributes['imageId'] ) ? (int) $attributes['imageId'] : 0;
$image_url   = $attributes['imageUrl'] ?? '';
$image_alt   = $attributes['imageAlt'] ?? '';
$orientation = $attributes['layout']['orientation'] ?? '';

$resolve_css_value = static function ( $value ) {
	if ( ! is_string( $value ) || '' === $value ) {
		return '';
	}

	if ( str_starts_with( $value, 'var:preset|' ) ) {
		return 'var(--wp--preset--' . str_replace( '|', '--', substr( $value, 11 ) ) . ')';
	}

	if ( str_starts_with( $value, 'var:custom|' ) ) {
		return 'var(--wp--custom--' . str_replace( '|', '--', substr( $value, 11 ) ) . ')';
	}

	return $value;
};

$content_styles = array();
$padding        = $attributes['style']['spacing']['padding'] ?? array();

if ( is_string( $padding ) ) {
	$padding_value = $resolve_css_value( $padding );

	if ( $padding_value ) {
		$content_styles[] = 'padding: ' . $padding_value;
	}
} elseif ( is_array( $padding ) ) {
	foreach ( array( 'top', 'right', 'bottom', 'left' ) as $side ) {
		$padding_value = $resolve_css_value( $padding[ $side ] ?? '' );

		if ( $padding_value ) {
			$content_styles[] = 'padding-' . $side . ': ' . $padding_value;
		}
	}
}

// Cards created before this became a dynamic block still contain the complete
// former card markup in $content. Retain only their InnerBlocks markup before
// rendering the new card shell, otherwise the old header is rendered again.
if ( str_contains( $content, 'ctx__card-header' ) && str_contains( $content, 'ctx__card-content' ) ) {
	$legacy_content_match = array();

	if (
		preg_match(
			'~<div\\b[^>]*class=("|\\\')[^"\\\']*\\bctx__card-content\\b[^"\\\']*\\1[^>]*>(.*)</div>\\s*</(?:a|div)>\\s*$~si',
			$content,
			$legacy_content_match
		)
	) {
		$content = $legacy_content_match[2];
	}
}

$classes = array( 'ctx__card' );

if ( 'horizontal' === $orientation ) {
	$classes[] = 'ctx__card-horizontal';
}

if ( ! empty( $attributes['url'] ) || ! empty( $attributes['hover'] ) ) {
	$classes[] = 'ctx__card-hover';
}

if ( ! empty( $attributes['shadow'] ) ) {
	$classes[] = 'ctx__card-shadow';
}

if ( ! $image_id && ! $image_url ) {
	$classes[] = 'ctx__card-no-image';
}

if ( ! empty( $attributes['customHoverColor'] ) ) {
	$classes[] = 'ctx__card-hover-custom';
}

$extra_styles = array( 'padding: 0 !important' );

if ( ! empty( $attributes['fullHeight'] ) ) {
	$extra_styles[] = 'height: 100%';
}

if ( ! empty( $attributes['customHoverColor'] ) ) {
	$extra_styles[] = '--hover-color: ' . sanitize_text_field( $attributes['customHoverColor'] );
}

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => implode( ' ', $classes ),
		'style' => implode( '; ', $extra_styles ),
	)
);

$focal_point_style = '';

if ( isset( $attributes['focalPoint']['x'], $attributes['focalPoint']['y'] ) ) {
	$x                 = min( 1, max( 0, (float) $attributes['focalPoint']['x'] ) );
	$y                 = min( 1, max( 0, (float) $attributes['focalPoint']['y'] ) );
	$focal_point_style = 'object-position: ' . ( $x * 100 ) . '% ' . ( $y * 100 ) . '%;';
}

$image = '';

if ( $image_id ) {
	$image_attributes = array();

	if ( '' !== $image_alt ) {
		$image_attributes['alt'] = $image_alt;
	}

	if ( $focal_point_style ) {
		$image_attributes['style'] = $focal_point_style;
	}

	$image = wp_get_attachment_image( $image_id, 'large', false, $image_attributes );
}

// Preserve the image for legacy cards where the attachment was removed but
// a URL is still stored. Attachment IDs always use the responsive API above.
if ( ! $image && $image_url ) {
	$image = sprintf(
		'<img src="%1$s" alt="%2$s"%3$s />',
		esc_url( $image_url ),
		esc_attr( $image_alt ),
		$focal_point_style ? ' style="' . esc_attr( $focal_point_style ) . '"' : ''
	);
}

$accent_class = '';

if ( ! empty( $attributes['accentColor'] ) && ! str_contains( $attributes['accentColor'], '(' ) ) {
	$accent_class = ' has-' . sanitize_html_class( $attributes['accentColor'] ) . '-background-color';
}

$accent_style = ! empty( $attributes['customAccentColor'] )
	? ' style="background: ' . esc_attr( $attributes['customAccentColor'] ) . ';"'
	: '';

$tag = ! empty( $attributes['url'] ) ? 'a' : 'div';

echo '<' . $tag . ' ' . $wrapper_attributes;

if ( 'a' === $tag ) {
	echo ' href="' . esc_url( $attributes['url'] ) . '"';

	if ( ! empty( $attributes['opensInNewTab'] ) ) {
		echo ' target="_blank"';
	}

	if ( ! empty( $attributes['rel'] ) ) {
		echo ' rel="' . esc_attr( $attributes['rel'] ) . '"';
	}
}

echo '>';
echo '<div class="ctx__card-header">';

if ( ! empty( $attributes['badgeText'] ) ) {
	echo '<b class="ctx__card-badge' . esc_attr( $accent_class ) . '"' . $accent_style . '>' . esc_html( $attributes['badgeText'] ) . '</b>';
}

echo $image;

if ( ! empty( $attributes['labelText'] ) ) {
	echo '<label class="ctx__card-label' . esc_attr( $accent_class ) . '"' . $accent_style . '>' . esc_html( $attributes['labelText'] ) . '</label>';
}

echo '</div>';
echo '<div class="ctx__card-content"';

if ( $content_styles ) {
	echo ' style="' . esc_attr( implode( '; ', $content_styles ) ) . '"';
}

echo '>';
echo $content;
echo '</div>';
echo '</' . $tag . '>';
