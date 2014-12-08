<?
	require_once('lib/blockdefs.inc.php');

	echo "function getBlockStrength(blockNo) {\n";
	foreach ($g_blocdefs as $code => $blockdef) {		$id = $blockdef[0];		$strength = $blockdef[1];
		echo "if (blockNo == $id) return $strength; \n";	}
	echo "return 30;\n";
	echo "}";

