<?
class Field
{
	private $m_width = 0;
	private $m_height = 3;

	public function Field($width, $height)
	{
		$this->m_height = $height;
		{
			/*
			for($x = 0; $x < $this->m_width; ++$x)
			{
				$this->Set($x, $y, B_BLANK);
			}*/
		}
	}

	public function Set($x, $y, $brick)
	{

	public function Get($x, $y)
	{
		return $this->m_cells[$y][$x];
	}

	/*
	public function SetFieldText($text) {
		$this->m_height = count($lines);

		$row = 0;
		foreach ($lines as $line) {
				$this->Set($i, $row, $val);
			}
			++$row;
		}
	*/

	public function GetFieldText() {
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