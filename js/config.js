var Config = {
  properties: {},
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
        var properties = t.responseXML.getElementsByTagName('property');
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
  initialize: function(xmlConfig) {
    this.id = xmlConfig.getAttribute('id');
    this.name = xmlConfig.getElementsByTagName('name')[0].firstChild.nodeValue;
  },
  loadUserValue: function() {
    if (localStorage.getItem(this.id) !== null)  {
      this.setValue(localStorage.getItem(this.id));
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
    localStorage.setItem(this.id, this.value);
  },
  getNextValue: null,
  getPreviousValue: null,
  toString: function() {
    return '(' + this.type + ') #' + this.id + ' ' + this.value + ' <' + this.getPreviousValue() + '|' + this.getNextValue() + '>' + ' - ' + this.name;
  }
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

    this.value = this._getBoolean(xmlConfig.getAttribute('default').toLowerCase());
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
    }

    return property;
  }
});