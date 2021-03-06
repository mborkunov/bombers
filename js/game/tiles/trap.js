import Ground from 'babel!./ground';

export default class Trap extends Ground {

  constructor(location) {
    super(location);
    this.name = 'trap';
  }

  spawnBomb(bomber) {
    var bomb = super.spawnBomb(bomber);

    function callback(tile, bomb) {
      if (tile instanceof Trap) {
        var sources = tile._map.findTilesByType(Trap);
        var randomSource = sources[Math.floor(Math.random() * sources.length)];
        var targets = tile._map.findTilesByType(Ground);
        var randomTarget = targets[Math.floor(Math.random() * targets.length)];

        if (randomSource === randomTarget) {
          callback(tile, bomb);
        } else {
          bomb.location = randomSource.location.clone();
          bomb.flyTo(randomTarget, callback);
        }
      }
    }

    callback(this, bomb);
    return bomb;
  }
}
