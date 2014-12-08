coinManager = new function() {
	var nextCoinId = 0;

	return {
		/**
		 *
		 * @param pos {x, y} - object position
		 */
		getCoinObject : function(pos) {
			/// @brief returns next monster id
			function getNextCoinId() {
				nextCoinId++;
				return 'coin_id_' + nextCoinId;
			};

			return {
				id: getNextCoinId(),
				group: 'player_group',
				tileset: 'coin_tiles',
				x: pos.x,
				y: pos.y,

				initialize: function() {
					toys.platformer.initialize(this,{
							frames:{
								still:{ speed:1, frames:[0,1, 2, 3, 4] },
								walking:{ speed:1, frames:[0,1, 2, 3, 4] },
								jumping:{ speed:1, frames:[0,1, 2, 3, 4] },
								falling:{ speed:1, frames:[0,1, 2, 3, 4] },
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
					this.counter=(this.counter+1)%10;
					toys.platformer.applyGravity(this); // Apply gravity
					toys.platformer.verticalTileCollision(this,maze,"map"); // vertical tile collision (i.e. floor)
					toys.platformer.horizontalTileCollision(this,maze,"map"); // horizontal tile collision (i.e. walls)
					toys.platformer.handleAccellerations(this); // gravity/attrito
					toys.platformer.setSide(this); // set horizontal side
					toys.platformer.setFrame(this); // set the right animation frame
					

					// TODO: add coins to player
					var player=gbox.getObject("player_group", "player_id");
					if (gbox.collides(this,player,2)) {
						gbox.trashObject(this);
					}
					
				},

				// the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
				blit: function() {
					gbox.blitTile(gbox.getBufferContext(), {
						tileset: this.tileset,
						tile:    this.frame,
						dx:      this.x,
						dy:      this.y,
						fliph:   false,
						flipv:   false,
						camera:  this.camera,
						alpha:   1.0
					});
				}
			};
		}
	}
}