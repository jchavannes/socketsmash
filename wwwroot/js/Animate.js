var Animate = new (function() {

	this.jumping = true;
	this.timeout = null;
	this.lastAnimate = 0;
    this.percentage = 0;

	this.Sprites = {
		left: function() {
			$('.player.walkingLeft').each(function() {
                var top = $(this).hasClass('me') ? 40 : 0;
				var spriteLeft = $(this).data('spriteLeft');
				if (isNaN(spriteLeft)) {spriteLeft = 0;}
				spriteLeft -= 40;
				$(this).css({'background-position':(spriteLeft-11)+'px -'+top+'px'});
				$(this).data({'spriteLeft':spriteLeft});
			});
		},
		right: function() {
			$('.player.walkingRight').each(function() {
                var top = $(this).hasClass('me') ? 280 : 240;
				var spriteRight = $(this).data('spriteRight');
				if (isNaN(spriteRight)) {spriteRight = 0;}
				spriteRight -= 40;
				$(this).css({'background-position':(spriteRight-11)+'px -'+top+'px'});
				$(this).data({'spriteRight':spriteRight});
			});
		},
		punchLeft: function() {
			$('.player.punchLeft').each(function() {
                var top = $(this).hasClass('me') ? 120 : 80;
				var punchLeft = $(this).data('punchLeft');
				if (isNaN(punchLeft)) {punchLeft = 0;}
				punchLeft -= 40;
				if (punchLeft > -120) {
					$(this).css({'background-position':(punchLeft-11)+'px -'+top+'px'});
				} else {
					$(this).css({'background-position':'-91px -'+top+'px'});
				}
				$(this).data({'punchLeft':punchLeft});
				if (punchLeft < -240) {$(this).removeClass('punchLeft');}
			});
		},
		punchRight: function() {
			$('.player.punchRight').each(function() {
                var top = $(this).hasClass('me') ? 200 : 160;
				var punchRight = $(this).data('punchRight');
				if (isNaN(punchRight)) {punchRight = 0;}
				punchRight -= 40;
				if (punchRight > -120) {
					$(this).css({'background-position':(punchRight-11)+'px -'+top+'px'});
				} else {
					$(this).css({'background-position':'-91px -'+top+'px'});
				}
				$(this).data({'punchRight':punchRight});
				if (punchRight < -240) {$(this).removeClass('punchRight');}
			});
		},
        shotgunLeft: function() {
            $('.player.shotgunLeft').each(function() {
                var top = $(this).hasClass('me') ? 360 : 320;
                var shotgunLeft = $(this).data('shotgunLeft');
                if (isNaN(shotgunLeft)) {shotgunLeft = 0;}
                shotgunLeft -= 40;
                if (shotgunLeft > -120) {
                    $(this).css({'background-position':(shotgunLeft-11)+'px -'+top+'px'});
                } else {
                    $(this).css({'background-position':'-91px -'+top+'px'});
                }
                $(this).data({'shotgunLeft':shotgunLeft});
                if (shotgunLeft < -240) {$(this).removeClass('shotgunLeft');}
            });
        },
        shotgunRight: function() {
            $('.player.shotgunRight').each(function() {
                var top = $(this).hasClass('me') ? 440 : 400;
                var shotgunRight = $(this).data('shotgunRight');
                if (isNaN(shotgunRight)) {shotgunRight = 0;}
                shotgunRight -= 40;
                if (shotgunRight > -120) {
                    $(this).css({'background-position':(shotgunRight-11)+'px -'+top+'px'});
                } else {
                    $(this).css({'background-position':'-91px -'+top+'px'});
                }
                $(this).data({'shotgunRight':shotgunRight});
                if (shotgunRight < -240) {$(this).removeClass('shotgunRight');}
            });
        },
		run: function() {
			this.left();
			this.right();
			this.punchLeft();
			this.punchRight();
			this.shotgunLeft();
			this.shotgunRight();
			clearTimeout(SpriteTimeout);
            SpriteTimeout = setTimeout(function() {
				Animate.Sprites.run();
			}, 100);
		}
	};
    var SpriteTimeout;

	this.jump = function() {
		if (Animate.jumping) return;
		Animate.jumping = true;
		players[0].vforce = -75;
	};

	this.run = function() {

        if (Controls.keyDown.moveA) {Moves.moveA.run();}
        if (Controls.keyDown.moveS) {Moves.moveS.run();}

        var player = {
			top: players[0].top,
			left: players[0].left,
			width: players[0].width,
			height: players[0].height
		};

		Animate.lastAnimate = new Date().getTime();

		// Horizontal movement
		if (players[0].hforce > 0) {
			players[0].hforce -= 15;
			if (players[0].hforce < 0) {players[0].hforce = 0;}
		} else {
			players[0].hforce += 15;
			if (players[0].hforce > 0) {players[0].hforce = 0;}
		}
		if (Controls.keyDown.left) {players[0].hforce -= 17;}
		if (Controls.keyDown.right) {players[0].hforce += 17;}
		player.left += players[0].hforce;

		var collideObject = Arena.checkCollide(player);
		if (collideObject !== false) {
			if (player.left > players[0].left) {
				player.left = objects[collideObject].left - player.width;
			} else {
				player.left = objects[collideObject].left + objects[collideObject].width;
			}
			players[0].hforce = 0 - players[0].hforce*.8
		}

		// Vertical movement
        var exponential = (players[0].vforce < -50) ? (Math.abs(players[0].vforce) - 50) * 0.2 : 0;
		players[0].vforce += 15 + exponential;
		player.top += players[0].vforce;

		// Check for platforms
		if (players[0].vforce > 0) {
			for(var i = 0; i < objects.length; i++) {
				if (objects[i].type == 'platform'
					&& (players[0].top + player.height) <= objects[i].top
					&& (player.top + player.height) > objects[i].top
					&& (player.left + player.width) > objects[i].left
					&& player.left < (objects[i].left + objects[i].width))
				{
					Animate.jumping = false;
					players[0].vforce = 0;
					player.top = objects[i].top - player.height;
					if (Controls.keyDown.up || Controls.keyDown.space) {setTimeout(function() {Animate.jump();}, 0);}
				}
			}
		}

		// Check for boxes
		collideObject = Arena.checkCollide(player);
		if (collideObject !== false) {
			players[0].vforce = 0;
			if (player.top > players[0].top) {
				player.top = objects[collideObject].top - player.height;
				Animate.jumping = false;
				if (Controls.keyDown.up || Controls.keyDown.space) {setTimeout(function() {Animate.jump();}, 0);}
			} else {
				player.top = objects[collideObject].top + objects[collideObject].height;
			}

		}
		if (players[0].vforce > 0) {
			Animate.jumping = true;
		}

		Socket.sendmove({curLeft: players[0].left, curTop: players[0].top, left: player.left, top: player.top});
		$('.player:eq(0)').stop(true,false).animate({'left':player.left, 'top':player.top}, {
			duration: 150,
			easing: 'linear',
			step: function() {

				// Check for death
				if (players[0].top > 600
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

		if (Controls.keyDown.anyArrow() || Animate.jumping || players[0].hforce != 0 || Controls.keyDown.moveA) {

			clearTimeout(Animate.timeout);
			Animate.timeout = setTimeout(Animate.run, 150);

		}

	};

	this.resetPlayer = function() {
		players[0].left = players[0].defaultLeft;
		players[0].top = players[0].defaultTop;
		players[0].vforce = 0;
		players[0].hforce = 0;
        var $player = $('.player:eq(0)');
        $player.hide();
        setTimeout(function() {$player.show();}, 200);

		if (Animate.lastAnimate < new Date().getTime() - 150) {
			clearTimeout(Animate.timeout);
			Animate.run();
		}
	};

	// Animate.getAttack()
	this.getAttack = function(data) {
        var strength = 50 + this.percentage * (this.jumping * 0.25 + 1);
		if (data.direction == 'left') {
			players[0].hforce -= strength;
		} else {
			players[0].hforce += strength;
		}
		players[0].vforce -= strength / 2;
		if (Animate.lastAnimate < new Date().getTime() - 150) {
			clearTimeout(Animate.timeout);
			Animate.run();
		}
	};

    this.moveS = function(data) {
        Moves.bulletId++;
        var $player = $('.player[data-id='+data.id+']'),
            $container = $('.container'),
            $bullet = $('<div class="bullet" id="shotgunBullet'+Moves.bulletId+'" />');
        if (data.facing == 'left') {
            $player.addClass('shotgunLeft').data('shotgunLeft', 0);
            $container.append($bullet.css({
                "left": parseInt($player.css('left')) - 10,
                "top": parseInt($player.css('top')) + 15
            }).animate({'left':parseInt($player.css('left'))-200}, 500, 'linear', function() {$(this).remove();}));
        } else {
            $player.addClass('shotgunRight').data('shotgunRight', 0);
            $container.append($bullet.css({
                "left": parseInt($player.css('left')) + 15,
                "top": parseInt($player.css('top')) + 15
            }).animate({'left':parseInt($player.css('left'))+200}, 500, 'linear', function() {$(this).remove();}));
        }
    };

});
