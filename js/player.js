// Adding player char
function addPlayer() {
	gbox.addObject({
		id: 'player_id',
		group: 'player_group',
		tileset: 'char_tiles',
		side:true, // look to the right
		x: 50,
		y: 50,
		m_frameCount: 6,
		jumpaccy:4,
		jumpsize:4,
		pushing: toys.PUSH_RIGHT,

		initialize: function() {
			toys.platformer.initialize(this,{
					frames:{
						still:{ speed:1, frames:[1] },
						walking:{ speed:2, frames:[0,1,2,1,0] },
						jumping:{ speed:1, frames:[1] },
						falling:{ speed:1, frames:[1] },
						die: { speed:1,frames:[0] }
					},
					x:this.x,
					y:this.y,
					jumpaccy:10,
					side:this.side,
					counter:0,
					counter_precise:0.0,
					frame:0,
					pushing: toys.PUSH_RIGHT
			});
			
			// Keycodes for WASD keys
			gbox._keymap.k_a = 65;
			gbox._keymap.k_d = 68;
			gbox._keymap.k_w = 87;
			gbox._keymap.k_s = 83;
			gbox._keymap.k_space = 32;
			
			//gbox.addObject(coinManager.getCoinObject({x: 100, y : 20}));
			//gbox.addObject(coinManager.getCoinObject({x: 200, y : 20}));
			//gbox.addObject(coinManager.getCoinObject({x: 300, y : 20}));
		},

		first: function() {
			//this.counter_precise = (this.counter_precise + 1)%this.m_frameCount;
			//this.counter=Math.round(this.counter_precise);
			this.counter=(this.counter+1)%10;
			if (gbox.objectIsVisible(this)) {
				// a = 65
				// d = 68
				// w = 87
				// s = 83
				toys.platformer.horizontalKeys(this,{left:"k_a",right:"k_d"}); // Moves horizontally
				toys.platformer.jumpKeys(this,{jump:"k_w",audiojump:"jump"}); // handle jumping
				toys.platformer.applyGravity(this); // Apply gravity
				toys.platformer.verticalTileCollision(this,maze,"map"); // vertical tile collision (i.e. floor)
				toys.platformer.horizontalTileCollision(this,maze,"map"); // horizontal tile collision (i.e. walls)
				toys.platformer.handleAccellerations(this); // gravity/attrito
				toys.platformer.setSide(this); // set horizontal side
				toys.platformer.setFrame(this); // set the right animation frame
				
				// Need to have handleMapBorders above handleBrickWalls in order to 
				// jump change direction on map border
				//fieldborderhandler.handleMapBorders(this);
				//this.handleBrickWalls();
				this.jumpIfOnJumper(); // Jump we are at the jump cell
				
				//mousehandler.OnClick(this);

				if (!theHUD.MouseOverTheHud()) {
					//mousehandler.handleMouseMoveDirection(this); // Handle player movement with mouse
					mousehandler.handleBrickDestruction(this); // Destroy brick if it's clicked
				}
				
				//gbox.setStatBar('accy='+this.accy + ' maxaccy=' + this.maxaccy + ' y=' + this.y);
			}
			mousehandler.Tick(this);
			monstersManager.Tick();
			timeofday.Tick();
		},

		// the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
		blit: function() {
			// Clear the screen.
			//gbox.blitFade(gbox.getBufferContext(),{});

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
		
		// And now, a custom method. This one will kill the player and will be called by ghosts, when colliding with capman.
		kill: function() {
			if (!this.killed) { // If we're alive...
				this.killed=true; // First of all, player is killed. As you've seen, that makes capman invisible and on hold.
				//maingame.hud.addValue("lives","value",-1); // Then decrease the lives count.
				maingame.playerDied({wait:1}); // Telling the main game cycle that the player died. The arguments sets a short delay after the last fadeout, for making visible the dead animation
				//toys.generate.sparks.bounceDie(this,"sparks",null,{jump:6,flipv:true});
				//maingame.playerDied();
				//toys.generate.sparks.simple(this,"sparks",null,{tileset:this.tileset,frames:{speed:4,frames:[6,5,7,8,9,9,9,9]}});
				// And here comes a common trick: the player is still where was killed and a "spark" (i.e. unuseful animation) starts in the same place.
				// This method allows many nice tricks, since avoid destruction/recreation of the player object, allow a respawn the player in the place it was killed very easily (switching
				// the killed attribute. The "spark.simple" method spawns a spark in the same position of the object in the first argument.
			}
		},
		
		/*
		handleBrickWalls:function() {
			if (this.touchedrightwall) {
				this.pushing = toys.PUSH_LEFT;
				this.accx = -this.maxaccx;
			} else if (this.touchedleftwall || this.pushing == toys.PUSH_NONE) {
				this.pushing = toys.PUSH_RIGHT;
				this.accx = this.maxaccx;
			}
		},
		*/
		
		jumpIfOnJumper:function() {
			//dir = this.shouldWeMove();
			var playerX = help.xPixelToTileX(maze, this.x);
			var playerY = help.yPixelToTileY(maze, this.y);
			//gbox.setStatBar('playerX='+playerX+' playerY=' + playerY);

			if (
				toys.platformer.canJump(this) && (this.curjsize==0) &&
				maze.IsJumpTile(playerX, playerY)) {
				this.accy=-this.jumpaccy;
				this.curjsize=this.jumpsize;
				return true;
			} else if (this.curjsize) { // Jump modulation
				this.accy--;
				this.curjsize--;
			} else {
				this.curjsize=0;
			}
			return false;
		},
	}); // end gbox.addObject for player
} // end addPlayer()
