var AI = new (function() {

    var timeout;
    this.Start = function() {
        timeout = setInterval(run, 200);
    };

    var run = function() {

        Controls.keyDown.up = false;
        Controls.keyDown.left = false;
        Controls.keyDown.right = false;
        Controls.keyDown.moveA = false;
        Controls.keyDown.moveS = false;

        var $players = $('.player:not(.me)');
        if ($players.length < 1) return;
        var $me = $('.player.me');
        var playerLeft = null, playerTop = null,
            meLeft = parseInt($me.css('left')),
            meTop = parseInt($me.css('top'));

        $players.each(function() {
            var $player = $(this);
            var thisLeft = parseInt($player.css('left')),
                thisTop = parseInt($player.css('top'));

            if (playerLeft == null || Math.abs(thisLeft - meLeft) < Math.abs(playerLeft - meLeft)) {
                playerLeft = thisLeft;
                playerTop = thisTop;
            }
        });

        Controls.facing = (meLeft > playerLeft) ? 'left' : 'right';
        $me.removeClass('walkingLeft, walkingRight');

        if (playerLeft > 129 && meLeft > playerLeft + 25) {
            $me.addClass('walkingLeft');
            Controls.keyDown.left = true;
        }
        else if (playerLeft < 865 && meLeft < playerLeft - 25) {
            $me.addClass('walkingRight');
            Controls.keyDown.right = true;
        }
        if (meLeft < 129) {
            Controls.keyDown.right = true;
        }
        else if (meLeft > 865) {
            Controls.keyDown.left = true;
        }

        if (Math.abs(meTop - playerTop) < 50) {
            var distance = Math.abs(meLeft - playerLeft);
            if (distance < 50) {
                Controls.keyDown.moveA = true;
            }
            else if (distance > 50 && distance < 300) {
                Controls.keyDown.moveS = true;
            }
        }


        Controls.keyDown.up = (meTop > playerTop + 20 && playerTop == lastTop);

        lastTop = playerTop;

        if (lastLeft == meLeft) sameSpot++;
        else sameSpot = 0;
        lastLeft = meLeft;

        if (sameSpot > 20) {
            if (Math.random() > 0.5) Controls.keyDown.left = true;
            else Controls.keyDown.right = true;
        }

        if (Animate.lastAnimate == lastAnimate) {
            clearTimeout(Animate.timeout);
            Animate.run();
        }

        lastAnimate = Animate.lastAnimate;

    };

    var lastAnimate;

    var lastTop = 0,
        lastLeft = 0,
        sameSpot = 0;

});