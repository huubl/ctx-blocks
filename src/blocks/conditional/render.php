<?php

/**
 * @var array<string, mixed> $attributes
 * @var string               $content
 */

// Keep the date behaviour in sync with the editor preview: an empty boundary
// represents an open-ended range.
$from_date = $attributes['fromDate'] ?? '';
$to_date   = $attributes['toDate'] ?? '';
$from      = $from_date ? strtotime( $from_date ) : strtotime( '1970-01-01' );
$to        = $to_date ? strtotime( $to_date ) : strtotime( '2100-01-01' );
$now       = time();

$is_within_date_range = $now >= $from && $now <= $to;
$hide_for_date        = ! empty( $attributes['hideWithinDateRange'] )
	? $is_within_date_range
	: ! $is_within_date_range;

if ( $hide_for_date ) {
	return;
}

if ( ! empty( $attributes['usersOnly'] ) && ! is_user_logged_in() ) {
	return;
}

// Device visibility is handled in CSS so it can react to the visitor's
// viewport. Add a wrapper only when one of the corresponding rules is active.
$classes = array();

if ( ! empty( $attributes['hideOnMobile'] ) ) {
	$classes[] = 'ctx-conditional--hide-mobile';
}

if ( ! empty( $attributes['hideOnDesktop'] ) ) {
	$classes[] = 'ctx-conditional--hide-desktop';
}

if ( $classes ) {
	echo '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
	echo $content;
	echo '</div>';
	return;
}

echo $content;
