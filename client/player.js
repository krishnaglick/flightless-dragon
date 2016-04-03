
'use strict';

class Player {
  constructor(character) {
    this.name = character.name;
    this.x = character.x || 0;
    this.y = character.y || 0;
    this.exp = character.exp || 0;
    this.items = character.items || {};
  }

  updatePlayer(data) {
    for(var key in data) {
      this[key] = data[key];
    }
  }
}
