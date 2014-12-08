<?
	class TreeGenerator {
		public static function Generate(&$field, $height, $x0, $y0)
		{
			for ($i = 0; $i < $height; ++$i)
			{
				LevelTextUtil::setBrick($field, intval($x0), intval($y0-$i), B_TREE_TRUNK);
			}

			// crona size
			$radius = $height/2;
			for ($x = -$height/2; $x < $height/2; ++$x)
			{
				for ($y = -$height/2; $y < $height/2; ++$y)
				{
					if ($x*$x + $y*$y < $radius*$radius)
					{
						//echo "$x*$x + $y*$y < $radius*$radius]	";
						LevelTextUtil::setBrick($field,
							intval($x0 + $x), intval($y0 - $y - $height),
							B_TREE_LEAVES);
					}
				}
			}
			//die();
		}
	}
