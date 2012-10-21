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

			if(this.left || this.right || this.up || this.down || this.space) {return true;}
			return false;

		}

	}

	this.init = function() {

		$(document).keydown(function(e) {

			if(e.keyCode == 37) {
				Controls.keyDown.left = true;
				$('.player:eq(0)').addClass('walkingLeft');
				Controls.facing = 'left';
			} else if(e.keyCode == 38) {
				Animate.jump();
				Controls.keyDown.up = true;
			} else if(e.keyCode == 39) {
				$('.player:eq(0)').addClass('walkingRight');
				Controls.keyDown.right = true;
				Controls.facing = 'right';
			} else if(e.keyCode == 40) {
				Controls.keyDown.down = true;
			} else if(e.keyCode == 32) {
				Animate.jump();
				Controls.keyDown.space = true;
			} else if(e.keyCode == 65) {
				Controls.keyDown.moveA = true;
			} else if(e.keyCode == 83) {
				Controls.keyDown.moveS = true;
			} else if(e.keyCode == 68) {
				Controls.keyDown.moveD = true;
			} else {
				return;
			}

			e.preventDefault();

			if(Animate.lastAnimate < new Date().getTime() - 150) {

				clearTimeout(Animate.timeout);
				Animate.run();

			}

		}).keyup(function(e) {

			if(e.keyCode == 37) {
				Controls.keyDown.left = false;
				$('.player:eq(0)').removeClass('walkingLeft').css({'background-position':'-13px 0px'});
			} else if(e.keyCode == 38) {Controls.keyDown.up = false;}
			else if(e.keyCode == 39) {
				$('.player:eq(0)').removeClass('walkingRight').css({'background-position':'-13px 0px'});
				Controls.keyDown.right = false;
			} else if(e.keyCode == 40) {Controls.keyDown.down = false;}
			else if(e.keyCode == 32) {Controls.keyDown.space = false;}
			else if(e.keyCode == 65) {Controls.keyDown.moveA = false;}
			else if(e.keyCode == 83) {Controls.keyDown.moveS = false;}
			else if(e.keyCode == 68) {Controls.keyDown.moveD = false;}

		});

	}

	setTimeout(function() {Controls.init();});

});