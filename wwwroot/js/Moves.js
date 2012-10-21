var Moves = new (function() {

	this.moveA = {

		run: function() {
			if(recent) {return;}
			recent = true; setTimeout(function() {recent = false;}, this.cooldown);
			var collide = Arena.playerCollide();
			if(collide.length > 0) {
				for(var i = 0; i < collide.length; i++) {
					var attack = {
						move: 'moveA',
						playerId: $('.player:eq('+collide[i]+')').data('id')
					}
					attack.direction = Controls.facing;
					Socket.sendAttack(attack);
				}
			}
			if(Controls.facing == 'left') {
				$('.player:eq(0)').addClass('punchLeft').data('punchLeft', 0);
				Socket.sendAnimate({move: 'punchLeft'});
			} else {
				$('.player:eq(0)').addClass('punchRight').data('punchRight', 0);
				Socket.sendAnimate({move: 'punchRight'});
			}
		},
		cooldown: 1000
	}

	var recent = false;

});