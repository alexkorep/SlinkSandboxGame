<?
	require_once('leveldef.inc.php');

	$cache = '';

	class LevelTextUtil {
		public static function getRow($text, $y) {
			// TODO: Optimize, split is too slow
			//
			/*
			$pos = 0;
			for ($i = 0; $i < $y; ++$i) {
				$pos = strpos($text, '\n', $pos + 1);
			}

			$posEnd = strpos($text, '\n', $pos + 1);
			return $posEnd === false ? substr($text, $pos) :
				substr($text, $pos, $posEnd - $pos);
			*/
			global $cache;
			if ($cache){				return $cache[$y];			}

			$lines = split("\n", $text);
			$line = $lines[$y];
			return $line;
		}

		public static function getRowMiddle($text, $y, $row_start, $row_len) {
			$row = self::getRow($text, $y);
			$pos = $row_start*FIELD_CHAR_PER_CELL;
			$len = $row_len*FIELD_CHAR_PER_CELL;
			return substr($row, $pos, $len);
		}

		public static function getBrick($text, $x, $y) {
			$line = self::getRow($text, $y);
			$pos = $x*FIELD_CHAR_PER_CELL;
			$result = substr($line, $x*FIELD_CHAR_PER_CELL, FIELD_CHAR_PER_CELL);
			return $result;
		}

		public static function setRow(&$text, $y, $row) {
			$lines = split("\n", $text);
			$lines[$y] = $row;
			$text = implode("\n", $lines);

			global $cache;
			if (!$cache) {				$cache = $lines;			} else {				$cache[$y] = $row;			}
		}

		public static function setBrick(&$text, $x, $y, $brick) {			$line = self::getRow($text, $y);
			$pos = $x*FIELD_CHAR_PER_CELL;
			//die($brick);
			for ($i = 0; $i < FIELD_CHAR_PER_CELL; ++$i) {
				$line[$pos + $i] = $brick[$i];
			}
			//die($line);
			self::setRow($text, $y, $line);
			//die($text);
		}
	}