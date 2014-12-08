<html>
<head>
	<script>
		theItems = [{$items|default:"[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]"}];
		theLevelId = '{$levelid}';
		theLevelPosition = {literal}{{/literal}
			x: {$xpos},
			y: {$ypos}
		{literal}}{/literal};

	</script>

	<link rel="stylesheet" href="css/jquery-ui-1.8.13.custom.css" type="text/css" />

	<script type="text/javascript" src="js/jquery-1.5.1.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.8.13.custom.min.js"></script>

	<script type="text/javascript" src="akihabara/gbox.js"></script>
	<script type="text/javascript" src="akihabara/iphopad.js"></script>
	<script type="text/javascript" src="akihabara/trigo.js"></script>
	<script type="text/javascript" src="akihabara/toys.js"></script>
	<script type="text/javascript" src="akihabara/help.js"></script>
	<script type="text/javascript" src="akihabara/tool.js"></script>
	<script type="text/javascript" src="akihabara/gamecycle.js"></script>
	<script type="text/javascript" src="akihabara/mouse.js" ></script>
	<style>BODY { -webkit-user-select:none; margin:0px}</style>
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
	<script type="text/javascript" src="js/maze.js"></script>
	<script type="text/javascript" src="js/player.js"></script>
	<script type="text/javascript" src="js/mousehandler.js"></script>
	<script type="text/javascript" src="js/mousepointer.js"></script>
	<script type="text/javascript" src="js/fieldborderhandler.js"></script>
	<script type="text/javascript" src="js/hud.js"></script>
	<script type="text/javascript" src="js/gameoptions.js"></script>
	<script type="text/javascript" src="js/menu.js"></script>
	<script type="text/javascript" src="js/cast.js"></script>
	<script type="text/javascript" src="js/game.js"></script>
	<script type="text/javascript" src="js/blocks.js"></script>
	<script type="text/javascript" src="js/timeofday.js"></script>
	<script type="text/javascript" src="js/monster.js"></script>
	<script type="text/javascript" src="js/coin.js"></script>

</head>
<body>

{include file="helpdlg.tpl"}

</body>
</html>