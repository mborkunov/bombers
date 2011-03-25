Tile.Arrow = Class.create(Tile, {
  
  direction: 0,
  initialize: function($super, x, y, direction) {
    $super(x, y);
    this.name = 'arrow';
    this.direction = Tile.Arrow.getDirection(direction);
  },
  getName: function() {
    return this.name.toLowerCase() + '-' + Tile.Arrow.getDirectionName(this.direction);
  }
});

Object.extend(Tile.Arrow, {
  getDirection: function(char) {
    var direction = -1;
    switch (char) {
      case '^':
        direction = 0;
        break;
      case '>':
        direction = 1;
        break;
      case 'v':
        direction = 2;
        break;
      case '<':
        direction = 3;
        break;      
    }
    return direction;
  },
  getDirectionName: function(direction) {
    var name;
    switch (direction) {
      case 0:
        name = 'north';
        break;
      case 1:
        name = 'east';
        break;
      case 2:
        name = 'south';
        break;
      case 3:
        name = 'west';
        break;      
    }
    return name;
  }
});
