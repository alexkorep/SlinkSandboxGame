<?
	require_once('lib/leveldef.inc.php');

	//input format:
	// items - list of sourse items, e.g. '000100'
	// output format
	// list of result items, e.g.: '  00  '

	$g_casts = array(
		// brick block
		B_DIAMOND_SMALL . B_GROUND . B_DIAMOND_SMALL =>
			B_DIAMOND_SMALL . B_BRICK . B_BLANK,

		// bridge
		B_DIAMOND_SMALL . B_TREE_TRUNK . B_TREE_TRUNK . B_TREE_TRUNK . B_DIAMOND_SMALL =>
			B_DIAMOND_SMALL . B_BRIDGE . B_BRIDGE . B_BRIDGE . B_DIAMOND_SMALL,

		// fence
		B_DIAMOND_SMALL . B_TREE_TRUNK . B_TREE_TRUNK .B_DIAMOND_SMALL =>
			B_DIAMOND_SMALL . B_FENCE . B_FENCE . B_DIAMOND_SMALL,
	);

	$items = $_POST['items'];

	foreach ($g_casts as $source => $result) {		if ($items == $source) {			echo $result;
			die();		}	}