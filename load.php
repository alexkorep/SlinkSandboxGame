<?
	$g_startPageBuild = microtime(true);

	require_once('lib/config.inc.php');
	require_once('lib/db.inc.php');
	require_once('lib/leveldef.inc.php');
	require_once('lib/LandscapeBuilder.inc.php');
	require_once('lib/leveldbstorage.inc.php');
	require_once('lib/items.inc.php');

	$x = intval($_POST['x']);
	$y = intval($_POST['y']);
	$oldx = intval($_POST['oldx']);
	$oldy = intval($_POST['oldy']);

	$levelid = $_GET['levelid'];

	$storage = new LevelDbStorage($levelid);


	/*
	$data = $_POST['data'];
	if ($data) {
		$level->SaveLevelText($data, $oldx, $oldy);
		//echo "xxx";
		//die($data);
	}

	$items = $_POST['items'];
	if ($items) {		Items::Save($user_id, $items);	}
	*/

	$text = $storage->Load();
	if (!$text) {
		$builder = new LandscapeBuilder(FIELD_WIDTH, FIELD_HEIGHT);
		$text = $builder->Build(WORLD_TOP_HEIGHT, WORLD_TOP_HEIGHT,
			WORLD_BOTTOM_HEIGHT, WORLD_BOTTOM_HEIGHT);
	}
	echo $text;


	//echo "[" . sprintf("%1.3f", microtime(true) - $g_startPageBuild);