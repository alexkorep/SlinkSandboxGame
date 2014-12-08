var mousehandler={

	// constants
	m_xThreshold: 2, // clicking this close to the player will not move it.
	
	// Class keeping information about the location where we dig.
	// 
	digging: new function() {
		var progress = 0; // digging progress from 0 to max_progress;
		var max_progress = 4; // when progress = max_progress, digging is finished succesfully
		var x = 0; // tile x in maze (not screen) coordinates
		var y = 0;  // tile y
		var finishFunction; 
		//var temp = 0;
		
		function stop () {
			progress = 0;
		}
		
		// @param i_finishFunction(success) where success is true if we finished 
		// digging succesfully, false if mouse has been released before finish
		this.start = function(i_x, i_y, strength, i_finishFunction) {
			progress = 1;
			finishFunction = i_finishFunction;
			x = i_x;
			y = i_y;
			max_progress = strength;
			
			//temp++;
			//document.getElementById('statusdiv').innerHTML = 'starting ' + temp;
		}
			
		this.tick = function() {
			//var g_progress = 0;
			//g_progress++;
			//document.getElementById('statusdiv').innerHTML = 'dig tick ' + progress;
			
			
			if (progress > 0) {
				progress++;
				
				if (!mouse.isDown) {
					//alert('!');
					finishFunction(false);
					stop();
				}
			}

			if (progress > max_progress) {
				finishFunction(true);
				stop();
			}
		};
			
		this.getProgress = function() {
			return progress;
		},
			
		this.getMaxProgress = function() {
			return max_progress;
		}
		
		this.getPosition = function() {
			return {x: x, y: y};
		}
	},
	
	OnClick: function(th) {
	//	if (mouse.isClicked &&
	//		theHUD.MouseOverTheHud() &&
	//		theHUD.GetSelectedItem() == theHUD.ITEM_WALK ) {
	//		th.paused = !th.paused;
	//	}
	},
	

	isPlayerUnderCursor: function(th, map, tilemap) {
		if (help.xPixelToTile(map, th.x) == help.xPixelToTile(map, mouse.x) &&
			help.yPixelToTile(map, th.y) == help.yPixelToTile(map, mouse.y)) {
			return true;
		}
		return false;
	},
	
	CanHandleTileUnderCursor: function(map, th) {
		var xMouseTile = help.xPixelToTileX(map, mouse.x);
		var yMouseTile = help.yPixelToTileY(map, mouse.y);
		var xPlayerTile = help.xPixelToTileX(map, th.x);
		var yPlayerTile = help.yPixelToTileY(map, th.y);
		var xMaxDistance = 2;
		var yMaxDistance = 3;
		return Math.abs(xMouseTile - xPlayerTile) <= xMaxDistance &&
			Math.abs(yMouseTile - yPlayerTile) <= yMaxDistance;
	},

	handleBrickDestruction:function(th) {
	
		/// Draws an area around a tile using tilemap to a canvas context
		/// @param {Object} tox The canvas context to be drawn on.
		/// @param {Object} data An object containing a set of tilemap data, including:
		/// <ul><li>tileset {String}: (required) the id of the tileset the tilemap is based on</li>
		/// <li>map {Array}: an array whose x and y coord represent the tilemap coordinates, containing integers that correspond to the index of a given tile (or null for no tile)</li></ul>
		/// @param xcenter x-coordinate of area, 
		/// @param ycenter y-coordinate of area, 
		function redrawMapArea(data, xcenter, ycenter) {
			data.RedrawMapArea(xcenter, ycenter);
		}
	
		var map = maze;
		var tilemap = "map";
		
		if (!mouse.isClicked || // theHUD.GetSelectedItem() == theHUD.ITEM_WALK || 
			!this.CanHandleTileUnderCursor(map, th) ||
			(this.isPlayerUnderCursor(th, map, tilemap) &&
			maze.tileIsSolid(th, theHUD.GetSelectedItem()))) 
		{
			return;
		}

		var tile = help.getTileInMap(mouse.x, mouse.y, map, 0, tilemap);

		var x = help.xPixelToTileX(map, mouse.x);
		var y = help.yPixelToTileY(map, mouse.y);
		var tileToChange = help.getTileInMap(mouse.x, mouse.y, map, null, tilemap);
		var newBrick = null;
		if (tileToChange != null) {
			//alert(tileToChange);
			var strength = getBlockStrength(tileToChange);
			if (strength == 0) {
				// unbreakable brick, don't dig it
				return;
			}
			
			this.digging.start(mouse.x, mouse.y, strength, function(success) {
				if (success) {
					// Remove the brick
					// If we have a tile under mouse cursor, let's remove it.
					newBrick = null;
					// add this tile to HUD
					theHUD.AddItem(tileToChange);
					help.setTileInMap(gbox.getCanvasContext("mazecanvas"), map, x, y,
						newBrick, tilemap);
					// let's completely redraw the tiles
					//gbox.blitFade(gbox.getCanvasContext("mazecanvas"), {alpha:1, color: timeofday.getBackgroundColor()});
					//gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"), map); // let's fully redraw it
					redrawMapArea(map, x, y);
				}
			});
			return;
		} else if (theHUD.GetSelectedItem() >=0) {
			// TOdo check if there are enough selected items inthe HUD
			// Set tile to the one currently selected in HUD
			newBrick = theHUD.GetSelectedItem();
			// remove item from the HUD
			theHUD.RemoveItem(newBrick);
		}

		help.setTileInMap(gbox.getCanvasContext("mazecanvas"), map, x, y,
			newBrick, tilemap);

		g_cast.handlePlacedBrick(map, tilemap, x, y);

		// let's completely redraw the tiles
		//gbox.blitFade(gbox.getCanvasContext("mazecanvas"), {alpha:1,color:timeofday.getBackgroundColor()});
		//gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"), map); // let's fully redraw it
		redrawMapArea(map, x, y);
	},
	
	// $param th - player object
	Tick: function(th) {
		this.digging.tick();
	}
}