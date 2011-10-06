var date = function() {
  return new Date().getTime();
};

(KeyboardEvent || Event).prototype.hasModifiers = function() {
  return (this.ctrlKey || this.altKey || this.shiftKey || this.metaKey);
};

var Util = {
  iterate: function(items, func) {
    for (var i = 0, length = items.length; i < length; i++) {
      func(items[i]);
    }
  }
};

Element.addMethods({
  rotate: function(element, angle) {
    if (Prototype.Browser.WebKit) {
      element.style['-webkit-transform'] = 'rotate(' + angle +'deg) ';
    } else if (Prototype.Browser.Gecko) {
      element.style.MozTransform = 'rotate(' + angle +'deg) ';
    } else {
      element.style['transform'] = 'rotate(' + angle +'deg) ';
    }
  },
  scale: function(element, scaleX, scaleY) {
    var x = scaleX;
    var y = scaleY || x;
    if (Prototype.Browser.WebKit) {
      element.style['-webkit-transform'] = 'scale(' + x + ', ' + y + ')';
    } else if (Prototype.Browser.Gecko) {
      element.style.MozTransform = 'scale(' + x + ', ' + y + ')';
    }
  }
});