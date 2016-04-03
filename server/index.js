
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
let clients = {};
let ids = {};

io.on('error', (err) => {
  console.log('Server Error\n', err);
});

io.on('connection', (client) => {
  console.log('New player has connected: ' + client.id);
  client.on('error', (err) => {
    console.log('Client Error\n', err);
  });

  client.on('join', (data) => {
    if(!data.name) {
      console.log(data);
      return client.emit('clientError', 'Need a name!');
    }
    if(players[data.name]) {
      return client.emit('clientError', 'Name Taken');
    }
    console.log(`Player ${data.name} has joined!`);
    players[data.name] = data;
    clients[data.name] = client;
    ids[client.id] = data.name;

    client.emit('createPlayer', players[data.name]);
    io.emit('players', players);
  });

  client.on('disconnect', () => {
    //lol
    delete players[ids[client.id]];
  });

  client.on('update', (data) => {
    for(var key in data) {
      players[data.name][key] = data[key];
    }
    io.emit(`player`, data);
  });
});

//Manual gc, MAXIMIZE PERFORMANCE
setInterval(() => {
  global.gc();
  console.log('Garbage Collected');
}, 30000);

//Communication!
setInterval(() => {
  for(var name in players) {
    //if(Math.random() > 0.5) {
      players[name].x = parseInt(Math.random()*100);
      players[name].y = parseInt(Math.random()*100);
    //}
    clients[name].emit('player', { name: name, data: players[name] });
  }
  io.emit('players', players);
}, 5000);