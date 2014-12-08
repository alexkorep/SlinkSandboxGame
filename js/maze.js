function addMaze(mazeLevelText) {
	var encodeArray = [[null,"  "],[0,"00"],[1,"01"],[2,"02"],[3,"03"],[4,"04"],[5,"05"],
		[6,"06"],[7,"07"],[8,"08"],[9,"09"],[10,"10"],[11,"11"],
		[12,"12"], [13,"13"], [14,"14"], [15,"15"],
		[16,"16"], [17,"17"], [18,"18"], [19,"19"]];
	
	//alert(theField);
	
	function loadMapFromText(text) {
		//alert(text);
		var stringLines = text.split("\n");
		return help.asciiArtToMap(stringLines, encodeArray)
	}
	
	// Let's prepare the maze map now. Every stage is the same level but you can generate a new level each "changeLevel" call, using the "level" argument value.
	// This is just an array with the tile id or NULL for an empty transparent space.
	maze = help.finalizeTilemap({ // finalizeTilemap does some magic to the maze object: calculate real width/height of the map in pixels and values the "h" and "w" property.
		tileset:"maze", // This is the tileset used for rendering the map.

		map: loadMapFromText(mazeLevelText), 
		
		// tile consts
		TILE_BLANK: null,
		TILE_JUMP: 0,
		TILE_APPLE: 7,
		TILE_TREE_LEAVES: 11,
		TILE_TREE_TRUNK: 12,
		TILE_DIAMOND_SMALL: 14,
		
		tileIsSolid:function(obj,t){ // This function have to return true if the object "obj" is checking if the tile "t" is a wall, so...
			if (t == null) {
				return false;
			}
			
			var transparentItems = [this.TILE_JUMP, 5, 6, 
				this.TILE_APPLE, 
				this.TILE_DIAMOND_SMALL,
				this.TILE_TREE_TRUNK, 
				this.TILE_TREE_LEAVES];
			var i = transparentItems.length;
			while (i--) {
				if (transparentItems[i] === t) {
				  return false;
				}
			}
			return true;
		},

		tileIsSolidCeil:function(obj,t){
			var transparentItemsUp = [4];
			var i = transparentItemsUp.length;
			while (i--) {
				if (transparentItemsUp[i] === t) {
				  return false;
				}
			}
			return maze.tileIsSolid(obj,t);
			//return (t!==null)&& (t != 0);
		},

		tileIsSolidFloor:function(obj,t) {
			if (t == this.TILE_TREE_LEAVES) {
				return true;
			}			return maze.tileIsSolid(obj,t);
			//return (t!==null)&& (t != 0);
		},
		
		encodeBrick: function(brick) {
			for (var i = 0; i < encodeArray.length; ++i) {
				if (encodeArray[i][0] == brick) {
					return encodeArray[i][1];
				}
			}
			return ' ';
		},
		
		decodeBrick: function(brickEncoded) {
			for (var i = 0; i < encodeArray.length; ++i) {
				if (encodeArray[i][1] == brickEncoded) {
					return encodeArray[i][0];
				}
			}
			return ' ';
		},

		GetTilesEncodedToString: function() {
			var res = '';
			for (var i = 0; i < this.map.length; ++i) {
				for (var j = 0; j < this.map[i].length; ++j) {
					var brick = this.map[i][j];
					var brickEncoded = this.encodeBrick(brick);
					res += brickEncoded;
				}
				res += '\n';
			}
			return res;
		},
		
		IsJumpTile: function(x, y) {
			if (x < 0 || x >= this.w || y < 0 || x >= this.h) {
				return false;
			}
			var brick = this.map[y][x];
			return brick == this.TILE_JUMP;
		},
		
		LoadMaze: function(text) {
			this.map = loadMapFromText(text);
			maze = help.finalizeTilemap(this);

			// let's completely redraw the maze tiles
			gbox.blitFade(gbox.getCanvasContext("mazecanvas"), {alpha:1, color: timeofday.getBackgroundColor()});
			gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"), this); // let's fully redraw it
		},
		
		/// Draws an area around a tile 
		/// @param xcenter x-coordinate of tile, 
		/// @param ycenter y-coordinate of tile, 
		RedrawMapArea: function(xcenter, ycenter) {
			var tox = gbox.getCanvasContext("mazecanvas");
			var data = this;
			
			if (tox==null) return;
			var ts=gbox._tiles[data.tileset];
			var x0 = xcenter > 0 ? xcenter - 1 : xcenter;
			var x1 = xcenter < data.map[0].length - 1 ? xcenter + 1 : xcenter;
			var y0 = ycenter > 0 ? ycenter - 1 : ycenter;
			var y1 = ycenter < data.map.length - 1 ? ycenter + 1 : ycenter;
			
			gbox.blitClear(tox, {
				x: xcenter*ts.tilew,
				y: ycenter*ts.tileh,
				w: ts.tileimgw ? ts.tileimgw : ts.tilew,
				h: ts.tileimgh ? ts.tileimgh : ts.tileh
			});
			
			for (var y = y1; y >= y0; y--) {
				for (var x = x0; x <= x1; x++) {
					if (data.map[y][x]!=null) {
						gbox.blitTileWithMargins(tox, {
								tileset:data.tileset,
								tile:data.map[y][x],
								dx:x*ts.tilew,
								dy:y*ts.tilew
						}, 
						x == x1 ? 4 : 0,
						y == y0 ? 4 : 0);
					}
				}
			}
		}
	});
		
	gbox.createCanvas("mazecanvas",{w:maze.w,h:maze.h}); // Since finalizeMap have calculated the real height and width, we can create a canvas that fits perfectly our maze... Let's call it "mazecanvas".
	gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"),maze); // Let's paste the maze map in the "maze" object into the just created "mazecanvas". So is now ready to be rendered.

	// An object will draw the maze on the screen
	gbox.addObject({
		id:"maze", // This is the object ID
		group:"background_group", // Is in the "backround" group, that is the lower group in the "setGroups" list. Will be drawn for first.
		/*
		initialize:function() { // This action is executed the first time the object is called, so...
			//gbox.setCameraY(2,{w:maze.w,h:maze.h}); // We place the camera a bit down, since the full maze doesn't fit the screen.
		},
		*/
		
		blit:function() { // Then, the most important action: the "blit", where object are drawn on the screen.
			//gbox.centerCamera(gbox.getObject('player_group', 'player_id'), {w: maze.w, h: maze.h});
			// Center the camera on the player object. The map.w and map.h data tells the camera when it's hit the edge of the map so it stops scrolling.
			followCamera(gbox.getObject('player_group', 'player_id'), { w: maze.w, h: maze.h });

			maingame.hud.redraw();

			gbox.blitFade(gbox.getBufferContext(),{alpha:1, color: timeofday.getBackgroundColor()}); // First let's clear the whole screen. Blitfade draws a filled rectangle over the given context (in this case, the screen)
			hght = gbox.getCanvas("mazecanvas").height;
			gbox.blit(
				gbox.getBufferContext(),gbox.getCanvas("mazecanvas"),
				{					dx:0,
					dy:0,
					dw:gbox.getCanvas("mazecanvas").width,
					dh:gbox.getCanvas("mazecanvas").height,
					sourcecamera:true
				}
			); // Simply draw the maze on the screen.
		}
	});
	
	function followCamera(obj,viewdata) {
		xbuf = 100;
		ybuf = 100;
		xcam = gbox.getCamera().x;
		ycam = gbox.getCamera().y;

		if ((obj.x - xcam) > (gbox._screenw - xbuf)) gbox.setCameraX(xcam + (obj.x - xcam) - (gbox._screenw - xbuf), viewdata);
		if ((obj.x - xcam) < (xbuf))                 gbox.setCameraX(xcam + (obj.x - xcam) - xbuf,                   viewdata);
		if ((obj.y - ycam) > (gbox._screenh - ybuf)) gbox.setCameraY(ycam + (obj.y - ycam) - (gbox._screenh - ybuf), viewdata);
		if ((obj.y - ycam) < (ybuf))                 gbox.setCameraY(ycam + (obj.y - ycam) - ybuf,                   viewdata);
	}

}