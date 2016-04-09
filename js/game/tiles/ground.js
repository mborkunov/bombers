import Tile from 'babel!./tile';
import Config from 'babel!../../config';
import * as objects from 'babel!../objects';
import Sound from 'babel!../../sound';

export default class Ground extends Tile {
  constructor(location) {
    super('ground', location);
    this.passable = true;
  }

  hasExtra() {
    return this.extra != null;
  }

  getExtra() {
    return this.extra;
  }

  spawnExtra(chance) {
    if (Math.random() > chance) {
      return;
    }
    var extras = [];

    if (Config.getProperty('diseases').getValue()) {
      if (Config.getProperty('diseases.joint').getValue()) {
        extras.push(objects.extras.Joint);
      }
      if (Config.getProperty('diseases.viagra').getValue()) {
        extras.push(objects.extras.Viagra);
      }
      if (Config.getProperty('diseases.cocaine').getValue()) {
        extras.push(objects.extras.Cocaine);
      }
    }
    if (Config.getProperty('extras.bombs').getValue()) {
      extras.push(objects.extras.Bomb);
    }
    if (Config.getProperty('extras.power').getValue()) {
      extras.push(objects.extras.Power);
    }
    if (Config.getProperty('extras.skateboard').getValue()) {
      extras.push(objects.extras.Skateboard);
    }
    if (Config.getProperty('extras.kick').getValue()) {
      extras.push(objects.extras.Kick);
    }
    if (Config.getProperty('extras.bombs').getValue()) {
      extras.push(objects.extras.Glove);
    }
    var extra = extras[Math.floor(Math.random() * extras.length)];

    this.extra = new extra(this.location.clone());
    this.extra.tile = this;
    this._arena.add(this.extra);
  }

  spawnBomb(bomber) {
    var screen = this._arena;
    if (screen.hasBomb(this.getLocation())) return null;

    var bomb = new objects.Bomb(this.getLocation().clone(), bomber || screen.objects.bombers[1]);
    screen.add(bomb);
    Sound.play('putbomb');
    return bomb;
  }
}