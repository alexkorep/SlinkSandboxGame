<?
	require_once('lib/config.inc.php');
	require_once('lib/db.inc.php');
	require_once('lib/auth.inc.php');

	//$user_id = CAuth::GetCurrentUserId();

	global $db_table_prefix;
	//$user_id = mysql_escape_string($user_id);
	$sql = "delete from
			{$db_table_prefix}level";
	db_execute($sql);

	$sql = "delete from
			{$db_table_prefix}levelz";
	db_execute($sql);
	echo "done";

