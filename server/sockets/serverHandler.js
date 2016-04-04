
let gameClient = require('./clientHandler');

class io {
  constructor(sockets, players) {
    this.io = sockets;
    this.clients = {};

    this.io.on('connection', this.connection);
    this.io.on('error', this.error);
  }

  connection(client) {
    console.log(`New client connected: ${client.id}`);
    this.clients[client.id] = new gameClient(client, io);
  }

  error(err) {
    console.log('An error? ', err);
  }
}

module.exports = io;
