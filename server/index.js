
'use strict';

let ecstatic = require('ecstatic');

let app = require('http').createServer(
  ecstatic({
    root: '../client/',
    handleError: false
  })
);
let io = require('socket.io')(app);

let port = process.env.SOCKET_IO_PORT || 8080;
app.listen(port);

let players = {};

io.on('connection', (client) => {
  console.log('New player has connected: ' + client.id);

  client.on('join', (data) => {
    if(!data.name) {
      return client.emit('clientError', 'Need a name!');
    }
    if(players[data.name]) {
      return client.emit('clientError', 'Name Taken');
    }
    console.log('Player has joined!');
    players[data.name] = data;
    io.emit('players', players);
  });

  client.on('disconnect', () => {
    for(var key in players) {
      if(players[key].id === client.id) {
        delete players[key];
      }
    }
  });

  client.on('update', (data) => {
    for(var key in data) {
      players[data.name][key] = data[key];
    }
    io.emit(`player`, data);
  });
});

//Manual gc lol
setInterval(() => {
  global.gc();
  console.log('Garbage Collected');
}, 30000);
