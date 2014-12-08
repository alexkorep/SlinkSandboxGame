window.onunload = function() {
	// We are loading current level in order to save it
	// prior to loading
	var levelX = theLevelPosition.x;
	var levelY = theLevelPosition.y;
	LoadLevel(levelX, levelY, function(){});
}

function SaveLevel(levelX, levelY) {
	var data = maze.GetTilesEncodedToString();
	var items = theHUD.GetItemsEncodedToSting();
	postData(data, items);
	return false;
}

/// @param completeFn(levelText) - function to be called when load is complete
function LoadLevel(levelX, levelY, completeFn) {
	//alert(levelX + '-' + levelY);
	var req = getXmlHttp();
	var statusdiv = document.getElementById('statusdiv');
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			if(req.status == 200)
			{
				// status OK
				//var statusdiv = document.getElementById('statusdiv');
				var levelText = req.responseText;
				//alert(levelText);
				//statusdiv.innerHTML = levelText;
				completeFn(levelText);
			}
			else
			{
				statusdiv.innerHTML = 'Ошибка сервера: ' + req.statusText // показать статус (Not Found, ОК..)
			}
		}

	}

	req.open('POST', 'load.php?levelid=' + theLevelId, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var post = 'x=' + encodeURIComponent(levelX) + 
		'&y=' + encodeURIComponent(levelY);

	// Saving current level
	if (maze) {
		var data = maze.GetTilesEncodedToString();
		//alert(data);
		var items = theHUD.GetItemsEncodedToSting();
		
		post += '&data=' + encodeURIComponent(data) + 
			'&items=' + encodeURIComponent(items) +
			'&oldx=' + encodeURIComponent(theLevelPosition.x) +
			'&oldy=' + encodeURIComponent(theLevelPosition.y);
	}
	//alert(maze);

	req.send(post);

	//statusdiv.innerHTML = '<img src="res/wait.gif" width="30" height="30" border="0"/>';
	//statusdiv.innerHTML = levelX + ',' + levelY;
}


var isLoadingLevelToMaze = false;

// Loads level and puts it to the maze
// th - player object
/// @param stopWalking in, boolean, if true then mousehandler walking is stopped
function LoadLevelToMaze(levelX, levelY, th, playerX, playerY, stopWalking) {
	
	if (isLoadingLevelToMaze) {
		return;
	}
	
	isLoadingLevelToMaze = true;
	//alert('isLoadingLevelToMaze = ' + isLoadingLevelToMaze);
	//statusdiv.innerHTML = this.inx;
	
	LoadLevel(levelX, levelY, function(levelText){
		statusdiv.innerHTML = levelText;
		maze.LoadMaze(levelText);
		//alert(levelText);
		theLevelPosition.x = levelX;
		theLevelPosition.y = levelY;
		th.x = playerX;
		th.y = playerY;
		if (stopWalking) {
			mousehandler.walking.stop();
		}
		
		// update level pos on the screen
		maingame.hud.setValue('levelpos_widget', 'value', '(' + levelX + ',' + levelY + ')');
		maingame.hud.redraw();
		isLoadingLevelToMaze = false;
		//alert('Load finished: ' + isLoadingLevelToMaze);
		//alert('isLoadingLevelToMaze = ' + isLoadingLevelToMaze);
	})
}

function NewLevel() {
	if (confirm('Все изменения с момента последнего сохранения будут утеряны.\nВы уверены, что хотите начать новый уровень?'))
	{
		window.location.href="index.php";
	}
}

function getXmlHttp()
{
	var xmlhttp;
	try
	{
		xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	}
	catch (e)
	{
		try
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (E)
		{
			xmlhttp = false;
		}
	}
	if (!xmlhttp && typeof XMLHttpRequest!='undefined')
	{
		xmlhttp = new XMLHttpRequest();
	}
	return xmlhttp;
}

function postData(data, items)
{
	var req = getXmlHttp();
	var statusdiv = document.getElementById('statusdiv');
	req.onreadystatechange = function()
	{
		if (req.readyState == 4)
		{
			if(req.status == 200)
			{
				// status OK
				statusdiv.innerHTML = req.responseText;
			}
			else
			{
				statusdiv.innerHTML = 'Ошибка сервера: ' + req.statusText // показать статус (Not Found, ОК..)
			}
		}

	}

	req.open('POST', 'save.php?levelid=' + theLevelId, true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	var post = 'data=' + encodeURIComponent(data) + 
		'&items=' + encodeURIComponent(items);
	req.send(post);

	statusdiv.innerHTML = '<img src="res/wait.gif" width="30" height="30" border="0"/>';
}

function Help() {
	$('#help-dialog').dialog({ 
		buttons: [
			{ text: "Закрыть", click: function() { $(this).dialog("close"); } }
		],
		width: 560
	});
}

