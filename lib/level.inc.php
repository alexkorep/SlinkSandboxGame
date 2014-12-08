<?
	require_once('leveltextutil.inc.php');

	class CLevel {		var $storage;
		var $width;
		var $height;
		public function CLevel($storage, $width, $height) {			$this->storage = $storage;
			$this->width = $width;
			$this->height = $height;		}

		private function getLevelNeighbours($x, $y) {			$levelText = array();
			for ($dx = -1; $dx <= 1; ++$dx)
			{
				for ($dy = -1; $dy <= 1; ++$dy)
				{
					$levelText[$dy][$dx] = $this->storage->Load($x + $dx, $y + $dy);
				}
			}
			return $levelText;
		}

		public function GetLevelText($levelid) {			$levelText = $this->getLevelNeighbours($x, $y);
			//die("$levelText");

			$width = $this->width;
			$height = $this->height;

			// Getting middle level surrouned by bricks from neighbours
			$text = '';
			$text .= LevelTextUtil::getBrick($levelText[-1][-1], $width - 1, $height - 1) .
				LevelTextUtil::getRow($levelText[-1][0], $height - 1) .
				LevelTextUtil::getBrick($levelText[-1][1], 0, $height - 1) . "\n";
			for ($i = 0; $i < $height; ++$i) {				$text .= LevelTextUtil::getBrick($levelText[0][-1], $width - 1, $i) .
					LevelTextUtil::getRow($levelText[0][0], $i) .
					LevelTextUtil::getBrick($levelText[0][1], 0, $i) . "\n";
			}
			$text .= LevelTextUtil::getBrick($levelText[1][-1], $width - 1, 0) .
				LevelTextUtil::getRow($levelText[1][0], 0) .
				LevelTextUtil::getBrick($levelText[1][1], 0, 0) . "\n";

			return $text;
		}

		public function SaveLevelText($text, $x, $y) {			$levelText = $this->getLevelNeighbours($x, $y);
			$width = $this->width;
			$height = $this->height;
			$full_width = $this->width + 2;
			$full_height = $this->height + 2;

			//die(LevelTextUtil::getBrick($text, 0, 0));
			// top left
			LevelTextUtil::setBrick($levelText[-1][-1], $width - 1, $height - 1,
				LevelTextUtil::getBrick($text, 0, 0));

			// top middle
			LevelTextUtil::setRow($levelText[-1][0], $height - 1,
				LevelTextUtil::getRowMiddle($text, 0, 1, $full_width - 2));

			// right top
			LevelTextUtil::setBrick($levelText[-1][1], 0, $height - 1,
				LevelTextUtil::getBrick($text, $full_width - 1, 0));

			for ($row = 0; $row < $height; ++$row) {				// middle left				LevelTextUtil::setBrick($levelText[0][-1], $width - 1, $row,
					LevelTextUtil::getBrick($text, 0, $row + 1));

				// middle center
				LevelTextUtil::setRow($levelText[0][0], $row,
					LevelTextUtil::getRowMiddle($text, $row + 1, 1, $full_width - 2));

				// middle right
				LevelTextUtil::setBrick($levelText[0][1], 0, $row,
					LevelTextUtil::getBrick($text, $full_width - 1, $row + 1));
			}

			// left bottom
			LevelTextUtil::setBrick($levelText[1][-1], $width - 1, 0,
				LevelTextUtil::getBrick($text, 0, $full_height - 1));

			// bottom middle
			LevelTextUtil::setRow($levelText[1][0], 0,
				LevelTextUtil::getRowMiddle($text, $full_height - 1, 1, $full_width - 2));

			// right bottom
			LevelTextUtil::setBrick($levelText[1][1], 0, 0,
				LevelTextUtil::getBrick($text, $full_width-1, $full_height - 1));

			//  Saving results
			for ($dx = -1; $dx <= 1; ++$dx)
			{
				for ($dy = -1; $dy <= 1; ++$dy)
				{
					$this->storage->Save($x + $dx, $y + $dy, $levelText[$dy][$dx]);
				}
			}
		}
	}