var Config = {
  themes: ["default", "original", "debug", "snow"],
  getAsString: function(k) {
    var value = Config.get(k);
    if (typeof value == "boolean") return value ? "On" : "Off";
    else if (typeof value == "number") return value;
    else if (typeof value == "string") return value;

    return "---"
  },
  get: function(k) {
    var v = localStorage.getItem(k);
    if (v === null) {
      v = Config.getDefaultValue(k);
      Config.set(k, v);
    } else if (v.indexOf("|") > 0) {
      var value = v.split("|");
      if (value[1] == "boolean") v = value[0] === "true";
      else if (value[1] == "number") v = value[0] | 0;
      else if (value[1] == "string") v = value[0];
    }
    return v;
  },
  change: function(key) {
    var value = Config.get(key);

    if (typeof value == "boolean") {
      return Config.set(key, !value);
    } else if (typeof value == "number") {
      return Config.set(key, value < 16 ? value + 1 : 1);
    } else if (typeof value == "string") {
      if (key == "graphic.theme") {
        var theme;
        var index = Config.themes.indexOf(value);
        if (index < 0 || index + 1 >= Config.themes.length) {
          theme = Config.themes[0];
        } else {
          theme = Config.themes[++index];
        }
        return Config.set(key, theme);
      }
    }
  },
  set: function(k, v) {
    localStorage.setItem(k, v + "|" + typeof v);
    return v;
  },
  getDefaultValue: function(key) {
    if (key.indexOf("start") === 0) {
      if (key === "start.kick" || key === "start.glove") {
        return false;
      }
      return 1;
    } else if (key.indexOf("game") === 0) {
      switch (key) {
        case "game.random_bombers_positions":
          return true;
        case "game.random_maps":
          return true;
        case "game.win_points":
          return 5;
        case "game.round_time":
          return 60;
      }
    } else if (key.indexOf("extras") === 0) {
      return true;
    } else if (key.indexOf("max") === 0) {
      return 8;
    } else if (key.indexOf("diseases") === 0) {
      return true;
    } else if (key.indexOf("graphic") === 0) {
      if (key === "graphic.kidz") return false;
      else if (key === "graphic.theme") {
        return "default";
      }
      return true;
    } else if (key == "sounds") {
      return true;
    }
  },
  getProperty: function() {

  }
};


Config.Property = Class.create({
  getValue: function() {
  },
  getNextValue: function() {
  },
  getPreviousValue: function() {
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
  }
});

Config.Property.Type = Class.create({
});

Config.Property.Type.Enum = Class.create(Config.Property.Type, {
});

Config.Property.Type.Number = Class.create(Config.Property.Type, {
});

Config.Property.Type.Boolean = Class.create(Config.Property.Type, {
});
