define('screens/editor', ['screens/screen'], function() {
  Game.Screen.Editor = Class.create(Game.Screen, {
    name: 'Editor',
    rendered: false,
    selected: null,
    pressed: null,
    mapName: null,
    author: null,
    players: null,
    size: null,
    data: null,
    init: function() {
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            Game.instance.setScreen(Game.Screen.Menu);
          }
        }
      };
      if (!Config.getValue('debug')) {
        document.onmousedown = function() {return true}; // enable text selection - chromium
        document.oncontextmenu = function() {return true}; // enable context menu
      }
      this.initData(10, 12);
    },
    initData: function(x, y) {
      this.size = {x: x, y: y};
      this.data = [];
      for (var i = 0; i < this.size.y; i++) {
        this.data.push([]);
        for (var j = 0; j < this.size.x; j++) {
          this.data[i].push(' ');
        }
      }
    },
    dispatch: function($super) {
      this.preview.remove();
      this.toolbox.remove();
      if (!Config.getValue('debug')) {
        document.onmousedown = function() {return false}; // enable text selection - chromium
        document.oncontextmenu = function() {return false}; // enable context menu
      }
    },
    update: function(delay) {
    },
    render: function(delay) {
      if (!this.rendered) {
        this.rendered = true;
        this.prerender();
      } else {

      }
    },
    prerender: function() {
      this.preview = new Element('div').addClassName('preview');
        this.toolbox = new Element('div').addClassName('toolbox');

        this.properties = new Element('div').addClassName('properties');
        this.tilesBox = new Element('div').addClassName('tiles');
        this.properties.appendChild(new Element('h2').addClassName('title').update('Properties'));

        this.properties.appendChild(new Element('label').addClassName('name').update('Map name:'));
        this.properties.appendChild(new Element('br'));
        this.properties.appendChild(new Element('input').addClassName('name'));
        this.properties.appendChild(new Element('br'));
        this.properties.appendChild(new Element('label').addClassName('name').update('Author:'));
        this.properties.appendChild(new Element('br'));
        this.properties.appendChild(new Element('input').addClassName('author'));
        this.properties.appendChild(new Element('br'));

        this.properties.appendChild(new Element('label').addClassName('name').update('Players'));
        this.properties.appendChild(new Element('br'));
        this.players = new Element('select');
        this.properties.appendChild(this.players);
        for (var p = 2; p <= 8; p++) {
          this.players.appendChild(new Element('option').update(p));
        }
        this.properties.appendChild(new Element('br'));

        this.properties.appendChild(new Element('label').addClassName('name').update('Map size'));
        this.properties.appendChild(new Element('br'));
        this.xAxis = new Element('select');
        this.properties.appendChild(this.xAxis);
        for (var x = 4; x <= 16; x++) {
          this.xAxis.appendChild(new Element('option').update(x));
        }

        this.yAxis = new Element('select');
        this.properties.appendChild(this.yAxis);
        for (var y = 4; y <= 16; y++) {
          this.yAxis.appendChild(new Element('option').update(y));
        }
        document.body.observe('mousedown', function() {
          this.pressed = true;
        }.bind(this));
        document.body.observe('mouseup', function() {
          this.pressed = false;
        }.bind(this));

        this.properties.appendChild(new Element('br'));
        this.properties.appendChild(new Element('br'));

        this.properties.appendChild(new Element('button').update('Apply').observe('click', this.onPropertyChanged.bind(this)));
        this.properties.appendChild(new Element('br'));

        this.tilesBox.appendChild(new Element('h2').addClassName('title').update('Tiles'));

        this.tiles = $A();
        this.tiles.push('wall');
        this.tiles.push('box');
        this.tiles.push('ice');
        this.tiles.push('trap');
        this.tiles.push('arrow north');
        this.tiles.push('ground');
        this.tiles.push('arrow west');
        this.tiles.push('arrow south');
        this.tiles.push('arrow east');
        this.tiles.push('none');

        this.tiles.each(function(item) {
          var element = new Element('div').addClassName('tile').addClassName(item);
          element.observe('click', function(e) {
            if (this.selected !== null) {
              if (this.selected.indexOf(' ') >= 0) {
                var classes = this.selected.split(' ').join('.');
                this.tilesBox.select('.' + classes)[0].removeClassName('selected');
              } else {
                this.tilesBox.select('.' + this.selected)[0].removeClassName('selected');
              }

            }
            this.selected = item;
            e.element().addClassName('selected');
          }.bind(this));

          this.tilesBox.appendChild(element);
        }.bind(this));

        this.tilesBox.appendChild(new Element('div').addClassName('clear'));

        this.tilesBox.appendChild(new Element('button').addClassName('action').update('Fill').observe('click', this.fill.bind(this)));
        this.tilesBox.appendChild(new Element('button').addClassName('action').update('Clear').observe('click', this.clear.bind(this)));

        this.preview.observe('mouseover', function() {
          document.onmousedown = function() {return false}; // enable text selection - chromium
          document.getSelection().removeAllRanges();
        });
        this.preview.observe('mouseout', function() {
          document.onmousedown = function() {return true}; // enable text selection - chromium
        });

        this.toolbox.appendChild(this.properties);
        this.toolbox.appendChild(this.tilesBox);

        this.actionsBox  = new Element('div').addClassName('actions');
        this.actionsBox.appendChild(new Element('h2').addClassName('title').update('Actions'));

        this.actionsBox.appendChild(new Element('button').addClassName('action').update('Save').observe('click', this.save.bind(this)));
        this.actionsBox.appendChild(new Element('button').addClassName('action').update('Download').observe('click', this.download.bind(this)));
        this.actionsBox.appendChild(new Element('button').addClassName('action').update('Upload').observe('click', this.upload.bind(this)));
        this.actionsBox.appendChild(new Element('button').addClassName('action').update('Email').observe('click', this.email.bind(this)));


        this.toolbox.appendChild(this.actionsBox);
        this.container.appendChild(this.preview);
        this.container.appendChild(this.toolbox);


        for (var i = 0; i < this.size.y; i++) {
          for (var j = 0; j < this.size.x; j++) {
            var tile = new Element('div', {id: i + 'x' + j}).addClassName('tile none');
            tile.observe('mousedown', function(e) {
              this.pressed = true;
              if (this.selected) {
                e.element().className = 'tile';
                e.element().addClassName(this.selected);
              }
            }.bind(this));
            tile.observe('mouseup', function(e) {
              this.pressed = false;
            }.bind(this));
            tile.observe('mouseover', function(e) {
              if (this.pressed && this.selected) {
                e.element().className = 'tile';
                e.element().addClassName(this.selected);
              }
            }.bind(this));

            tile.observe('mouseout', function(e) {
            }.bind(this));

            tile.setStyle({
              top: (i * 40) + 15 + 'px',
              left: (j * 40) + 15 + 'px'
            });
            this.preview.appendChild(tile);
          }
        }
    },
    onPropertyChanged: function() {
      console.log('changed');
      this.mapName = '';
      this.author = '';
      this.players = 5;

      this.initData(10, 12);
    },
    resize: function(x, y) {
      
    },
    clear: function() {
      console.log('clear');
      this.initData(this.size.x, this.size.y);
      this.eachTile(function(element) {
        element.className = 'tile none';
      });
    },
    fill: function() {
      console.log('fill');
      if (this.selected) {
        this.initData(this.size.x, this.size.y);
        this.eachTile(function(element) {
          element.className = 'tile ' + this.selected;
          console.log('tile ' + this.selected);
        }.bind(this));
      }
    },
    eachTile: function(callback) {
      for (var y = 0; y < this.size.y; y++) {
        for (var x = 0; x < this.size.x; x++) {
          callback($(y +'x' + x));
        }
      }
    },
    undo: function() {
    },
    redo: function() {
    },
    upload: function() {
      console.log('upload');
    },
    download: function() {
      // FileSaver api
      console.log('download');
    },
    email: function() {
      window.location.href = 'mailto:Maxim Borkunov<maxim.borkunov@gmail.com>?subject=Please add this map&body=' + this.serialize();
    },
    serialize: function() {
      return 'Hello\n World';
    },
    save: function() {
      console.log('save');
    }
  })
});

