<?
	require_once('leveldef.inc.php');
	require_once('tree.inc.php');
	require_once('field.inc.php');

	class LandscapeBuilder {		private $field;
		private $width;
		private $height;
		public function LandscapeBuilder($width, $height) {			$this->field = new Field($width, $height);
			$this->width = $width;
			$this->height = $height;
			//print_r($this->field);
			//die();
		}

		private function setFieldBrick($x, $y, $brick) {			//LevelTextUtil::setBrick($this->field, 0, $y, B_STONE);
			$this->field->Set($x, $y, $brick);
			//echo "$x, $y, $brick<br/>";		}

		private function getFieldBrick($x, $y) {			return $this->field->Get($x, $y);		}

		private function generateTree($x, $y) {			$treeShouldBeHere = rand(0, 5) < 1;
			if ($y < 5 || $x < 5 || $x >= FIELD_WIDTH - 5 || !$treeShouldBeHere) {				return;			}
			$height = rand(1, $y - 1);
			TreeGenerator::Generate($this->field, $height, $x, $y);
		}

		private function buildPlants($heights) {			global $g_plants;
			$level = intval(abs($avgZ)) % 100;			//die("[$level]");
			for ($y = 0; $y <= $this->height - 1; ++$y) {
				for ($x = 0; $x <= $this->width; ++$x) {					$brick = $this->getFieldBrick($x, $y);
					$brick_below = $this->getFieldBrick($x, $y + 1);
					if ($brick == B_BLANK && $brick_below != B_BLANK) {						$height = $heights[$y][$x];
						foreach ($g_plants as $plant) {							if ($height >= $plant['min_z'] &&
								$height <= $plant['max_z'] &&
								rand(0, 100) > 80) {									$this->setFieldBrick($x, $y, $plant['code']);
									//die("[$level]" . $plant['code']);							}						}
					}
				}
			}
		}

		private function buildFrame() {			for ($y = 0; $y <= $this->height - 1; ++$y) {				$this->setFieldBrick(0, $y, B_DARK_GROUND);
				$this->setFieldBrick($this->width - 1, $y, B_DARK_GROUND);			}
			for ($x = 0; $x <= $this->width; ++$x) {				$this->setFieldBrick($x, 0, B_DARK_GROUND);
				$this->setFieldBrick($x, $this->height - 1, B_DARK_GROUND);
			}
		}

		private static function getBrick($height) {			global $g_brick_heights;
			if ($height < 0) {				$height = 0;			} else if ($height > LANDSCAPE_MAX_HEIGHT - 1) {				$height = LANDSCAPE_MAX_HEIGHT - 1;			} else {				$height = round($height);			}
			return $g_brick_heights[$height];

			/*
			$height = abs(round($height))%LANDSCAPE_MAX_HEIGHT;
			//echo "[$height]";
			if (isset($g_brick_heights[round($height)])) {				return $g_brick_heights[round($height)];			}
			return B_BLANK;
			*/		}
		private function buidRange($x1, $y1, $x2, $y2, &$heights)
		{			//echo "$x1, $y1, $x2, $y2<br/>";			if (abs($x2 - $x1) <= LANDSCAPE_BUILDER_MIN_W && abs($y2 - $y1) <= LANDSCAPE_BUILDER_MIN_H)
			{				//$height = round($heights[$y1][$x1]);
				// We are done, remaining range is too small, fill it
				// flat equation: z=ax+by+c
				$a = ($heights[$y2][$x1] - $heights[$y2][$x2])/($x1 - $x2);
				$b = ($heights[$y1][$x1] - $heights[$y1][$x2])/($y1 - $y2);
				$c = $heights[$y1][$x1] - $a*$x1 - $b*$y1;

				for ($y = $y1; $y < $y2; ++$y) {
					for ($x = $x1; $x < $x2; ++$x) {						$height = round($a*$x + $b*$y + $c);
						$heights[$y][$x] = $height;						$brick = self::getBrick($height);
						$this->setFieldBrick($x, $y, $brick);
					}
				}
				return;			}
			$x_center = round(($x2 - $x1)/2) + $x1;
			$y_center = round(($y2 - $y1)/2) + $y1;

			$randW = 10;
			$randH = 10;

			$xdiff = abs($x2 - $x1);
			$ydiff = abs($y2 - $y1);

			$midheight = $xdiff*(rand(-1, 1)*rand(-1, 1))/$randW;
			$heights[$y_center][$x_center] = ($heights[$y1][$x1] + $heights[$y1][$x2] +
				$heights[$y2][$x1] + $heights[$y2][$x2])/4 + $midheight;

			/*
			// Top field depth should be equal to WORLD_TOP_HEIGHT
			if ($y1 <= 0) {
				$heights[$y1][$x_center] = WORLD_TOP_HEIGHT;
			} else {
				$heights[$y1][$x_center] = ($heights[$y1][$x1] + $heights[$y1][$x2])/2 + $xdiff*(rand(-1, 1))/$randW;
			}
			// bottom field depth should be equal to WORLD_BOTTOM_HEIGHT
			if ($y2 >= FIELD_HEIGHT - 1) {
				$heights[$y2][$x_center] = WORLD_BOTTOM_HEIGHT;
			} else {
				$heights[$y2][$x_center] = ($heights[$y2][$x1] + $heights[$y2][$x2])/2 + $xdiff*(rand(-1, 1))/$randW;
			}
			*/

			$heights[$y1][$x_center] = ($heights[$y1][$x1] + $heights[$y1][$x2])/2 + $xdiff*(rand(-1, 1)*rand(-1, 1))/$randW;
			$heights[$y2][$x_center] = ($heights[$y2][$x1] + $heights[$y2][$x2])/2 + $xdiff*(rand(-1, 1)*rand(-1, 1))/$randW;
			$heights[$y_center][$x1] = ($heights[$y1][$x1] + $heights[$y2][$x1])/2 + $xdiff*(rand(-1, 1)*rand(-1, 1))/$randH;
			$heights[$y_center][$x2] = ($heights[$y1][$x2] + $heights[$y2][$x2])/2 + $xdiff*(rand(-1, 1)*rand(-1, 1))/$randH;

			// Correct possible out of range
			//if ($y_center < 0) $y_center = 0;
			//if ($y_center >= $this->height) $y_center = $this->height - 1;
			//echo "y_center = $y_center<br/>";

			//echo "Middles: [$x1, $x_center, $x2]";
			if (abs($x2 - $x1) <= LANDSCAPE_BUILDER_MIN_W) {				$this->buidRange($x1, $y1, $x2, $y_center, $heights);
				$this->buidRange($x1, $y_center, $x2, $y2, $heights);
			} else  if (abs($y2 - $y1) <= LANDSCAPE_BUILDER_MIN_H) {
				$this->buidRange($x1, $y1, $x_center, $y2, $heights);
				$this->buidRange($x_center, $y1, $x2, $y2, $heights);
			} else {
				$this->buidRange($x1, $y1, $x_center, $y_center, $heights);
				$this->buidRange($x_center, $y1, $x2, $y_center, $heights);
				$this->buidRange($x1, $y_center, $x_center, $y2, $heights);
				$this->buidRange($x_center, $y_center, $x2, $y2, $heights);
			}
		}

		public function Build($zTopLeft, $zTopRight, $zBottomLeft, $zBottomRight)
		{			//echo "<pre>";			$x1 = 0;
			$x2 = $this->width - 1;
			$y1 = 0;
			$y2 = $this->height - 1;
			$heights[$y1][$x1] = $zTopLeft;
			$heights[$y1][$x2] = $zTopRight;
			$heights[$y2][$x1] = $zBottomLeft;
			$heights[$y2][$x2] = $zBottomRight;


			$this->buidRange($x1, $y1, $x2, $y2, $heights);

			$this->buildPlants($heights);
			$this->buildFrame();

			//print_r($this->field);
			return $this->field->GetFieldText();

			// Build some testing bricks
			/*
			for ($x = 0; $x < 14; ++$x)
			{				for ($y = 0; $y < $this->m_field->GetHeight()/3; ++$y)
				{					$this->m_field->Set($x, $y + 1, $x);
				}
			}
			*/
		}
	}