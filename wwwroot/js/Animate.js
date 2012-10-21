var Animate = new (function() {

	this.jumping = true;
	this.timeout;
	this.lastAnimate = 0;

	this.Sprites = {
		left: function() {
			$('.player.walkingLeft').each(function(i) {
				var spriteLeft = $(this).data('spriteLeft');
				if(isNaN(spriteLeft)) {spriteLeft = 0;}
				spriteLeft -= 40;
				$(this).css({'background-position':(spriteLeft-11)+'px 0px'});
				$(this).data({'spriteLeft':spriteLeft});
			});
		},
		right: function() {
			$('.player.walkingRight').each(function(i) {
				var spriteRight = $(this).data('spriteRight');
				if(isNaN(spriteRight)) {spriteRight = 0;}
				spriteRight -= 40;
				$(this).css({'background-position':(spriteRight-11)+'px 0px'});
				$(this).data({'spriteRight':spriteRight});
			});
		},
		punchLeft: function() {
			$('.player.punchLeft').each(function(i) {
				var punchLeft = $(this).data('punchLeft');
				if(isNaN(punchLeft)) {punchLeft = 0;}
				punchLeft -= 40;
				if(punchLeft > -120) {
					$(this).css({'background-position':(punchLeft-11)+'px 0px'});
				} else {
					$(this).css({'background-position':'-91px 0px'});
				}
				$(this).data({'punchLeft':punchLeft});
				if(punchLeft < -240) {$(this).removeClass('punchLeft');}
			});
		},
		punchRight: function() {
			$('.player.punchRight').each(function(i) {
				var punchRight = $(this).data('punchRight');
				if(isNaN(punchRight)) {punchRight = 0;}
				punchRight -= 40;
				if(punchRight > -120) {
					$(this).css({'background-position':(punchRight-11)+'px 0px'});
				} else {
					$(this).css({'background-position':'-91px 0px'});
				}
				$(this).data({'punchRight':punchRight});
				if(punchRight < -240) {$(this).removeClass('punchRight');}
			});
		},
		run: function() {
			Animate.Sprites.left();
			Animate.Sprites.right();
			Animate.Sprites.punchLeft();
			Animate.Sprites.punchRight();
			clearTimeout(Animate.Sprites.timeout);
			Animate.Sprites.timeout = setTimeout(function() {
				Animate.Sprites.run();
			}, 100);
		},
		timeout: false
	}

	this.jump = function() {

		if(Animate.jumping) {return;}
		Animate.jumping = true;
		players[0].vforce = -75;

		/*clearTimeout(Animate.timeout);
		Animate.timeout = setTimeout(function() {Animate.run();});
		*/
	}

	this.run = function() {

		if(Controls.keyDown.moveA) {Moves.moveA.run();}		

		var player = {
			top: players[0].top,
			left: players[0].left,
			width: players[0].width,
			height: players[0].height
		}

		Animate.lastAnimate = new Date().getTime();

		// Horizontal movement
		if(players[0].hforce > 0) {
			players[0].hforce -= 15;
			if(players[0].hforce < 0) {players[0].hforce = 0;}
		} else {
			players[0].hforce += 15;
			if(players[0].hforce > 0) {players[0].hforce = 0;}
		}
		if(Controls.keyDown.left) {players[0].hforce -= 17;}
		if(Controls.keyDown.right) {players[0].hforce += 17;}
		player.left += players[0].hforce;

		var collideObject = Arena.checkCollide(player);
		if(collideObject !== false) {
			if(player.left > players[0].left) {
				player.left = objects[collideObject].left - player.width;
			} else {
				player.left = objects[collideObject].left + objects[collideObject].width;
			}
			players[0].hforce = 0 - players[0].hforce*.8
		}

		// Vertical movement
		players[0].vforce += 15;
		player.top += players[0].vforce;

		var hightlighted = $('.object:eq(4)').addClass('checker').hasClass('highlight');

		// Check for platforms
		if(players[0].vforce > 0) {
			for(var i = 0; i < objects.length; i++) {
				if(objects[i].type == 'platform'
					&& (players[0].top + player.height) <= objects[i].top
					&& (player.top + player.height) > objects[i].top
					&& (player.left + player.width) > objects[i].left
					&& player.left < (objects[i].left + objects[i].width))
				{
					if(i == 4) {
						if(!$('.object:eq(4)').hasClass('me')) {
							Socket.onPlatform();
							setTimeout(function() {$('.object:eq(4)').addClass('highlight').addClass('me');}, 100);		
						}
						$('.object:eq(4)').removeClass('checker');
					}
					Animate.jumping = false;
					players[0].vforce = 0;
					player.top = objects[i].top - player.height;
					if(Controls.keyDown.up || Controls.keyDown.space) {setTimeout(function() {Animate.jump();});}
				}
			}
		}
		if(hightlighted && $('.object:eq(4)').hasClass('checker')) {
			Socket.offPlatform();
			$('.object:eq(4)').removeClass('me');
			if(!$('.object:eq(4)').hasClass('other')) {
				$('.object:eq(4)').removeClass('highlight');
			}
		}

		// Check for boxes
		var collideObject = Arena.checkCollide(player);
		if(collideObject !== false) {
			players[0].vforce = 0;
			if(player.top > players[0].top) {
				player.top = objects[collideObject].top - player.height;
				Animate.jumping = false;
				if(Controls.keyDown.up || Controls.keyDown.space) {setTimeout(function() {Animate.jump();});}
			} else {
				player.top = objects[collideObject].top + objects[collideObject].height;
			}

		}
		if(players[0].vforce > 0) {
			Animate.jumping = true;
		}

		Socket.sendmove({curLeft: players[0].left, curTop: players[0].top, left: player.left, top: player.top});
		$('.player:eq(0)').stop(true,false).animate({'left':player.left, 'top':player.top}, {
			duration: 150,
			easing: 'linear',
			step: function() {

				// Check for death
				if(players[0].top > 600
					|| players[0].top + players[0].height < 0
					|| players[0].left > 1000
					|| players[0].left - players[0].width < 0)
				{
					Socket.death();
					Animate.resetPlayer();
				}
			}
		});

		players[0].top = player.top;
		players[0].left = player.left;

		if(Controls.keyDown.anyArrow() || Animate.jumping || players[0].hforce != 0 || Controls.keyDown.moveA) {

			clearTimeout(Animate.timeout);
			Animate.timeout = setTimeout(Animate.run, 150);

		}

	}

	this.resetPlayer = function() {
		players[0].left = players[0].defaultLeft;
		players[0].top = players[0].defaultTop;
		players[0].vforce = 0;
		players[0].hforce = 0;

		if(Animate.lastAnimate < new Date().getTime() - 150) {
			clearTimeout(Animate.timeout);
			Animate.run();
		}
	}

	// Animate.getAttack()
	this.getAttack = function(data) {
		if(data.direction == 'left') {
			players[0].hforce -= 100;
		} else {
			players[0].hforce += 100;
		}
		players[0].vforce += -50;

		if(Animate.lastAnimate < new Date().getTime() - 150) {

			clearTimeout(Animate.timeout);
			Animate.run();

		}
	}

	setTimeout(function() {
		Animate.run();
		Animate.Sprites.run();
	}, 50);

});