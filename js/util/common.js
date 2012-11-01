var now = function() {
  return new Date().getTime();
};

var Util = {
  iterate: function(items, func) {
    for (var i = 0, length = items.length; i < length; i++) {
      func(items[i], i);
    }
  },
  Location: {
    params: null,
    getParam: function(name) {
      if (Util.Location.params == null) {
        Util.Location.params = {};

        if (window.location.search.length > 1) {
          var params = window.location.search.substring(1).split('&');
          for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (param.indexOf('=') >= 0) {
              var values = param.split('=');
              Util.Location.params[values[0]] = values[1];
            } else {
              Util.Location.params[param] = true;
            }
          }
        }
      }

      if (!Object.isUndefined(Util.Location.params[name])) {
        return Util.Location.params[name];
      }
      return null;
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
    } else {
      element.style.setProperty('transform', 'scale(' + x + ', ' + y + ')', null);
    }
  }
});

if (!Prototype.Browser.IE) {
  (typeof(KeyboardEvent) == 'undefined' ? Event : KeyboardEvent).prototype.hasModifiers = function() {
    return (this.ctrlKey || this.altKey || this.shiftKey || this.metaKey);
  };
}

dat.GUI.prototype.createFolder = function(name) {
  var parts = name.split('.');
  var folder = this;
  parts.each(function(part, index) {
    if (index + 1 == parts.length) {
      return;
    }
    try {
      folder = folder.addFolder(part);
    } catch (ignored) {
      folder = folder.__folders[part];
    }
  });
  return folder;
};
