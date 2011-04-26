var Arbiter = Class.create(GameObject, {
  initialize: function($super) {
    $super();
    this.x = -1;
    this.y = -1.1;
  },
  render: function(container) {
    if (!this.element && container) {
      this.container = container;
      this.element = new Element('div', {id: 'arbiter'}).setStyle({
        top: (this.y * 40) + 'px',
        left: (this.x * 40)+ 'px'
      }).addClassName('arbiter');

      container.appendChild(this.element);
    }

    if (this.element) {
      this.element.style.top = (this.y * 40) + 'px';
      this.element.style.left = (this.x * 40)+ 'px';

      var scale = 'scale(' + this.scale + ',' + this.scale +')';
      this.element.style['-webkit-transform'] = scale;
      this.element.style.MozTransform = scale;
    }
  },
  hurry: function() {

  },
  update: function($super) {
    $super();
  }
});