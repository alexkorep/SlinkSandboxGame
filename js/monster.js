monstersManager = new function() {
	var nextMosterId = 0;
	
	return {
		Tick: function() {
			// Check if we have enough monsters on field
			if (Math.random() < 0.05 && !timeofday.IsDay()) {
				var pos = findMonsterPosition();
				addMonster(pos.x, pos.y);
			}
		}
	}
	
	/// @retun {x,y}, position where the next moster can be spawned
	function findMonsterPosition() {
		//var map = maze;
		//var tilemap = "map";
		var m = maze["map"];
		while (true) {
			var y = Math.floor(Math.random()*m.length);
			var row = m[y];
			x = Math.floor(Math.random()*row.length);
			if (m[y][x] == maze.TILE_TREE_LEAVES) {
				var mazeTiles = gbox.getTiles('maze');
				var w = mazeTiles.tilew;
				var h = mazeTiles.tileh;
				return {
					x: x*w,
					y: y*h
				}
			}
		}
	};

	/// @brief returns next monster id
	function getNextMosterId() {
		nextMosterId++;
		return 'monster_id_' + nextMosterId;
	};

	// Adding monster char
	function addMonster(x, y) {
		var pos = findMonsterPosition();
		function jump(th) {
			th.accy = -th.jumpaccy;
			th.curjsize = th.jumpsize;
		}

		return gbox.addObject({
			id: getNextMosterId(),
			group: 'player_group',
			tileset: 'monster_tiles',
			side:true, // look to the right
			x: pos.x,
			y: pos.y,
			m_frameCount: 2,
			jumpaccy:4,
			jumpsize:4,
			pushing: toys.PUSH_RIGHT,

			initialize: function() {
				toys.platformer.initialize(this,{
						frames:{
							still:{ speed:1, frames:[0,1] },
							walking:{ speed:2, frames:[0,1] },
							jumping:{ speed:1, frames:[1] },
							falling:{ speed:1, frames:[1] },
							die: { speed:1,frames:[0] }
						},
						x:this.x,
						y:this.y,
						jumpaccy:100,
						side:this.side,
						counter:0,
						counter_precise:0.0,
						frame:0,
						pushing: toys.PUSH_RIGHT
				});
			},

			first: function() {
				if (timeofday.IsDay()) {
					if (Math.random() < 0.1) {
						gbox.trashObject(this);
						toys.generate.sparks.bounceDie(this,"sparks",null,{jump:6,flipv:true});
						
						// Drop the coin
						gbox.addObject(coinManager.getCoinObject({x: this.x, y : this.y}));
						return;
					}
				}
				
				this.counter=(this.counter+1)%10;
				toys.platformer.applyGravity(this); // Apply gravity
				toys.platformer.verticalTileCollision(this,maze,"map"); // vertical tile collision (i.e. floor)
				toys.platformer.horizontalTileCollision(this,maze,"map"); // horizontal tile collision (i.e. walls)
				toys.platformer.handleAccellerations(this); // gravity/attrito
				toys.platformer.setSide(this); // set horizontal side
				toys.platformer.setFrame(this); // set the right animation frame
				
				// Need to have handleMapBorders above handleBrickWalls in order to 
				// jump change direction on map border
				this.handleBrickWalls();

				// Then... let's bug player a bit
				var player=gbox.getObject("player_group", "player_id"); // As usual, first we pick our player object...
				if (gbox.collides(this,player,2)) { // If we're colliding with player, with a tolerance of 2 pixels...
					maingame.bullettimer=10; // ...stop the game for a while.
					player.kill(); // ...kill player. "kill" is the custom method we've created into the capman object.
				}
				
				// Some random beharour
				if (Math.random() < 0.01) {
					// Change direction
					this.pushing = (Math.random() < 0.5) ? toys.PUSH_LEFT : toys.PUSH_RIGHT;
					this.accx = -this.maxaccx;
					jump(this);
				}
			},

			// the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
			blit: function() {
				gbox.blitTile(gbox.getBufferContext(), {
					tileset: this.tileset,
					tile:    this.frame,
					dx:      this.x,
					dy:      this.y,
					fliph:   !this.side,
					flipv:   this.flipv,
					camera:  this.camera,
					alpha:   1.0
				});
			},
			
			handleBrickWalls:function() {
				if (this.touchedrightwall) {
					this.pushing = toys.PUSH_LEFT;
					this.accx = -this.maxaccx;
				} else if (this.touchedleftwall || this.pushing == toys.PUSH_NONE) {
					this.pushing = toys.PUSH_RIGHT;
					this.accx = this.maxaccx;
				}
			},
		
		}); 
	};
};