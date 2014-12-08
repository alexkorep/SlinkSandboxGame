<?
	require_once('lib/smarty/Smarty.class.php');
	require_once('lib/config.inc.php');
	require_once('lib/db.inc.php');
	require_once('lib/auth.inc.php');
	require_once('lib/leveldbstorage.inc.php');

	// todo: security check is needed here
	$levelid = $_GET['levelid'];
	if (!$levelid) {		$levelid = uniqid();
		header("Location: .?levelid=$levelid\n");	}

	$storage = new LevelDbStorage($levelid);
	$items = $storage->LoadItems($levelid);
	//print_r($items);
	//die();

	$smarty = new Smarty();
	$smarty->assign('levelid', $levelid);
	$smarty->assign('items', $items);
	$smarty->assign('xpos', 0);
	$smarty->assign('ypos', 0);
	$smarty->display('index.tpl');