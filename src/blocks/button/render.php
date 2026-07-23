<?php

/**
 * @var array{
 *     action?: string,
 *     url?: string,
 *     newTab?: bool,
 *     iconOnly?: bool,
 *     iconRight?: bool,
 *     icon?: string,
 * } $attributes
 * 
 * @var string $content
 */

$tag = $attributes['action'] === 'link' && $attributes['url'] ? 'a' : 'button';
$id = uniqid();
$href = $attributes['url'] ? 'href="' . $attributes['url'] . '"' : '';
$target = $attributes['newTab'] ? 'target="_blank"' : '';
$button_id = $attributes['action'] == "modal" ? "data-modal=\"{$id}\"" : "id=\"{$id}\"";

$classNames = [
	'ctx__button',
	$attributes['iconOnly'] ? 'ctx__button--icon-only' : '',
	$attributes['iconRight'] ? 'ctx__button--reverse' : '',
];

$block_attributes = get_block_wrapper_attributes(['class' => join(" ", $classNames)]);

echo "<div class='button-container'>";
echo '<' . join(" ", [$tag, $href, $block_attributes, $button_id, $target]) . '>';

if($attributes['icon']) {
	$selected_icon = WP_Icons_Registry::get_instance()->get_registered_icon( (string) $attributes['icon'] );
	//var_dump($selected_icon);
	if ( ! empty( $selected_icon['file_path'] ) ) {
		$icon_content = file_get_contents( $selected_icon['file_path'] );
		echo '<span class="ctx-icon">' . $icon_content . '</span>';
	} else {
		echo '<span class="ctx-icon"></span>';
	}
} 
if(!$attributes['iconOnly']) {
	echo "{$attributes['title']}";
}


echo '</' . $tag . '>';
echo "</div>";
if($attributes['script']) {
	$command = 'classList.add("ctx-button-hidden");';
	switch ($attributes['script']) {
		case 'toggle':
			$command = 'classList.toggle("ctx-button-hidden");';
			break;
		case 'show':
			$command = 'classList.remove("ctx-button-hidden");';
			break;
		case 'hide':
			$command = 'classList.add("ctx-button-hidden");';
			break;
		case 'scroll':
			$command = 'scrollIntoView({behavior: "smooth"});';
		default:
			return '';
	}
	$script = 'document.getElementById("'.$attributes['scriptTarget'].'")?.' . $command ;
	

	add_action('wp_footer', function() use ($script, $id) {
		?>
		<script>
			document.addEventListener("DOMContentLoaded", function() {
				document.getElementById("<?php echo $id ?>").addEventListener("click", function() {
					<?php echo $script; ?>
				});
			});
		</script>
		<?php
	});

}

if($attributes['action'] == "modal") {
	add_action('wp_footer', function() use ($attributes, $content, $id) {
		?>
		<div id="<?php echo $id ?>" class="modal"> 
			
			
			<div class="modal__dialog">
				<div class="modal__header">
					<div class="modal__title"><h2><?php echo $attributes['modalTitle']; ?></h2><button @click="showModal = false" class="modal__close"></button></div>
					
				</div>
				<div class="modal__content">
					
						<?php echo $content; ?>
						
				</div>
			</div>
		</div> 
		<?php
	});
}
