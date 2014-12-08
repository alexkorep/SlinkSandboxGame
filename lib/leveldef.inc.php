<?

require_once('blockdefs.inc.php');

define(FIELD_CHAR_PER_CELL, 2);



//define(FIELD_WIDTH, 16);
//define(FIELD_HEIGHT, 10);
//define(FIELD_WIDTH, 18);
//define(FIELD_HEIGHT, 11);
define(FIELD_WIDTH, 100);
define(FIELD_HEIGHT, 100);

// Minimum piece after which Landscape Builder will stop calculation
define(LANDSCAPE_BUILDER_MIN_W, 2);
define(LANDSCAPE_BUILDER_MIN_H, 2);

define(WORLD_TOP_HEIGHT, 0); // minimal landscape height for landscape builder
define(WORLD_BOTTOM_HEIGHT, FIELD_HEIGHT/FIELD_WIDTH*count($g_brick_heights) + 10); // maximal landscape height for landscape builder

$g_brick_heights = array(
	//B_BLANK, B_BLANK, B_BLANK, B_TREE_LEAVES, B_SAND, B_GROUND,
	//B_CLAY, B_BLANK, B_STONE, B_GRANITE, B_GRANITE, B_GRANITE, B_BLANK, B_GRANITE,
	//B_GRANITE, B_GRANITE
	B_BLANK, B_BLANK, B_TREE_LEAVES, B_GROUND, B_BLANK, B_DARK_GROUND, B_BLANK, B_GROUND,
	B_GROUND, B_GROUND, B_BLANK, B_DARK_GROUND, B_BLANK, B_GROUND,
);
define(LANDSCAPE_MAX_HEIGHT, count($g_brick_heights)); // maximum landscape height for landscape builder

$g_plants = array(
	// brick code, english name, russian name, min depth, max depth
	array(
		'code' => B_APPLE,
		'en_name' => 'apple',
		'ru_name' => 'Яблоко',
		'min_z' => 0,
		'max_z' => 3),

	array(
		'code' => B_TREE_TRUNK,
		'en_name' => 'trunk',
		'ru_name' => 'Ствол дерева',
		'min_z' => 0,
		'max_z' => 5),

	array(
		'code' => B_DIAMOND_SMALL,
		'en_name' => 'diamond_small',
		'ru_name' => 'Бриллиант',
		'min_z' => LANDSCAPE_MAX_HEIGHT-2,
		'max_z' => LANDSCAPE_MAX_HEIGHT),
);


// Landscape builder defines
//
define('BUILDER_MIN_W', 3);