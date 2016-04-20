const Config = {
  /** @type Object */
  properties: {},
  /** @type Object */
  types: {},
  getProperty: function(key) {
    if (typeof (this.properties[key]) !== 'undefined') {
      return this.properties[key];
    }
    var message = 'There is no property for id #' + key;
    console.error(message);
    throw message;
  },
  getValue: function(key) {
    return Config.getProperty(key).getValue();
  },
  change: function(key, direct) {
    var property = Config.getProperty(key);
    var nextValue = direct ? property.getNextValue() : property.getPreviousValue();
    property.setValue(nextValue);
    localStorage.setItem(key, property.getValue());
    return property.getValue();
  },
  initialize: function(options) {
    new Ajax.Request('config.xml', {
      method: 'get',
      onSuccess: function(t) {
        var xml = t.responseXML;

        var gui = new dat.GUI();
        var properties = xml.getElementsByTagName('property');
        for (var i = 0; i < properties.length; i++) {
          var property = Property.create(properties[i]);
          property.loadUserValue();
          Config.properties[property.getId()] = property;

          var folder = gui.createFolder(property.getId());
          if (!(property instanceof ComplexProperty)) {
            var parts = property.getId().split('.');
            var name = parts[parts.length - 1];
            if (property instanceof NumberProperty) {
              folder.add(property, name, property.min, property.max, property.step, property.step, property.step).listen();
            } else {
              folder.add(property, name).listen();
            }
          }
        }
        console.log(properties.length + " config properties were loaded");
        options.onSuccess();
      },
      onFailure: options.onFailure
    });
  }
};

class Property {

  constructor(type, xmlConfig) {
    this.value = null;
    this.type = type;
    this.defaultValue = null;
    this.immutable = null;
    this.id = xmlConfig.getAttribute('id');
    this.name = xmlConfig.getElementsByTagName('name')[0].firstChild.nodeValue;
    this.immutable = xmlConfig.hasAttribute('immutable') && xmlConfig.getAttribute('immutable').toLowerCase() == 'true';
    this.listeners = [];

    var split = this.id.split('.');
    this.propertyName = split[split.length - 1];

    this.__defineGetter__(this.propertyName, function(value) {
      return this.value;
    }.bind(this));

    this.__defineSetter__(this.propertyName, function(value) {
      this.value = value;
      window['localStorage'].setItem(this.id, value);

      console.log('Config', this.id, value);
      this.listeners.forEach(function(listener) {
        listener(value);
      })
    }.bind(this));
  }

  initProperty(value) {
    var parts = this.id.split('.');
    this[parts[parts.length - 1]] = value || this.value;
  }

  loadUserValue() {
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
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }

  getScreenValue() {
    return this.value;
  }

  addListener(listener, fire) {
    this.listeners.push(listener);
    if (typeof fire === 'undefined' || fire) {
      listener(this.value);
    }
  }

  setValue() {
    if (this.immutable) {
      throw 'Cannot change immutable property';
    }
    localStorage.setItem(this.id, this.value);
    this.initProperty();
  }

  getNextValue() {return null}

  getPreviousValue() {return null}

  toString() {
    return '(' + this.type + ') #' + this.id + ' ' + this.value + ' <' + this.getPreviousValue() + '|' + this.getNextValue() + '>' + ' - ' + this.name;
  }

  static parse(propertyString) {
    var parts = propertyString.split('|');

    switch (parts[parts.length - 1]) {
      case "boolean":
        break;

      case "number":
        break;

      case "string":
        break;
    }
  }

  static create(xmlProperty) {
    if (!xmlProperty.hasAttribute('type')) return null;
    var property;

    switch (xmlProperty.getAttribute('type')) {
      case 'boolean':
        property = new BooleanProperty(xmlProperty);
        break;
      case 'enum':
        property = new EnumProperty(xmlProperty);
        break;
      case 'number':
        property = new NumberProperty(xmlProperty);
        break;
      case 'complex':
        property = new ComplexProperty(xmlProperty);
        break;
/*      case 'list':
        property = new ListProperty(xmlProperty);
        break;*/
    }

    return property;
  }
}

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

class ComplexProperty extends Property {

  constructor(xmlConfig) {
    super('complex', xmlConfig);
    this.map = {};

    var children  = xmlConfig.childNodes;

    for (var i = 0, length = children.length; i < length; i++) {
      var node = children[i];
      if (node.nodeType == 1) {
        try {
          var key = node.tagName;
          this.map[key] = node.firstChild.nodeValue;
        } catch (ignored) {}
      }
    }
  }

  getConfig() {
    return this.map;
  }
  /*getNextValue: function() {
    //return !this.value;
  },*/
  setValue(key, value) {
    this.map[key] = value;
  }

  getValue(key) {
    return this.map[key];
  }

  getScreenValue(key) {
    return this.map[key];
  }
  /*getPreviousValue: function() {
    return this.getNextValue();
  }*/
}

class EnumProperty extends Property {

  constructor(xmlConfig) {
    super('enum', xmlConfig);

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
    this.initProperty(); //this.values
  }

  getValues() {
    return this.values;
  }

  setValue(value) {
    if (this.values.indexOf(value) >= 0) {
      this.value = value;
    }
    super.setValue()
  }

  getNextValue() {
    var currentIndex = this.values.indexOf(this.value);
    if (currentIndex < 0) {
      return this.values[0];
    } else {
      if (currentIndex + 1 >= this.values.length) {
        return this.values[0];
      } else {
        return this.values[currentIndex + 1];
      }
    }
  }

  getPreviousValue() {
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
  }

  toString() {
    return super.toString() + ' [' + this.values + ']';
  }
}

class NumberProperty extends Property {

  constructor(xmlConfig) {
    super('number', xmlConfig);

    this.value = parseFloat(xmlConfig.getAttribute('default'));

    var range = xmlConfig.getElementsByTagName('range')[0];
    this.step = parseFloat(range.getAttribute('step'));
    this.min = parseFloat(range.getAttribute('min'));
    this.max = parseFloat(range.getAttribute('max'));

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
    this.initProperty();
  }

  setValue(value) {
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
      this.setValue(parseFloat(value));
    }
    super.setValue();
  }

  getNextValue() {
    var nextValue = this.value + this.step;
    return nextValue > this.max ? this.min : nextValue;
  }

  getPreviousValue() {
    var prevValue = this.value - this.step;
    return prevValue < this.min ? this.max : prevValue;
  }
}

class BooleanProperty extends Property {
  constructor(xmlConfig) {
    super('boolean', xmlConfig);

    if (xmlConfig.hasAttribute('default')) {
      this.value = this._getBoolean(xmlConfig.getAttribute('default').toLowerCase());
    } else {
      this.value = false;
    }
    this.defaultValue = this.value;
    this.initProperty();
  }

  getNextValue() {
    return !this.value;
  }

  setValue(value) {
    if (typeof (value) === 'boolean') {
      this.value = value;
    } else {
      this.value = this._getBoolean(value);
    }
    super.setValue();
  }

  getScreenValue() {
    return this.value ? 'on' : 'off';
  }

  _getBoolean(value) {
    return value === true || value === 'true' || value === '1';
  }

  getPreviousValue() {
    return this.getNextValue();
  }
}

export default Config;