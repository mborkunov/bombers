var date = function() {
  return new Date().getTime();
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
      element.style.setProperty('-webkit-transform', 'rotate(' + angle +'deg)', null);
    } else if (Prototype.Browser.Gecko) {
      element.style.setProperty('-moz-transform', 'rotate(' + angle +'deg)', null);
    } else if (Prototype.Browser.Opera) {
      element.style.setProperty('-o-transform', 'rotate(' + angle +'deg)', null);
    } else {
      element.style.setProperty('transform', 'rotate(' + angle +'deg)', null);
    }
  },
  scale: function(element, scaleX, scaleY) {
    var x = scaleX, y = scaleY || x;
    if (Prototype.Browser.WebKit) {
      element.style.setProperty('-webkit-transform', 'scale(' + x + ', ' + y + ')', null);
    } else if (Prototype.Browser.Opera) {
      element.style.setProperty('-o-transform', 'scale(' + x + ', ' + y + ')', null);
    } else if (Prototype.Browser.Gecko) {
      element.style.setProperty('-moz-transform', 'scale(' + x + ', ' + y + ')', null);
    }
  }
});

(typeof(KeyboardEvent) == 'undefined' ? Event : KeyboardEvent).prototype.hasModifiers = function() {
  return (this.ctrlKey || this.altKey || this.shiftKey || this.metaKey);
};