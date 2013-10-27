/* Author: Jason Chavannes <jason.chavannes@gmail.com>
 * Date: 12/30/2012 */

var MySQL = new(function() {

	var mysql;
	this.init = function() {
		 mysql = require('mysql').createConnection({
		 	host: "127.0.0.1",
			port: '3306',
		 	user: "root",
		 	password: "root",
		 	database: "socketsmash"
		 });
		 mysql.connect();
	}	
	this.query = function(query, callback) {
		var results = [];
		mysql.query(query, function(err, rows, fields) {
		 	if (err) throw err;
		 	for (var i = 0; typeof rows[i] != 'undefined'; i++) {
		 		var row = {};
		 		for (var g = 0; typeof fields[g] != 'undefined'; g++) {
		 			row[fields[g].name] = rows[i][fields[g].name];
		 			console.log(fields[g].name + ": " + rows[i][fields[g].name]);
		 		}
		 		console.log("");
		 		results.push(row);
		 	}
		 	console.log(results);
		 	callback(results);
		});
	}
	this.close = function() {		
		mysql.end();		
	}
	this.init();
});

// Load dependencies and create data stores
var io = require('socket.io').listen(8011);
var sockets = [];
var users = [];
var chatData = [];

// New connection
io.sockets.on('connection', function (socket) {

	// Add connection to socket store
	var id = sockets.length;
	sockets[id] = {id: id, socket: socket}
	
	// Send socket id to client
	sockets[id].socket.emit('getSocket', {sockId: id});

	// Get session key from client
	sockets[id].socket.on('setSession', function(data) {

		// Save session key to socket store
		sockets[data.sockId].sessionId = data.sessionId;
		var userId = false;

		// Check if user exists already
		for(var i = 0; typeof users[i] != 'undefined'; i++) {
			if(users[i].sessionId == data.sessionId) {
				userId = i;
				users[i].sockId = data.sockId;
				users[i].active = true;
			}
		}

		// Create new user
		if(userId === false) {
			userId = users.length;

			// Set detault information
			users[userId] = {
				id: userId,
				sessionId: data.sessionId,
				sockId: data.sockId,
				active: true
			}
		}

		// Save user id to socket store
		sockets[data.sockId].userId = userId;
		sockets[id].socket.emit('connected', {userId: userId, message: "connected"});
		
	});
	
	sockets[id].socket.on('runQuery', function(data) {
		MySQL.query(data.query, function(results) {
			sockets[id].socket.emit('sendResults', {results:results});
		});
	});

});