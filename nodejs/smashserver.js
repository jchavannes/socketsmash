/* Author: Jason Chavannes <jason.chavannes@gmail.com>
 * Date: 9/2/2012 */

var port = 80;

var io = require('socket.io').listen(port);

console.log("Started server on port " + port + " ...");

io.sockets.on('connection', function (socket) {
    new Session(socket);
});

var Server = {
    ChatData: [],
    Games:    [],
    Sessions: [],
    Users: {
        data: [],
        add: function(user) {
            user.id = this.data.length;
            this.data[user.id] = user;
        },
        find: function(sessionId) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].sessionId == sessionId) {
                    return this.data[i];
                }
            }
            return false;
        },
        sendScores: function(id) {
            var scores = [], i, user;
            for (i = 0; i < this.data.length; i++) {
                user = this.data[i];
                if (user.isActive()) {
                    scores.push({
                        id:         user.id,
                        kills:      user.kills,
                        deaths:     user.deaths,
                        percentage: user.percentage
                    });
                }
            }
            if (id != null) {
                this.data[id].emit('getScores', {scores: scores});
            } else {
                for (i = 0; i < this.data.length; i++) {
                    this.data[i].emit('getScores', {scores: scores});
                }
            }
        }
    }
};

var Game = function() {};

var User = function(data) {
    this.sessionId  = data.sessionId;
    this.sockId     = data.sockId;
    this.active     = true;
    this.kills      = 0;
    this.deaths     = 0;
    this.lastAttack = false;
    this.left       = data.defaultLeft;
    this.top        = data.defaultTop;
    this.percentage = 0;
    this.lastAttackTimeout = false;

    Server.Users.add(this);
};
User.prototype.isActive = function() {
    return this.active && this.expire > new Date().getTime();
};
User.prototype.refresh = function() {
    var now = new Date().getTime();
    // Update user expiration
    this.expire = now + 1000000;
    this.active = true;
};
User.prototype.sendInfo = function() {
    var self = this;
    Server.Users.data.forEach(function(user) {
        // Send new user to all other users
        if (user.isActive() && user != self) {
            user.emit('getMove', {
                id:      self.id,
                curLeft: self.left,
                curTop:  self.top,
                left:    self.left,
                top:     self.top
            });
        }

        // Send all other users to new user
        if (user.isActive() && user != self) {
            self.emit('getMove', {
                id:      user.id,
                curLeft: user.left,
                curTop:  user.top,
                left:    user.left,
                top:     user.top
            });
        }
    });
};
User.prototype.sendMove = function(data) {
    var self = this;
    Server.Users.data.forEach(function(user) {
        if (user.isActive() && user != self) {
            user.emit('getMove', {
                id:      self.id,
                curLeft: data.curLeft,
                curTop:  data.curTop,
                left:    data.left,
                top:     data.top
            })
        }
    });
};
User.prototype.sendDisconnect = function() {
    var userId = this.id;
    Server.Users.data.forEach(function(user) {
        if (user.isActive()) {
            user.emit('userExit', {id: userId});
        }
    });
};
User.prototype.sendMessage = function(msg, options) {
    if (options == null) options = {};
    var name = this.name, id = this.id;
    if (options.server) {
        name = "Server";
        id = -1;
    }
    var chatData = {
        id: id,
        msg: msg,
        name: name
    };
    if (options.log) {
        Server.ChatData.push(chatData);
    }
    Server.Users.data.forEach(function(user) {
        if (user.isActive()) {
            user.emit('newChat', chatData);
        }
    });
};
User.prototype.emit = function() {
    this.session.socket.emit.apply(this.session.socket, arguments);
};

var Session = function(socket) {
    this.socket = socket;
    this.id = Server.Sessions.length;
    Server.Sessions[this.id] = this;
    var self = this;
    socket.on('setSession', function(data) {self.set(data);});
};
Session.prototype.set = function(data) {
    this.sessionId = data.sessionId;
    var user = Server.Users.find(data.sessionId);
    if (user === false) {
        user = new User(data);
    }
    this.user = user;
    user.session = this;
    this.socket.emit('getMyUserInfo', {id: user.id});
    user.sendInfo();
    user.refresh();
    Server.Users.sendScores();
    this.setEvents();
};
Session.prototype.setEvents = function() {
    var self = this;
    var socket = this.socket;
    socket.on('sendAttack',  function(data) {self.sendAttack(data);});
    socket.on('sendAnimate', function(data) {self.sendAnimate(data);});
    socket.on('sendMove',    function(data) {self.sendMove(data);});
    socket.on('death',       function(data) {self.death(data);});
    socket.on('disconnect',  function(data) {self.disconnect(data);});
    var socketPrototype = Object.getPrototypeOf(socket);
    var socketEmit = socketPrototype.emit;
    socketPrototype.emit = function() {
        console.log(JSON.stringify(arguments));
        socketEmit.apply(this, arguments);
    };
    socket.on('*', function() {

    });
};
Session.prototype.sendAttack = function(data) {
    if (!data.playerId || !data.move || !data.direction || typeof Server.Users.data[data.playerId] == 'undefined') {
        return;
    }
    var player = Server.Users.data[data.playerId];
    switch (data.move) {
        case "moveS":
            player.percentage += Math.floor(Math.random()*5 + 20);
            break;
        case "moveA":
            player.percentage += Math.floor(Math.random()*5 + 10);
            break;
    }
    player.lastAttack = this.user.id;
    clearTimeout(player.lastAttackTimeout);
    player.lastAttackTimeout = setTimeout(function() {
        player.lastAttack = false;
    }, 2500);
    player.emit('getAttack', {
        move:      data.move,
        direction: data.direction
    });
    Server.Users.sendScores();
};
Session.prototype.sendAnimate = function(data) {
    var user;
    for (var i = 0; i < Server.Users.data.length; i++) {
        user = Server.Users.data[i];
        if (user != this.user && user.isActive()) {
            user.emit('getAnimate', {
                id:     this.user.id,
                move:   data.move,
                facing: data.facing
            });
        }
    }
};
Session.prototype.sendMove = function(data) {
    this.user.refresh();
    this.user.left = data.left;
    this.user.top  = data.top;
    this.user.sendMove(data);
};
Session.prototype.death = function(data) {
    this.user.percentage = 0;
    this.user.deaths += 1;
    if (this.user.lastAttack !== false && typeof Server.Users.data[this.user.lastAttack] != 'undefined') {
        Server.Users.data[this.user.lastAttack].kills += 1;
    }
    Server.Users.sendScores();
};
Session.prototype.disconnect = function() {
    if (this.user.session == this) {
        this.user.active = false;
        this.user.sendDisconnect();
        Server.Users.sendScores();
        this.user.sendMessage("has disconnected.<br/>");
    }
};
