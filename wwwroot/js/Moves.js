var Moves = new (function() {

    this.moveA = {
        recent: false,
		run: function() {
			if (this.recent) {return;}
			this.recent = true; setTimeout(function() {Moves.moveA.recent = false;}, this.cooldown);
			var collide = Arena.playerCollide(30, 10, 5, 5);
			if (collide.length > 0) {
				for(var i = 0; i < collide.length; i++) {
					var attack = {
						move: 'moveA',
						playerId: $('.player:eq('+collide[i]+')').data('id')
					};
					attack.direction = Controls.facing;
					Socket.sendAttack(attack);
				}
			}
            var $player = $('.player:eq(0)');
			if (Controls.facing == 'left') {
				$player.addClass('punchLeft').data('punchLeft', 0);
				Socket.sendAnimate({move: 'punchLeft'});
			} else {
                $player.addClass('punchRight').data('punchRight', 0);
				Socket.sendAnimate({move: 'punchRight'});
			}
		},
		cooldown: 500
    };

    this.moveS = {
        recent: false,
		bulletId: 0,
		run: function() {
			if (this.recent) return;
			this.recent = true; setTimeout(function() {Moves.moveS.recent = false;}, this.cooldown);
			var collide = Arena.playerCollide(200, 5, 0, -5);
			if (collide.length > 0) {
				for (var i = 0; i < collide.length; i++) {
					Socket.sendAttack({
						move: 'moveS',
						playerId: $('.player:eq('+collide[i]+')').data('id'),
						direction: Controls.facing
					});
				}
			}
			this.bulletId++;
            var $player = $('.player:eq(0)'),
                $container = $('.container'),
                $bullet = $('<div class="bullet" id="shotgunBullet'+this.bulletId+'" />');
            $container.append($bullet);
			if (Controls.facing == 'left') {
				$player.addClass('shotgunLeft').data('shotgunLeft', 0);
				Socket.sendAnimate({move: 'shotgunLeft'});
				$bullet.css({
					"left": parseInt($player.css('left')) - 10,
					"top": parseInt($player.css('top')) + 15
				}).animate({'left':parseInt($player.css('left')) - 200}, 500, 'linear', function() {$(this).remove();});
			} else {
                $player.addClass('shotgunRight').data('shotgunRight', 0);
				Socket.sendAnimate({move: 'shotgunRight'});
                $bullet.css({
					"left": parseInt($player.css('left')) + 15,
					"top": parseInt($player.css('top')) + 15
				}).animate({'left':parseInt($player.css('left')) + 200}, 500, 'linear', function() {$(this).remove();});
			}
		},
		cooldown: 1500
    }

});