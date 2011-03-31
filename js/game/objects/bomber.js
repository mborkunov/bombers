var Bomber = Class.create(GameObject, {
  controller: null,
  x: null,
  y: null,
  initialize: function($super, controller, color, coord) {
    this.x = coord ? coord.x : 1;
    this.y = coord ? coord.y : 1;
    this.color = color;
    controller.attach(this);
    this.controller = controller;
  },
  render: function(container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        width: '40px',
        height: '40px',
        background: this.color,
        position: 'absolute',
        top: this.y * 40 + 'px',
        left: this.x * 40 + 'px',
        zIndex: 100
      }).addClassName('bomber');
      this.element.on('click', function() {
        this.fall();
      }.bind(this));
      container.appendChild(this.element);
    }
    if (this.isFalling()) {
      this.element.style['-webkit-transform'] = 'scale(' + this.falling + ', ' + this.falling +')';
      this.element.style.opacity = this.falling;
    }
  },
  move: function(speed, direction) {
    switch (direction) {
      case 0:
          this.y -= speed;
        break;
      case 1:
          this.x += speed;
        break;
      case 2:
          this.y += speed;
        break;
      case 3:
          this.x -= speed;
        break;
    }
    this.element.setStyle({
      top: (this.y * 40) + 'px',
      left: (this.x * 40) + 'px'
    });
  },
  spawnBomb: function() {

  }
})