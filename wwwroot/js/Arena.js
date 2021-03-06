var Arena = new(function() {
	
	this.init = function() {
        var $container = $('.container'), i;

		for(i = 0; i < objects.length; i++) {
			objects[i].cords = [
				{x: objects[i].left, y: objects[i].top},
				{x: objects[i].left + objects[i].width, y: objects[i].top},
				{x: objects[i].left + objects[i].width, y: objects[i].top + objects[i].height},
				{x: objects[i].left, y: objects[i].top + objects[i].height}
			];
			$container.append($('<div class="object" />').css({
				left: objects[i].left,
				top: objects[i].top,
				width: objects[i].width,
				height: objects[i].height
			}));
		}

		for(i = 0; i < players.length; i++) {
            var $me = $('<div class="player me" />');
			$container.append($me.css({
				top: players[i].top,
				left: players[i].left,
				width: players[i].width,
				height: players[i].height
			}));
		}

	};

	this.playerCollide = function(frontReach, backReach, upReach, downReach) {

        var $me = $('.player.me');

		var player1 = {
			left: parseInt($me.css('left')),
			top: parseInt($me.css('top')),
			width: players[0].width,
			height: players[0].height
		};
		player1.cords = [
			{x: player1.left, y: player1.top},
			{x: player1.left + player1.width, y: player1.top},
			{x: player1.left + player1.width, y: player1.top + player1.height},
			{x: player1.left, y: player1.top + player1.height}			
		];
		var collide = [];
		$('.player').each(function(i) {
			var ele = $('.player').eq(i);
			if (ele.hasClass('me')) {return;}
			var player2 = {
				left: parseInt(ele.css('left')),
				top: parseInt(ele.css('top')),
				width: player1.width,
				height: player1.height
			};
			player2.cords = [
				{x: player2.left, y: player2.top},
				{x: player2.left + player2.width, y: player2.top},
				{x: player2.left + player2.width, y: player2.top + player2.height},
				{x: player2.left, y: player2.top + player2.height}			
			];
			var leftReach = backReach, rightReach = backReach;
			if (Controls.facing == 'left') {leftReach = frontReach;}
			else {rightReach = frontReach;}

			if (player1.cords[2].x + rightReach > player2.cords[0].x
				&& player1.cords[2].y + downReach > player2.cords[0].y
				&& player1.cords[0].x - leftReach< player2.cords[2].x
				&& player1.cords[0].y - upReach < player2.cords[2].y)
			{collide.push(i);}
		});
		return collide;
	};

	this.checkCollide = function(object) {

		for(var i = 0; i < objects.length; i++) {

			if (objects[i].type == 'box' &&
				(Arena.inObject({x: object.left, y: object.top}, objects[i])
				|| Arena.inObject({x: object.left + object.width, y: object.top}, objects[i])
				|| Arena.inObject({x: object.left, y: object.top + object.height}, objects[i])
				|| Arena.inObject({x: object.left + object.width, y: object.top + object.height}, objects[i]))) {
				return i;
			}

		}
		return false;
	};

	this.inObject = function(cord, object) {

        return (cord.x > object.cords[0].x
			&& cord.x < object.cords[2].x
			&& cord.y > object.cords[0].y
			&& cord.y < object.cords[2].y);

	};

});
