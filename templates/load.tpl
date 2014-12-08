{section name="y" start=0 loop=$field->GetHeight() step=1}
{section name="x" start=0 loop=$field->GetWidth()
				step=1}{$field->Get($smarty.section.x.index,
				$smarty.section.y.index)|string_format:"%02u"}{/section}

{/section}

