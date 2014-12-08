var timeofday = new function() {
	var gameMinutes = 7*60; // game starts at 7:00AM
	var dayLength = 24*60; // day length in minutes
	return {
		Tick: function() {
			gameMinutes++;
			if (gameMinutes > dayLength) {
				gameMinutes = 0;
			}
		},

		getBackgroundColor: function() {
			var minutesToMidday = Math.abs(gameMinutes - 12*60);
			var brightness = 1 - (minutesToMidday/dayLength*2);
			//Math.abs(((gameMinutes - 12*60)/dayLength)-0.5)*2;
			return 'rgb('+
				Math.floor(brightness*128) + ',' +
				Math.floor(brightness*196) + ',' + 
				Math.floor(brightness*256) + ')';
		},
		
		IsDay: function() {
			return gameMinutes > 6*60 && gameMinutes < 18*60;
		},
	};
}