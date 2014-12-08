<?
	define(B_BLANK, '  ');
	define(B_STONE, '01');
	define(B_GROUND, '02');
	define(B_GROUNDGRASS, '03');
	define(B_BRIDGE, '04');
	define(B_WALL_WITH_WINDOW, '05');
	define(B_FENCE, '06');
	define(B_APPLE, '07');
	define(B_BRICK, '08');
	define(B_TREE_LEAVES, '11');
	define(B_TREE_TRUNK, '12');
	define(B_DIAMOND_SMALL, '14');
	define(B_GRANITE, '15');
	define(B_CLAY, '16');
	define(B_SAND, '17');
	define(B_DARK_GROUND, '18');

	// literal ID, position in picture,
	// 	strength in distruction cycles (30 cycles = 1 sec)
	$g_blocdefs = array(
		B_STONE => array(1, 50),
		B_GROUND => array(2, 10),
		B_GROUNDGRASS => array(3, 10),
		B_BRIDGE => array(4, 20),
		B_FENCE => array(6, 30),
		B_APPLE => array(7, 20),
		B_BRICK => array(8, 60),
		B_TREE_LEAVES => array(11, 5),
		B_TREE_TRUNK => array(12, 30),
		B_DIAMOND_SMALL => array(14, 30),
		B_GRANITE => array(15, 90),
		B_CLAY => array(16, 50),
		B_SAND => array(17, 20),
		B_DARK_GROUND => array(18, 0),
	);

