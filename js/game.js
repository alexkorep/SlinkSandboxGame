var maingame; // The magic object that handles the full play cycle
	var maze; 
var theMazeLevelText = '';

// First of all, let's load all the needed resources. Is done on the "onLoad" event of the window.
gbox.onLoad(function () {
	help.akihabaraInit({ // Akihabara is initialized with title and all the default settings.
		title:"Minedigger", // ... Just changing the game title...
		splash:{footnotes:["By alexaol",""]} // And adding some credits to Greenleo on the loading screen, which made the main theme. Great work! Trivia: is also the Akiba Hero 2nd song :)
	});

	gbox.setSplashSettings({minimalTime:0}); // Othewise it doesn't work?

	// Load Bricks
	gbox.addImage("cels","res/blocks.png"); // or sprites sheet, like this one...
	gbox.addTiles({		id:"maze",
		image:"cels",
		tileimgh:20,
		tileimgw:20,
		tileh: 16,
		tilew:16,
		tilerow:19,
		gapx:0,
		gapy:0}); // Sprites sheets are cut here, setting the tile size, the number of sprites per row and the gap of the frames set.

	gbox.addImage("hud_cell","res/hud_cell.png"); // or sprites sheet, like this one...
	gbox.addTiles({
		id:"hud_cell",
		image:"hud_cell",
		tileimgh:24,
		tileimgw:24,
		tileh: 24,
		tilew:24,
		tilerow:2,
		gapx:0,
		gapy:0});

	// Load Player sprites
	gbox.addImage('char', 'res/charbig2.png');
	// Sprites sheets are cut here, setting the tile size, the number of sprites per row and the gap of the frames set.
	gbox.addTiles({
		id:      'char_tiles', // set a unique ID for future reference
		image:   'char', // Use the 'sprites' image, as loaded above
		tileimgh:25,
		tileimgw:13,
		tileh:   23,
		tilew:   13,
		tilerow: 4,
		gapx:    0,
		gapy:    0
	});

	
	gbox.addImage('monster', 'res/fly.png');
	// Sprites sheets are cut here, setting the tile size, the number of sprites per row and the gap of the frames set.
	gbox.addTiles({
		id:      'monster_tiles', // set a unique ID for future reference
		image:   'monster', // Use the 'sprites' image, as loaded above
		tileimgh:16,
		tileimgw:16,
		tileh:   16,
		tilew:   16,
		tilerow: 2,
		gapx:    0,
		gapy:    0
	});

	gbox.addImage("coin_tiles", "res/coin.png");
	gbox.addTiles({
		id:"coin_tiles",
		image:"coin_tiles",
		tileimgh:16,
		tileimgw:16,
		tileh: 16,
		tilew:16,
		tilerow:5,
		gapx:0,
		gapy:0});

	gbox.addImage("pointers","res/pointers.png"); // or sprites sheet, like this one...
	gbox.addTiles({
		id:"pointers",
		image:"pointers",
		tileimgh:20,
		tileimgw:20,
		tileh: 20,
		tilew:20,
		tilerow:4,
		gapx:0,
		gapy:0});
	
	gbox.addImage("font","res/font.png"); // ...or font set.
	// Font are mapped over an image, setting the first letter, the letter size, the length of all rows of letters and a horizontal/vertical gap.
	gbox.addFont({id:"small",image:"font",firstletter:" ",tileh:8,tilew:8,tilerow:255,gapx:0,gapy:0}); 
	
	// Load exteranal resources
	gbox._isExternalLoadProcessing = true;
	
	// Load level text
	LoadLevel(theLevelPosition.x, theLevelPosition.y, function(level) {
		gbox._isExternalLoadProcessing = false;
		theMazeLevelText = level;
	})

	gbox.loadAll(go); // When everything is ready, the "loadAll" downloads all the needed resources and runs the "go" function when it's done loading.

}, false);

// This is our "go" function we've register and will be called after all the resources are ready. i.e. gfx are loaded, tilesets and fonts are available
function go() {
	// The very first thing to do is to set which groups will be involved in the game. Groups can be used for grouped collision detection and for rendering order
	gbox.setGroups(['mouse',
		'background_group',
		'player_group',
		'hud_background_group',
		'hud_group',
		'sparks',
		'mouse_pointer_group']);
	gbox.setFps(30);
	gbox.setScreenBorder('1px solid #FFF');
	
	// Main game object
	maingame = gamecycle.createMaingame('game', 'player_group');

	maingame.gameMenu = function() { return true; };
	maingame.gameTitleIntroAnimation = function() { return true; };
	maingame.gameIntroAnimation = function() { return true; };
	maingame.levelIntroAnimation = function() { return true; };
	maingame.newlifeIntroAnimation = function() { return true; };
	maingame.pressStartIntroAnimation = function() { return true; };
	maingame.initializeGame = function() {		addHUD();		addMouseControl();
		addMaze(theMazeLevelText);
		addPlayer();
		addMousePointer();
		//addMonster();
		
		maingame.hud.setWidget('levelpos_widget', {
			  widget: 'label',
			  font:   'small',
			  value:  '',
			  dx:     gbox.getScreenW() - 60,
			  dy:     25,
			  clear:  true
			});
		
		// Initialize HUD with the items received from server
		theHUD.Initialize(theItems);
	};

	addMenu();
	

	// That's all. Please, gamebox... run the game!
	gbox.go();
}

