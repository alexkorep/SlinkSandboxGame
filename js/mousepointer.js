function addMousePointer() {

	// draw digging progress bar
	// @param digProgress current digging progress
	// @param maxProgress maximum digging progress
	// @param x, y - progress bar coordinates
	function drawProgressPointer(digProgress, maxProgress, x, y) {
		var cam = gbox.getCamera();
		var dx = x - cam.x;
		var dy = y - cam.y;
		var maxw = 20;
		var width = digProgress/maxProgress*maxw;
		var height = 8;
		gbox.blitRect(gbox.getBufferContext(), {
			x: dx,
			y: dy - height,
			w: maxw,
			h: height,
			alfa: 1,
			color: "#FFFFFF"
		});

		gbox.blitRect(gbox.getBufferContext(), {
			x: dx + 1,
			y: dy - height + 1,
			w: width - 2,
			h: height - 2,
			alfa: 1,
			color: "#000000"
		});

	}
	
	// Adjust value to toVal, e.g if 
	// value = 21, toVal = 10, result = 25 (middle between 10 and 20);
	// value = 4, toVal = 9, result = 10 (middle between 8 and 12)
	function adjustTo(value, toVal) {
		return Math.round((value - toVal/2)/toVal)*toVal;
	}
	
	gbox.addObject({
		id: 'hud_id',
		group: 'mouse_pointer_group',

		first: function() {
		},

		blit: function() {
			if (theHUD.MouseOverTheHud()) {
				// Don't draw the pointer when mouse is over the HUD
				return;
			}
			
			var item_no = theHUD.GetSelectedItem();
			var tileset = 'maze';
			var cam = gbox.getCamera();
			var x = mouse.x;
			var y = mouse.y;

			var mazeTiles = gbox.getTiles('maze');
			var w = mazeTiles.tilew;
			var h = mazeTiles.tileh;

			if (x && y)
			{				var tileUnderMouseCursor = help.getTileInMap(mouse.x, mouse.y, maze, null, 'map');
				var digProgress = mousehandler.digging.getProgress();
				
				// Todo: is there another way to get player object?
				var player=gbox.getObject("player_group", "player_id");
				var canHandleTile = mousehandler.CanHandleTileUnderCursor(maze, player);
				if (!canHandleTile) {
					// We cannot handle this brick location, don't draw anything
					return;
				}

				if (tileUnderMouseCursor != null || digProgress) {
					// We need to draw Delete sign
					item_no = 0;
					tileset = 'pointers';
				} 

				if (digProgress > 0)
				{
					x = mousehandler.digging.getPosition().x;
					y = mousehandler.digging.getPosition().y;
					
					var maxProgress = mousehandler.digging.getMaxProgress();
					drawProgressPointer(digProgress, maxProgress, 
						adjustTo(x, w), adjustTo(y, h));
				}
			}

			if (item_no >= 0) {
				var tiles = gbox.getTiles(tileset);
				gbox.blitTile(gbox.getBufferContext(), {
					tileset: tileset,
					tile: item_no,
					dx:      adjustTo(x, w),
					dy:      adjustTo(y, h),
					fliph:   false,
					flipv:   false,
					camera:  cam,
					alpha:   0.7
				});
			}
		},
	}); // end gbox.addObject for Mouse Pointer
}