var Bomber = Class.create(GameObject, {
  controller: null,
  x: null,
  y: null,
  backgroundPosition: null,
  maxBombs: null,
  bombs: [],
  dead: null,
  initialize: function($super, controller, color, coord) {
    this.backgroundPosition = {x: 0, y: 0};
    this.distance = 0;
    this.speed = .05;
    this.maxBombs = 1;
    this.dead = false;
    this.x = coord.x;
    this.y = coord.y;
    this.color = color;
    controller.attach(this);
    this.controller = controller;
  },
  isDead: function() {
    return this.dead;
  },
  render: function($super, container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        width: '40px',
        height: '40px',
        position: 'absolute',
        top: this.y * 40 + 'px',
        left: this.x * 40 + 'px'
      }).addClassName('bomber').addClassName('object');
      this.element.observe("click", this.kill.bind(this));
      container.appendChild(this.element);
    }
    $super();
  },
  kill: function() {
    this.dead = true;
    this.controller.deactivate();
    this.element.addClassName('dead');
    Sound.play('die');
  },
  update: function($super, delay, map) {
    if (!this.isFlying()) {
      if (!this.isFalling()) {
        var tile = map.getTile(this.x, this.y);
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
    }
    $super(delay);
    //if (this.isMoving()) {
      //this.checkCollisions()
    //}
  },
  isMoving: function() {
  },
  move: function(direction, delay) {
    if (this.isFlying() || this.isFalling()) return;
    var speed = this.getSpeed();
    var spriteDirection = this.backgroundPosition.y;
    switch (direction) {
      case 0:
          spriteDirection = 80;
          this.y -= speed;
        break;
      case 1:
          spriteDirection = 40;
          this.x += speed;
        break;
      case 2:
          spriteDirection = 0;
          this.y += speed;
        break;
      case 3:
          spriteDirection = 120;
          this.x -= speed;
        break;
    }
    if (this.backgroundPosition.y != spriteDirection) {
      this.element.style['background-position-y'] = (this.backgroundPosition.y = spriteDirection) + 'px';
    }
    this.distance += speed;

    if (this.distance >= .3) {
      this.backgroundPosition.x += 40;
      if (this.backgroundPosition.x == 40) {
        this.backgroundPosition.x = 80;
      }
      if (this.backgroundPosition.x >= 320) {
        this.backgroundPosition.x = 80;
      }
      this.element.style['background-position-x'] = this.backgroundPosition.x + 'px';
      this.distance = 0;
    }
  },
  spawnBomb: function() {
    if (this.bombs.length < this.maxBombs) {
      this.bombs.push(1);
      Sound.play('putbomb');
    }
  },
  throwBomb: function() {},
  kick: function() {},
  explode: function() {}
});