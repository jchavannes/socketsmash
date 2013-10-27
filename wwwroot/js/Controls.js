var Controls = new (function() {

	this.facing = 'right';

	this.keyDown = {

		left: false,
		right: false,
		up: false,
		down: false,
		space: false,
		moveA: false,
		moveS: false,
		moveD: false,

		anyArrow: function() {
			return (this.left || this.right || this.up || this.down || this.space);
		}

	};

	this.init = function() {

		$(document).keydown(function(e) {

            var $player = $('.player:eq(0)');
            
            switch (e.keyCode) {
                case 37:
                    Controls.keyDown.left = true;
                    $player.addClass('walkingLeft');
                    Controls.facing = 'left';
                    break;
                case 38:
                    Animate.jump();
                    Controls.keyDown.up = true;
                    break;
                case 39:
                    $player.addClass('walkingRight');
                    Controls.keyDown.right = true;
                    Controls.facing = 'right';
                    break;
                case 40:
                    Controls.keyDown.down = true;
                    break;
                case 32:
                    Animate.jump();
                    Controls.keyDown.space = true;
                    break;
                case 65:
                    Controls.keyDown.moveA = true;
                    break;
                case 83:
                    Controls.keyDown.moveS = true;
                    break;
                case 68:
                    Controls.keyDown.moveD = true;
                    break;
                default:
                    return;
            }

			e.preventDefault();

			if (Animate.lastAnimate < new Date().getTime() - 150) {
				clearTimeout(Animate.timeout);
				Animate.run();
			}

		}).keyup(function(e) {

            var $player = $('.player:eq(0)');

            switch (e.keyCode) {
                case 37:
                    Controls.keyDown.left = false;
                    $player.removeClass('walkingLeft');
                    break;
                case 38:
                    Controls.keyDown.up = false;
                    break;
                case 39:
                    $player.removeClass('walkingRight');
                    Controls.keyDown.right = false;
                    break;
                case 40:
                    Controls.keyDown.down = false;
                    break;
                case 32:
                    Controls.keyDown.space = false;
                    break;
                case 65:
                    Controls.keyDown.moveA = false;
                    break;
                case 83:
                    Controls.keyDown.moveS = false;
                    break;
                case 68:
                    Controls.keyDown.moveD = false;
                    break;
            }

		});

	};

});
