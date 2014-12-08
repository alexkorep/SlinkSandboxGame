<?
class Field
{	private $m_cells;
	private $m_width = 0;
	private $m_height = 3;

	public function Field($width, $height)
	{		$this->m_width = $width;
		$this->m_height = $height;		for ($y = 0; $y < $this->m_height; ++$y)
		{			$this->m_cells[$y] = array_fill(0, $this->m_width, B_BLANK);
			/*
			for($x = 0; $x < $this->m_width; ++$x)
			{
				$this->Set($x, $y, B_BLANK);
			}*/
		}
	}

	public function Set($x, $y, $brick)
	{		$this->m_cells[$y][$x] = $brick;	}

	public function Get($x, $y)
	{
		return $this->m_cells[$y][$x];
	}

	/*
	public function SetFieldText($text) {		$lines = split("\n", $text);
		$this->m_height = count($lines);

		$row = 0;
		foreach ($lines as $line) {			for ($i = 0; $i < strlen($line); ++$i) {				// todo: there are 2 chars per block, not 1				$val = $line[$i];
				$this->Set($i, $row, $val);
			}
			++$row;			$this->m_width = (strlen($line) - 1)/FIELD_CHAR_PER_CELL;
		}	}
	*/

	public function GetFieldText() {		$result = '';		for ($y = 0; $y < $this->m_height; ++$y)
		{
			for($x = 0; $x < $this->m_width; ++$x)
			{
				$result .= $this->Get($x, $y);
			}
			$result .= "\n";
		}
		return $result;
	}
}
