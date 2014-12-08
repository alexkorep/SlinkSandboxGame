<?
	class WorldHeights {		private $user_id;

		public function WorldHeights($user_id) {
			$this->user_id = $user_id;
		}
		/// @brief finds Z value of left top level corner
		/// Value is taken from DB. If there is no record in DB, it's
		/// generated recursively using midpoint displacement algorithm.
		/// @param x - int, level X position
		/// @param y - int, level Y position		public function GetLevelZ($x, $y) {			//echo "GetLevelZ($x, $y)<br/>";			$z = $this->getZFromDb($x, $y);
			if ($z === '') {				$z = $this->generateZ($x, $y);
				//die("[$z]");
				$this->saveZToDb($x, $y, $z);			}

			return $z;
		}

		public static function GetParentSquareSize($x) {			if ($x == 0) {				return 0x7FFF;			}			$bit = 0x1;
			while (!($x & $bit)) {
				$bit = $bit << 1;
			}
			return $bit;
		}

		private function generateZ($x, $y) {			if ($y <= -0x7FFF) {				return -100;
			}
			if ($y >= 0x7FFF) {
				return 100;
			}

			if ($x <= -0x7FFF || $x >= 0x7FFF) {
				return $y/0x7FFF*100;
			}

			// calculating width and height of "parent" square
			$width =  self::GetParentSquareSize($x);
			$height =  self::GetParentSquareSize($y);
			//$xLeft =

			//echo "generateZ($x, $y): $width, $height<br/>";
			//flush();
			$randMult = 1;
			if ($width == $height) {				// square center
				$z1 = $this->GetLevelZ($x - $width, $y - $height);
				$z2 = $this->GetLevelZ($x + $width, $y - $height);
				$z3 = $this->GetLevelZ($x - $width, $y + $height);
				$z4 = $this->GetLevelZ($x + $width, $y + $height);
				$result = ($z1 + $z2 + $z3 + $z4)/4 + $width*rand(-1, 1)*$randMult;
			} else if ($width < $height) {				$z1 = $this->GetLevelZ($x - $width, $y);
				$z2 = $this->GetLevelZ($x + $width, $y);
				$result = ($z1 + $z2)/2 + $width*rand(-1, 1)*$randMult/4;
			} else {				$z1 = $this->GetLevelZ($x, $y - $height);
				$z2 = $this->GetLevelZ($x, $y + $height);
				$result = ($z1 + $z2)/2 + $height*rand(-1, 1)*$randMult;
			}
			return $result;
		}

		private function getZFromDb($x, $y) {			global $db_table_prefix;
			$user_id = mysql_escape_string($this->user_id);
			$x = intval($x);
			$y = intval($y);
			$sql = "select *
				from
					{$db_table_prefix}levelz
				where
					user_id = '$user_id' and
					xpos = $x and
					ypos = $y";
			$row = db_load_row($sql);
			return $row ? $row['z'] : '';
		}

		private function saveZToDb($x, $y, $z) {			global $db_table_prefix;
			$user_id = mysql_escape_string($this->user_id);
			$x = intval($x);
			$y = intval($y);
			$z = floatval($z);
			$user_id = mysql_escape_string($this->user_id);

			$sql = "insert into {$db_table_prefix}levelz
					(xpos, ypos, z, user_id)
				values
					($x, $y, $z, $user_id)";
			//die ($sql);
			db_execute($sql);
		}
	}