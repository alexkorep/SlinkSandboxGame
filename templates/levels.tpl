{capture name=content}

	<ul>
	{foreach from=$levels item=level name=levels}
		<li><a href="index.php?level_id={$level.level_id}">{$level.level_name|escape:"html"}</a></li>
	{/foreach}
	</ul>

{include file="page.tpl" content=$smarty.capture.content}