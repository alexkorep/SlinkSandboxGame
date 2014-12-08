g_cast = new function() {
	var cache = [];
	// maximum number of block that takes part in crafting
	var max_sequence_lengh = 5;
	
	function processBricksToCast(map, tilemap, bricks, x, y)
	{
		function onCastFinished(resultBricks) {
			var brickSymLen = 2; // number of characters per brick, I'm not sire if there is a global var already.
			for (var i = 0; i < bricks.length; ++i) {
				var newBrickEncoded = resultBricks.substring(i*brickSymLen, i*brickSymLen + 2);
				//alert(newBrickEncoded);
				var newBrick = map.decodeBrick(newBrickEncoded);
				help.setTileInMap(gbox.getCanvasContext("mazecanvas"), map, x + i, y,
					newBrick, tilemap);
			}
			
			// let's redraw the tiles
			for (var i = 0; i < bricks.length; ++i) {
				maze.RedrawMapArea(x + i, y);
			}
			//gbox.blitFade(gbox.getCanvasContext("mazecanvas"), {alpha:1, color: maze.bkColor});
			//gbox.blitTilemap(gbox.getCanvasContext("mazecanvas"), map); // let's fully redraw it
		}

		var encodedBricks = '';
		for (var i = 0; i < bricks.length; ++i) {
			encodedBricks += map.encodeBrick(bricks[i]);
		}
		
		if (cache[encodedBricks] !== undefined) {
			//alert('from cache=' + cache[encodedBricks]);
			if (cache[encodedBricks])
			{
				onCastFinished(cache[encodedBricks]);
			}
			return;
		}
		
		$.post('cast.php', 'items=' + encodedBricks, function(data) {
			// alert('requested from server');
			if (data != '') {
				//alert(encodedBricks + '->' + data);
				onCastFinished(data);
			}
			cache[encodedBricks] = data;
		});
	}
	
	return {
		/// @param x in, x-coordinate of placed brick
		/// @param y in, y-coordinate of placed brick
		handlePlacedBrick: function(map, tilemap, x, y) {
			// disable for now
			//return;
		
			// We are finding the diamonds which are located
			// next to each other with another brick between them
			var m = map[tilemap];
			var row = m[y];
			var j0 = x - max_sequence_lengh < 0 ? 0 : x - max_sequence_lengh;
			var j1 = x + max_sequence_lengh >= row.length ? row.length - 1 : x + max_sequence_lengh;
			for (var j = j0; j <= x; ++j) {
				if (m[y][j] == map.TILE_DIAMOND_SMALL) {
					for (var k = 2; k + j <= j1; ++k) {
						if (m[y][j + k] == map.TILE_DIAMOND_SMALL) {
							var bricks = [];
							for (var z = 0; z <= k; ++z) {
								var brick = m[y][j + z];
								bricks.push(brick);
							}
							processBricksToCast(map, tilemap, bricks, j, y);
						}
					}
				}
			}
		}
	}
}