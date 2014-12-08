var theHUD;

function getHUDPosition() {
	return {
		x:0,
		y:gbox.getScreenH()-26,
		w:gbox.getScreenW()-16,
		h:24
	}
}

function addHUD() {
	var pos = getHUDPosition();

	theHUD = gbox.addObject({
		ITEM_CELL_COUNT: 13, 	// number of cells for items in the HUD
		CELL_COUNT: 13, 		// total number of cells

		
		items: [],
		item_counts: [],
		
		id: 'hud_id',
		group: 'hud_group',
		bk_tileset: 'hud_cell',
		item_tileset: 'maze',
		control_tileset: 'pointers',
		x: pos.x,
		y: pos.y,
		selected_item:0,
		hovered_item:1,
		item_width: 24,
		
		initialize:function() {
			if (this.items.length == 0 || this.item_counts.length == 0) {
				// resize them only if they have not been filled in Initialize function
				this.items = new Array(this.ITEM_CELL_COUNT);
				this.item_counts = new Array(this.ITEM_CELL_COUNT);
				for(var i = 0; i < this.ITEM_CELL_COUNT; ++i) {
					this.items[i] = -1; // debug
					this.item_counts[i] = 0;
				}
			}
		},

		drawTile: function(tileset, item_no, x, y, transparent) {
			gbox.blitTile(gbox.getBufferContext(), {
				tileset: tileset,
				tile:    item_no,
				dx:      this.x + x,
				dy:      this.y + y,
				fliph:   false,
				flipv:   false,
				camera:  this.camera,
				alpha:   transparent ? 0.4 : 1
			});
		},
		
		drawContolCell: function(position, isSelected, isHovered) {
			this.drawTile(this.control_tileset, position + 2, 
				this.item_width*position + 2, 2, !(isSelected || isHovered));
		},

		drawItemCell: function(position, isSelected, isHovered) {
			var item_no = this.items[position];
			var item_count = this.item_counts[position];
			if (item_no < 0 || !item_count) {
				// there is no item in this cell
				return;
			}
			this.drawTile(this.item_tileset, 
				item_no,  // use lookup array
				this.item_width*(position) + 2, 2, 
				!(isSelected || isHovered));
				
			// Draw item count
			gbox.blitText(gbox.getBufferContext(), {
				font: 'small', 
				text: this.item_counts[position], 
				dx:  this.x + this.item_width*(position) + 2,
				dy:  this.y + 2,
				dw: this.item_width - 2,
				dh: this.item_width - 2,
				valign: gbox.ALIGN_BOTTOM,
				halign: gbox.ALIGN_RIGHT,
				alpha: 1
			});
		},

		first: function() {
			this.handleMouse();
		},

		blit: function() {
			var i = 0;
			for (var i = 0; i < this.CELL_COUNT; ++i) {
				var isSelectedOrHovered = 
					(i == this.selected_item) || 
					(i == this.hovered_item);
					
				// draw background cell
				this.drawTile(this.bk_tileset, 
					isSelectedOrHovered ? 1 : 0, 
					this.item_width*i, 0, false);
					
				this.drawItemCell(i, 
					i == this.selected_item,
					i == this.hovered_item);
				
			}
		},
		
		Initialize: function(items) {
			this.items = items[0];
			this.item_counts = items[1];
			/*
			var item_ids = items[0];
			var item_counts = items[1];
			foreach(var i in item_ids) {
			}
			*/
		},

		MouseOverTheHud: function() {
			return this.getMouseOverItem() >= 0;
		},

		GetSelectedItem: function() {
			var selItem = this.selected_item;
			var item_no = selItem;
			if (this.items[item_no] >= 0 && 
				this.item_counts[item_no] > 0) {
				return this.items[item_no];
			}
		},

		getMouseOverItem: function() {
			var hudPos = getHUDPosition();
			var cam = gbox.getCamera();
			var x = mouse.x - cam.x;
			var y = mouse.y - cam.y;
			if (hudPos.x <= x && x <= hudPos.x + (this.CELL_COUNT*this.item_width) &&
				hudPos.y <= y && y <= hudPos.y + hudPos.h) {
				item = Math.floor((x - hudPos.x)/this.item_width);
				return item;
			}
			return -1;
		},
		
		onItemClick: function(brick_no) {
			// an item cell
			var item_no = brick_no;
			if (this.items[item_no] >= 0 && 
				this.item_counts[item_no] > 0) {
				// don't select empty cell
				this.selected_item = brick_no;
			}
		},

		handleMouse: function() {
			var hoveredBrick = this.getMouseOverItem();
			if (hoveredBrick >= 0) {
				if (mouse.isClicked) {
					this.onItemClick(hoveredBrick);
				}
				this.hovered_item = hoveredBrick;
			} else {
				this.hovered_item = -1;
			}
		},
		
		getItemPosition: function(item_no) {
			for (var i in this.items) {
				if (this.items[i] == item_no) {
					return i;
				}
			}
			return -1;
		},
		
		getFirstFreePlace: function() {
			for (var i in this.items) {
				if (this.items[i] < 0 || this.item_counts[i] == 0) {
					return i;
				}
			}
			return -1;
		},
		
		AddItem: function(item_no) {
			var item_position = this.getItemPosition(item_no);
			if (item_position >= 0) {
				this.item_counts[item_position]++;
			} else {
				item_position = this.getFirstFreePlace();
				if (item_position >= 0) {
					this.items[item_position] = item_no;
					this.item_counts[item_position]++;
				}
			}
		},
		
		RemoveItem: function(item_no) {
			var item_position = this.getItemPosition(item_no);
			if (item_position >= 0 && this.item_counts[item_position] > 0) {
				this.item_counts[item_position]--;
			} else {
				// there is no such item in the hud
			}
		},
		
		/// @brief items in format [[1,2,8][9,2,2]], where the first array - 
		/// IDs of items, second one is quantities.
		GetItemsEncodedToSting: function() {
			result = '[';
			for (var i in this.items) {
				if (i > 0) {
					result += ', ';
				}
				result += this.items[i];
			}
			result += '], [';
			for (var i in this.item_counts) {
				if (i > 0) {
					result += ', ';
				}
				result += this.item_counts[i];
			}
			result += ']';
			return result;
		}

	}); // end gbox.addObject for HUD
}