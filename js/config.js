var Config = {
  properties: {},
  types: {},
  getProperty: function(key) {
    if (typeof (this.properties[key]) !== 'undefined') {
      return this.properties[key];
    }
    console.error('There is no property for id #' + key);
  },
  getValue: function(key) {
    return Config.getProperty(key).getValue();
  },
  change: function(key) {
    var property = Config.getProperty(key);
    property.setValue(property.getNextValue());
    localStorage.setItem(key, property.getValue());
    return property.getValue();
  },
  initialize: function(options) {
    new Ajax.Request('config.xml', {
      method: 'get',
      onSuccess: function(t) {
        var xml = t.responseXML;
        //var types = xml.querySelectorAll('types > type');
        //console.log(types);

        var nodeToObject = function(node) {
          var data = {};
          for (var x = 0, length = node.childNodes.length; x < length; x++) {
            var child = type.childNodes[x];
            console.log(child);
            if (child.nodeType == 1) {
              if (child.childNodes.length == 1) {
                data[child.nodeName] = child.firstChild.nodeValue;
              } else {
                data[child.nodeName] = nodeToObject(child);
              }
            }
          }
          return data;
        };

        for (var x = 0, length = types.length; x < length; x++) {
          var type = types[x];
          var id = type.getAttribute('id');
          //Config.types[id] = nodeToObject(type);
        }
        //console.log(t.responseXML.firstChild, types);
        //console.log(xml.firstChild.querySelectorAll('types > type'));

        var properties = xml.getElementsByTagName('property');
        for (var i = 0; i < properties.length; i++) {
          var property = Config.Property.create(properties[i]);
          property.loadUserValue();
          Config.properties[property.getId()] = property;
        }
        options.onSuccess();
      },
      onFailure: options.onFailure
    });
  }
};

Config.Property = Class.create({
  value: null,
  defaultValue: null,
  immutable: null,
  initialize: function(xmlConfig) {
    this.id = xmlConfig.getAttribute('id');
    this.name = xmlConfig.getElementsByTagName('name')[0].firstChild.nodeValue;
    this.immutable = xmlConfig.hasAttribute('immutable') && xmlConfig.getAttribute('immutable').toLowerCase() == 'true';
  },
  loadUserValue: function() {
    if (this.immutable) {
      return;
    }
    if (localStorage.getItem(this.id) !== null)  {
      this.setValue(localStorage.getItem(this.id));
    }

    var value = Util.Location.getParam(this.id);
    if (value !== null) {
      this.setValue(value);
    }
  },
  getId: function() {
    return this.id;
  },
  getName: function() {
    return this.name;
  },
  getValue: function() {
    return this.value;
  },
  getScreenValue: function() {
    return this.value;
  },
  setValue: function() {
    if (this.immutable) {
      throw 'Cannot change immutable property';
    }
    localStorage.setItem(this.id, this.value);
  },
  getNextValue: null,
  getPreviousValue: null,
  toString: function() {
    return '(' + this.type + ') #' + this.id + ' ' + this.value + ' <' + this.getPreviousValue() + '|' + this.getNextValue() + '>' + ' - ' + this.name;
  }
});

Config.Players = {
  getAllPlayers: function() {
    var players = [];
    for (var i = 1; i <= 8; i++) {
      var player = Config.getProperty('game.player.' + i);
      players.push(player);
    }
    return players;
  },
  getActivePlayers: function() {
    var players = [];
    for (var i = 1; i <= 8; i++) {
      var player = Config.getProperty('game.player.' + i);
      var active = player.getValue('active').toLowerCase();
      if (active == 'true' || active == '1' || active == 'yes') {
        players.push(player);
      }
    }
    return players;
  },
  getAiPlayers: function() {
    var players = [];
    for (var i = 1; i <= 8; i++) {
      var player = Config.getProperty('game.player.' + i);
      if (player.getValue('controller').toLowerCase() == 'ai') {
        players.push(player);
      }
    }
    return players;
  },
  getHumanPlayer: function() {
    var players = [];
    for (var i = 1; i <= 8; i++) {
      var player = Config.getProperty('game.player.' + i);
      if (player.getValue('controller').toLowerCase() != 'ai') {
        players.push(player);
      }
    }
    return players;
  }
};

Config.Property.Complex = Class.create(Config.Property, {
  type: 'complex',
  map: null,
  initialize: function($super, xmlConfig) {
    $super(xmlConfig);
    this.map = {};

    var children  = xmlConfig.childNodes;

    for (var i = 0, length = children.length; i < length; i++) {
      var node = children[i];
      if (node.nodeType == 1) {
        try {
          var key = node.tagName;
          //console.log(node.hasAttribute('ref'), node.getAttribute('ref'));
          this.map[key] = node.firstChild.nodeValue;
        } catch (ignored) {}
      }
    }
  },
  getConfig: function() {
    return this.map;
  },
  /*getNextValue: function() {
    //return !this.value;
  },*/
  setValue: function($super, key, value) {
    this.map[key] = value;
  },
  getValue: function($super, key) {
    return this.map[key];
  },
  getScreenValue: function(key) {
    return this.map[key];
  }
  /*getPreviousValue: function() {
    return this.getNextValue();
  }*/
});


