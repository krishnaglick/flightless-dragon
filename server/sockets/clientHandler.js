
class client {
  constructor(client, io) {
    this.client = client;
    this.io = io;

    this.player = {};

    this.client.on('join', this.join);
  }

  join(player) {
    if(!player.name)
      return this.emitClientError('A name is required!');

    console.log(`Player ${player.name} has joined!`);
    //TODO: Validate player properties. Ajv?
    this.player = player;
  }

  emitClientError(error) {
    this.client.emit('clientError', error);
  }
}

module.exports = client;