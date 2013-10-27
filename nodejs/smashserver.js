/* Author: Jason Chavannes <jason.chavannes@gmail.com>
 * Date: 9/2/2012 */

 // Load dependencies and create data stores
var io = require('socket.io').listen(8010);

var sockets = [];
var users = [];
var chatData = [];

// New connection
io.sockets.on('connection', function (socket) {

    // Add connection to socket store
    var id = sockets.length;
    sockets[id] = {id: id, socket: socket};

    // Send socket id to client
    sockets[id].socket.emit('getSocket', {sockId: id});

    // Get session key from client
    sockets[id].socket.on('setSession', function(data) {

        // Save session key to socket store
        sockets[data.sockId].sessionId = data.sessionId;
        var userId = false;

        // Check if user exists already
        for (var i = 0; typeof users[i] != 'undefined'; i++) {
            if (users[i].sessionId == data.sessionId) {
                userId = i;
                users[i].sockId = data.sockId;
            }
        }

        // Create new user
        if (userId === false) {
            userId = users.length;

            // Set default information
            users[userId] = {
                id: userId,
                sessionId: data.sessionId,
                sockId: data.sockId,
                active: true,
                kills: 0,
                deaths: 0,
                lastAttack: false,
                lastAttackTimeout: false,
                //chatStart: chatData.length,
                left: data.defaultLeft,
                top: data.defaultTop,
                percentage: 0
            }
        }

        // Save user id to socket store
        sockets[data.sockId].userId = userId;

        // Set / Refresh expiration
        refreshUser(userId);

        // Send user information to client
        sockets[data.sockId].socket.emit('getMyUserInfo', {
            id: userId
        });

        var now = new Date().getTime();
        users.forEach(function(user) {

            // Send all users to client
            if (user.expire > now && user.active) {
                sockets[data.sockId].socket.emit('getMove', {
                    id: user.id,
                    curLeft: user.left,
                    curTop: user.top,
                    left: user.left,
                    top: user.top
                });
                sockets[data.sockId].socket.emit('newUser', {
                    id: user.id,
                    expire: user.expire,
                    name: user.name,
                    initials: user.initials
                });
            }

            // Send new user to all clients
            if (user.active && user.id != userId) {
                sockets[user.sockId].socket.emit('getMove', {
                    id: users[userId].id,
                    curLeft: users[userId].left,
                    curTop: users[userId].top,
                    left: users[userId].left,
                    top: users[userId].top
                });
                sockets[user.sockId].socket.emit('newUser', {
                    id: users[userId].id,
                    expire: users[userId].expire,
                    name: users[userId].name,
                    initials: users[userId].initials
                });
            }
        });
        sendScores();
    });

    // Get move from client
    sockets[id].socket.on('sendAttack', function(data) {
        if (typeof users[data.id] != 'undefined' && typeof users[data.playerId] != 'undefined') {
            refreshUser(data.id);
            users[data.playerId].percentage += (data.move && data.move == "moveS") ? Math.floor(Math.random()*5 + 20) : Math.floor(Math.random()*5 + 10);
            users[data.playerId].lastAttack = data.id;
            clearTimeout(users[data.playerId].lastAttackTimeout);
            users[data.playerId].lastAttackTimeout = setTimeout(function() {
                users[data.playerId].lastAttack = false;
            }, 2500);

            sockets[users[data.playerId].sockId].socket.emit('getAttack', {
                move: data.move,
                direction: data.direction
            });
        }
        sendScores();
    });

    // Send animate
    sockets[id].socket.on('sendAnimate', function(data) {
        if (typeof users[data.id] != 'undefined') {
            for (var i = 0; i < users.length; i++) {
                if (i != data.id && users[i].active) {
                    sockets[users[i].sockId].socket.emit('getAnimate', {
                        id:data.id,
                        move: data.move,
                        facing: data.facing
                    });
                }
            }
        }
    });

    // Get move from client
    sockets[id].socket.on('sendMove', function(data) {
        if (typeof users[data.id] != 'undefined') {
            refreshUser(data.id);
            users[data.id].left = data.left;
            users[data.id].top = data.top;

            // Send move to all clients (except sending client)
            users.forEach(function(user) {
                if (user.id != data.id && user.active) {
                    sockets[user.sockId].socket.emit('getMove', {
                        id: data.id,
                        curLeft: data.curLeft,
                        curTop: data.curTop,
                        left: data.left,
                        top: data.top
                    })
                }
            });
        }
    });

    // Death
    sockets[id].socket.on('death', function(data) {
        if (typeof users[sockets[id].userId] != 'undefined') {
            users[sockets[id].userId].percentage = 0;
            users[sockets[id].userId].deaths += 1;
        }
        if (typeof users[data.id] != 'undefined') {
            if (users[data.id].lastAttack !== false && typeof users[users[data.id].lastAttack] != 'undefined') {
                users[users[data.id].lastAttack].kills += 1;
            }
        }
        sendScores();
    });

    // Make inactive on disconnect
    var disconnect = sockets[id];
    sockets[id].socket.on('disconnect', function() {
        if (typeof users[sockets[disconnect.id].userId] != 'undefined') {
            users[sockets[disconnect.id].userId].active = false;

            // Send disconnect to all clients
            users.forEach(function(user) {
                if (user.active) {
                    sockets[user.sockId].socket.emit('userExit', {id: disconnect.userId});
                }
            });
            sendScores();
            sendMessage(sockets[disconnect.id].userId, "has disconnected.<br/>", false);
        }
    });
});

function sendScores(id) {
    var scores = [], i;
    for (i = 0; i < users.length; i++) {
        if (users[i].active) {
            scores.push({
                id: i,
                kills: users[i].kills,
                deaths: users[i].deaths,
                percentage: users[i].percentage
            });
        }
    }
    if (typeof id == 'undefined' || typeof users[id] == undefined) {
        for (i = 0; i < users.length; i++) {
            sockets[users[i].sockId].socket.emit('getScores', {scores: scores});
        }
    } else {
        sockets[users[id].sockId].socket.emit('getScores', {scores: scores});
    }
}

// Add message to history and send
function sendMessage(id, msg, log) {
    var name;
    if (typeof log == 'undefined') {log = true;}
    if (typeof users[id] != 'undefined' && typeof users[id].name != 'undefined') {
        name = users[id].name;
    } else {
        name = "Server";
        id = -1;
    }
    if (log) {chatData.push({id: id, msg: msg, name: name});}
    users.forEach(function(user) {
        if (user.active) {
            sockets[user.sockId].socket.emit('newChat', {id: id, msg: msg, name: name});
        }
    });
}

// Update user expiration
function refreshUser(userId) {
    var now = new Date().getTime();
    if (typeof users[userId] != 'undefined') {
        users[userId].expire = now + 1000000;
        users[userId].active = true;
    }
}