Config.Property.Enum = Class.create(Config.Property, {
  type: 'enum',
  values: null,
  initialize: function($super, xmlConfig) {
    $super(xmlConfig);

    this.values = [];
    this.value = xmlConfig.getAttribute('default');
    this.defaultValue = this.value;

    var enumElement = xmlConfig.getElementsByTagName('enum')[0];
    var values = enumElement.getElementsByTagName('value');
    for (var i = 0, length = values.length; i < length; i++) {
      this.values.push(values[i].firstChild.nodeValue);
    }
    if (this.values.indexOf(this.value) < 0) {
      this.value = this.values[0];
    }
  },
  getValues: function() {
    return this.values;
  },
  setValue: function($super, value) {
    if (this.values.indexOf(value) >= 0) {
      this.value = value;
    }
    $super();
  },
  getNextValue: function() {
    var currentIndex = this.values.indexOf(this.value); 
    if (currentIndex < 0) {
      return this.values[0];
    } else {
      if (currentIndex + 1 >= this.value.length) {
        return this.values[0];
      } else {
        return this.values[currentIndex + 1];
      }
    }
  },
  getPreviousValue: function() {
    var currentIndex = this.values.indexOf(this.value);
    if (currentIndex < 0) {
      return this.values[0];
    } else {
      if (currentIndex - 1 < 0) {
        return this.values[this.values.length - 1];
      } else {
        return this.values[currentIndex - 1];
      }
    }
  },
  toString: function($super) {
    return $super() + ' [' + this.values + ']';
  }
});

Config.Property.Number = Class.create(Config.Property, {
  type: 'number',
  initialize: function($super, xmlConfig) {
    $super(xmlConfig);

    this.value = parseInt(xmlConfig.getAttribute('default'));

    var range = xmlConfig.getElementsByTagName('range')[0];
    this.step = parseInt(range.getAttribute('step'));
    this.min = parseInt(range.getAttribute('min'));
    this.max = parseInt(range.getAttribute('max'));

    if (this.min > this.max) {
      var temp = this.max;
      this.max = this.min;
      this.min = temp;
    }

    if (this.value < this.min) {
      this.value = this.min;
    } else if (this.value > this.max) {
      this.value = this.max;
    }
    this.defaultValue = this.value;
  },
  setValue: function($super, value) {
    if (typeof (value) === 'number') {
      if (value >= this.min) {
        this.value = value;
      } else {
        this.value = this.min;
      }
      if (value <= this.max) {
        this.value = value;
      } else {
        this.value = this.max;
      }
    } else {
      this.setValue(parseInt(value));
    }
    $super();
  },
  getNextValue: function() {
    var nextValue = this.value + this.step;
    return nextValue > this.max ? this.min : nextValue;
  },
  getPreviousValue: function() {
    var prevValue = this.value - this.step;
    return prevValue < this.min ? this.max : prevValue;
  }
});

Config.Property.Boolean = Class.create(Config.Property, {
  type: 'boolean',
  initialize: function($super, xmlConfig) {
    $super(xmlConfig);

    if (xmlConfig.hasAttribute('default')) {
      this.value = this._getBoolean(xmlConfig.getAttribute('default').toLowerCase());
    } else {
      this.value = false;
    }
    this.defaultValue = this.value;
  },
  getNextValue: function() {
    return !this.value;
  },
  setValue: function($super, value) {
    if (typeof (value) === 'boolean') {
      this.value = value;
    } else {
      this.value = this._getBoolean(value);
    }
    $super();
  },
  getScreenValue: function() {
    return this.value ? 'on' : 'off';
  },
  _getBoolean: function(value) {
    switch (value) {
      case true:
      case 'true':
      case '1':
        return true;
        break;
      case false:
      case 'false':
      case '0':
        return false;
        break;
      default:
        return false;
        break;
    }
  },
  getPreviousValue: function() {
    return this.getNextValue();
  }
});


Object.extend(Config.Property, {
  parse: function(propertyString) {
    var parts = propertyString.split('|');

    switch (parts[parts.length - 1]) {
      case "boolean":
      break;

      case "number":
      break;

      case "string":
      break;
    }
  },
  create: function(xmlProperty) {
    if (!xmlProperty.hasAttribute('type')) return null;
    var property;

    switch (xmlProperty.getAttribute('type')) {
      case 'boolean':
          property = new Config.Property.Boolean(xmlProperty);
        break;
      case 'enum':
          property = new Config.Property.Enum(xmlProperty);
        break;
      case 'number':
          property = new Config.Property.Number(xmlProperty);
        break;
     case 'complex':
          property = new Config.Property.Complex(xmlProperty);
        break;
    }

    return property;
  }
});