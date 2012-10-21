var Socket = new (function() {
	var socket;
	var user = {id: false};
	var lastDeath = false;
	var init = function() {
		socket = io.connect('ws://dev.socketsmash.com:8010');
		socket.on('getSocket', function(data) {
			socket.emit('setSession', {sessionId: SESSIONID, sockId: data.sockId, defaultLeft: players[0].left, defaultTop: players[0].top});
		});
		socket.on('getMyUserInfo', function(data) {
			user.id = data.id;
			Socket.offPlatform();
		});
		socket.on('getMove', function(data) {
			var id = data.id;
			if($('.player[data-id='+id+']').length < 1) {
				if(user.id != data.id) {
					$('.container').append($('<div class="player" data-id="'+id+'"></div>').css({left: data.curLeft, top: data.curTop, width: players[0].width, height: players[0].height}));;
				}
			}
			var ele = $('.player[data-id='+id+']');
			ele.removeClass('walkingLeft').removeClass('walkingRight');
			if(data.curLeft < data.left) {
				ele.addClass('walkingRight');
			} else if(data.curLeft > data.left) {
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
		});
		socket.on('onPlatform', function() {
			setTimeout(function() {$('.object:eq(4)').addClass('highlight').addClass('other');}, 100);
		});
		socket.on('offPlatform', function() {
			$('.object:eq(4)').removeClass('highlight').removeClass('other');
		});
		socket.on('winner', function(data) {
			Animate.resetPlayer();
			$('.winner').stop(true,false).css({'opacity':1}).html("Player "+(data.id+1)+" wins!").delay(1500).animate({'opacity':0},1000);
		});
		socket.on('getScores', function(data) {
			var scores = data.scores;
			var html = "";
			for(var i = 0; i < scores.length; i++) {
				console.log(scores[i].id+": "+scores[i].score);
				if(scores[i].onPlatform && scores[i].score > 0) {
					html += "<span class='points'>";
				} else if(scores[i].id == Socket.user().id) {
					html += "<span class='me'>";
				} else {
					html += "<span>";
				}
				html += "<b>Player "+(scores[i].id+1)+"</b>: "+scores[i].score+"</span><br/>";
			}
			$('.scores').html(html);
		});
	}
	this.death = function() {
		if(lastDeath) {return;}
		lastDeath = true; setTimeout(function() {lastDeath = false;}, 500);
		var params = {id: user.id};
		socket.emit('death', params);
	}
	this.sendAnimate = function(params) {
		params.id = user.id;
		socket.emit('sendAnimate', params);
	}
	this.onPlatform = function() {
		var params = {id: user.id};
		socket.emit('onPlatform', params);
	}
	this.offPlatform = function() {
		var params = {id: user.id};
		socket.emit('offPlatform', params);
	}
	this.sendAttack = function(params) {
		params.id = user.id;
		socket.emit('sendAttack', params);
	}
	this.sendmove = function(params) {
		params.id = user.id;
		socket.emit('sendMove', params);
	}
	this.user = function() {
		return user;
	}
	init();
});