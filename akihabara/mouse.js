// AkiMouse, by Darius Kazemi
// Oct 07, 2010
// http://bostongamejams.com/akimouses

var mouse;

function addMouseControl() {
mouse = gbox.addObject({
    id: 'mouse_id',
    group: 'mouse',
    upCount: 0,
	downCount: 0,
    
    initialize: function() {
    mouse.x = 0;
    mouse.y = 0;
    mouse.isDown = false;
    mouse.isDragging = false;
    mouse.isClicked = false;	// Is true one tick after mouse down
	mouse.isReleased = false;	// Is true one tick after mouse releasing
    mouse.dragObject = null;
    
    
    document.getElementsByTagName("CANVAS")[0].addEventListener('mousemove', mouse.move, false);
    document.getElementsByTagName("CANVAS")[0].addEventListener('mousedown', mouse.down, false);
    document.getElementsByTagName("CANVAS")[0].addEventListener('mouseup', mouse.up, false);
    },
    
    blit: function() {
		if (this.upCount > 0) {
			mouse.isReleased = false; 
			this.upCount = 0;
		}
		if (this.downCount > 0) {
			mouse.isClicked = false; 
			this.downCount = 0;
		}
		if (mouse.isReleased) this.upCount += 1;
		if (mouse.isClicked) this.downCount += 1;
    },
    
    move: function(event) {
		var tempCanvas = document.getElementsByTagName("CANVAS")[0];
		var cam = gbox.getCamera();

		// Hack for Opera which doesn't have event.layerX and event.layerY defined
		//
		var mouseX = event.layerX;
		var mouseY = event.layerY;
		if (typeof mouseX === 'undefined') {
			var mouseX = event.x;
		}
		if (typeof mouseY === 'undefined') {
			var mouseY = event.y;
		}

		mouse.x = (mouseX - tempCanvas.offsetLeft)/gbox._zoom + cam.x;
		mouse.y = (mouseY - tempCanvas.offsetTop)/gbox._zoom + cam.y;
    },
    
    down: function(event) {
		mouse.isDown = true;
		mouse.isClicked = true;
    },
    
    up: function(event) {
		mouse.isDown = false;
		mouse.isDragging = false;
		mouse.dragObject = null;
		mouse.isReleased = true;
    },
    
    isColliding: function(obj) {
		return gbox.pixelcollides(mouse, obj);
    },
    
    dragCheck: function(obj) {
      if (mouse.isDown == true && gbox.pixelcollides(mouse,obj) && mouse.isDragging == false)
        {
        mouse.isDragging = true;
        mouse.dragObject = obj;
        }
      if (mouse.isDragging && mouse.dragObject.id == obj.id && mouse.dragObject.group == obj.group) 
        {
        obj.x = mouse.x-obj.hw;
        obj.y = mouse.y-obj.hh;
        }
      }
  }); // end gbox.addObject for mouseControl
}