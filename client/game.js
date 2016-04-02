
'use strict';
let socket = io.connect('http://localhost:8080');

let players = {};
let me = {};

socket.on('players', (players) => {
  for(var player in players) {
    updatePlayer(players[player.name], players[player]);
  }
});
socket.on('player', (data) => {
  updatePlayer(players[data.name], data);
});
socket.on('clientError', (error) => {
  console.log(error);
});

createPlayer();
function createPlayer() {
  socket.emit('join', {});
}

function updatePlayer(name, data) {
  debugger;
}