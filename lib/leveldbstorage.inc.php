<?
	require_once('worldheights.inc.php');

	class LevelDbStorage {		private $levelid;

		public function LevelDbStorage($levelid) {			$this->levelid = $levelid;
		}

		private function loadLevelRow() {			global $db_table_prefix;
			$levelid = mysql_escape_string($this->levelid);
			$sql = "select *
				from
					{$db_table_prefix}level
				where
					level_id = '$levelid'";
			$row = db_load_row($sql);
			return $row;
		}

		function Load() {
			$row = $this->loadLevelRow();
			return $row ? $row['data'] : '';
		}

		function LoadItems() {
			$row = $this->loadLevelRow();
			return $row ? $row['items'] : '';
		}


		public function Save($text, $items) {
			global $db_table_prefix;
			//print_r($this);
			$levelid = mysql_escape_string($this->levelid);
			$text = mysql_escape_string($text);
			$items = mysql_escape_string($items);

			// Saving level to DB
			$level = $this->Load();
			if (!$level) {
				$sql = "insert into {$db_table_prefix}level
						(data, level_id, items)
					values
						('$text', '$levelid', '$items')";
			} else {
				$sql = "update {$db_table_prefix}level
						set
							data = '$text',
							items = '$items'
						where
							level_id = '$levelid'";
			}
			//echo "[$sql]";
			db_execute($sql);
		}
	}
