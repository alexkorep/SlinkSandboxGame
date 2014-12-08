var fieldborderhandler={
	handleMapBorders:function(th, map) {
		// for now just don't let go there
		var mazeTiles = gbox.getTiles('maze');
		var w = mazeTiles.tilew;
		var h = mazeTiles.tileh;
		if (th.accx < 0 && th.x < w) {
			var levelX = theLevelPosition.x - 1;
			var levelY = theLevelPosition.y;
			LoadLevelToMaze(levelX, levelY, th, maze.w - th.w - w, th.y, true);
		} else if (th.accx > 0 && th.x > (maze.w - th.w - w)) {
			var levelX = theLevelPosition.x + 1;
			var levelY = theLevelPosition.y;
			LoadLevelToMaze(levelX, levelY, th, w, th.y, true);
		} else if (th.accy < 0 && th.y <= h) {
			var levelX = theLevelPosition.x;
			var levelY = theLevelPosition.y - 1;
			LoadLevelToMaze(levelX, levelY, th, th.x, maze.h - 2*th.h - h, false);
		} else if (th.accy > 0 && th.y > (maze.h - th.h)) {
			var levelX = theLevelPosition.x;
			var levelY = theLevelPosition.y + 1;
			LoadLevelToMaze(levelX, levelY, th, th.x, h, false);
		}
	}
}