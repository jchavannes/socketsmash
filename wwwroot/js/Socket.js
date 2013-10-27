var Socket = new (function() {
	var socket,
	    user = {id: false},
        lastDeath = false;

	this.init = function() {
        socket = io.connect('ws://192.168.200.39:8010');
        socket.on('getSocket', function(data) {
            socket.emit('setSession', {sessionId: SESSIONID, sockId: data.sockId, defaultLeft: players[0].left, defaultTop: players[0].top});
        });
        socket.on('getMyUserInfo', function(data) {
            user.id = data.id;
            Socket.offPlatform();
        });
        socket.on('getMove', function(data) {
            var id = data.id;
            var ele = $('.player[data-id='+id+']');
            if (ele.length < 1) {
                if (user.id != data.id) {
                    ele = $('<div class="player" data-id="'+id+'"></div>');
                    $('.container').append(ele.css({left: data.curLeft, top: data.curTop, width: players[0].width, height: players[0].height}));
                }
            }
            ele.removeClass('walkingLeft, walkingRight');
            if (data.curLeft < data.left) {
                ele.addClass('walkingRight');
            } else if (data.curLeft > data.left) {
                ele.addClass('walkingLeft');
            }
            ele.show().data({'left': data.curLeft, 'top': data.curTop}).css({'left': data.curLeft, 'top': data.curTop}).stop(true,false).animate({'left': data.left, 'top': data.top}, {duration: 150, easing: 'linear', complete: function() {
                    $(this).removeClass('walkingLeft').removeClass('walkingRight');
                }
            });
        });
        socket.on('userExit', function(data) {
            $('.player[data-id='+data.id+']').hide();
        });
        socket.on('getAttack', function(data) {
            Animate.getAttack(data);
        });
        socket.on('getAnimate', function(data) {
            $('.player[data-id='+data.id+']').addClass(data.move).data(data.move, 0);
            if (!!~["shotgunLeft", "shotgunRight"].indexOf(data.move)) {
                Animate.moveS(data);
            }
        });
        socket.on('winner', function(data) {
            Animate.resetPlayer();
            $('.winner').stop(true,false).css({'opacity':1}).html("Player "+(data.id+1)+" wins!").delay(1500).animate({'opacity':0},1000);
        });
        socket.on('getScores', function(data) {
            var scores = data.scores;
            var html = "";
            scores.sort(function(a,b) {
               return a.kills < b.kills;
            });
            for(var i = 0; i < scores.length; i++) {
                if (scores[i].onPlatform && scores[i].score > 0) {
                    html += "<span class='points'>";
                } else if (scores[i].id == Socket.user().id) {
                    Animate.percentage = scores[i].percentage;
                    html += "<span class='me'>";
                } else {
                    html += "<span>";
                }
                html += "<b>Player "+(scores[i].id+1)+"</b>: "+scores[i].kills+" kills, "+scores[i].deaths+" deaths ("+scores[i].percentage+"%)</span><br/>";
            }
            $('.scores').html(html);
        });
    };
	this.death = function() {
		if (lastDeath) {return;}
		lastDeath = true; setTimeout(function() {lastDeath = false;}, 500);
		var params = {id: user.id};
		socket.emit('death', params);
	};
	this.sendAnimate = function(params) {
		params.id = user.id;
        params.facing = Controls.facing;
		socket.emit('sendAnimate', params);
	};
	this.onPlatform = function() {
		var params = {id: user.id};
		socket.emit('onPlatform', params);
	};
	this.offPlatform = function() {
		var params = {id: user.id};
		socket.emit('offPlatform', params);
	};
	this.sendAttack = function(params) {
		params.id = user.id;
		socket.emit('sendAttack', params);
	};
	this.sendmove = function(params) {
		params.id = user.id;
		socket.emit('sendMove', params);
	};
	this.user = function() {
		return user;
	};
});