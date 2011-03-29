var Bomber = Class.create(GameObject, {
  controller: null,
  x: null,
  y: null,
  initialize: function($super, controller, color) {
    this.x = 150;
    this.y = 150;
    this.color = color;
    controller.attach(this);
    this.controller = controller;
  },
  render: function(container) {
    if (!this.element && container) {

      this.element = new Element("div").setStyle({width: "40px", height: "40px", background: this.color, position: "absolute", top: this.y + "px", left: this.x + "px", zIndex: 100});
      container.appendChild(this.element);
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
      top: this.y + "px",
      left: this.x + "px"
    });
  },
  spawnBomb: function() {}
})