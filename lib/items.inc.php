<?
	class Items {		public static function Save($user_id, $items) {			global $db_table_prefix;
			$user_id = mysql_escape_string($user_id);
			$items = mysql_escape_string($items);
			$oldItems = self::Load($user_id);
			if (!$oldItems) {
				$sql = "insert into {$db_table_prefix}items
						(user_id, items)
					values
						('$user_id', '$items')";
			} else {
				$sql = "update {$db_table_prefix}items
						set
							items = '$items'
						where
							user_id = '$user_id'";
			}

			db_execute($sql);
		}

		public static function Load($user_id) {			global $db_table_prefix;
			$user_id = mysql_escape_string($user_id);
			$sql = "select *
				from
					{$db_table_prefix}items
				where
					user_id = '$user_id'";
			$row = db_load_row($sql);
			return $row ? $row['items'] : '';
		}	}