<?
	require_once('lib/blockdefs.inc.php');

	echo "function getBlockStrength(blockNo) {\n";
	foreach ($g_blocdefs as $code => $blockdef) {
		echo "if (blockNo == $id) return $strength; \n";
	echo "return 30;\n";
	echo "}";
