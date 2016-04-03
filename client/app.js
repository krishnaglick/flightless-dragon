/*globals io, Player */
'use strict';

class App {

  join() {
    let name = document.getElementById('charName').value;
    let connInfo = document.getElementById('connectionInfo').value;
    if(!name)
      return alert('Need a name!');
    if(!connInfo)
      return alert('Connection Info Required!');
    this.socket = io.connect(connInfo);
    this.players = {};

    this.socket.on('createPlayer', (playerData) => {
      this.player = new Player(playerData);
    });

    this.socket.on('players', (players) => {
      for(var name in players) {
        if(!this.players[name])
          this.players[name] = new Player(players[name]);
        else
          this.players[name].updatePlayer(players[name]);
      }
    });

    this.socket.on('player', (data) => {
      if(data.name === name)
        this.player.updatePlayer(data.data);
      else {
        if(!this.players[data.name])
          this.players[data.name] = new Player(data.data);
        else
          this.players[data.name].updatePlayer(data.data);
      }
    });

    this.socket.on('clientError', (error) => {
      console.log(error);
    });

    this.socket.on('reconnect', () => {
      this.socket.emit('join', this.player);
    });

    this.socket.emit('join', { name: name });
  }

}

window.app = new App();
