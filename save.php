<?
	require_once('lib/config.inc.php');
	require_once('lib/db.inc.php');
	require_once('lib/leveldef.inc.php');
	require_once('lib/leveldbstorage.inc.php');

	$data = $_POST['data'];
	$items = $_POST['items'];

	$levelid = $_GET['levelid'];
	if (!$levelid) {		die('levelid expected!');	}

	$storage = new LevelDbStorage($levelid);
	$storage->Save($data, $items);
	//sleep(5);