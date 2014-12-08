<?
	require_once('lib/auth.inc.php');
	require_once('lib/level.inc.php');
	require_once('lib/smarty/Smarty.class.php');

	$smarty = new Smarty();

	$user_id = CAuth::GetCurrentUserId();
	$levels = CLevel::GetLevelList($user_id);
	$smarty->assign('levels', $levels);
	$smarty->display('levels.tpl');