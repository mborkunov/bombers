var Options = Class.create(Screen, {
     counter: 0,
     name: 'Options',
     menu: null,
     rendered: false,
     modes: $A([
      {x: 320, y: 240},
      {x: 640, y: 480},
      {x: 800, y: 600},
      {x: 1024, y: 768},
      {value: 'fullscreen', text: 'Fullscreen'}
     ]),
     themes: $A([
       {name: 'Default', id: 'original'},
       {name: 'Dark', id: 'dark'},
       {name: 'Snow', id: 'snow'},
       {name: 'Green', id: 'default'},
       {name: 'Strange', id: 'strange'},
       {name: 'Stone', id: 'stone'}
     ]),
     init: function() {
        this.listeners = {
            mousemove: function(e) {
            },
            keydown: function(e) {
              if (e.keyCode == Event.KEY_ESC) {
                Game.instance.setScreen(Menu);
              }
            }.bind(this),
            keyup: function(e) {
                if (e.keyCode == 27) {
                    Game.instance.setScreen(Menu);
                }
            }.bind(this)
        };

        var fieldset = new Element('fieldset');
        var legends = $A([
          new Element('legend', {active:''}).update('General Settings'),
          new Element('legend').update('Controls'),
          new Element('legend').update('Players')
        ]);
        legends.each(function(legend) {
          legend.observe('click', function(e) {
            legends.each(function(item) {item.removeAttribute('active')});
            e.element().setAttribute('active', '');

            // todo: switch options layout
          });
          fieldset.appendChild(legend);
        })

        fieldset.appendChild(new Element('div').addClassName('clear'));

         var select = new Element('select', {id: 'options-screenmode'});

         var width = this.container.getWidth();
         var height = this.container.getHeight();
         var fullScreenElement;

         var options = this.modes.map(function(option) {
           var text = option.text || (option.x + 'x' + option.y);
           if (typeof option.value == 'undefined') {
             return new Element('option', {x: option.x, y: option.y}).update(text);
           } else {
             return fullScreenElement = new Element('option', {value: option.value, selected: 'selected'}).update(text)
           }
         })

         options.each(function(item) {
           if (parseInt(item.getAttribute('x')) == width && parseInt(item.getAttribute('y')) == height) {
             fullScreenElement.removeAttribute('selected');
             item.setAttribute('selected', 'selected');
           }
         });

         options.each(function(select, item) {
              select.appendChild(item);
         }.bind(this, select));

         this.container.appendChild(fieldset);
    
         fieldset.appendChild(new Element('label', {'for': 'options-screenmode'}).update('Screen mode'));
         fieldset.appendChild(select);
         select.on('change', function(event) {
             var select = event.element();
             var mode = select.options[select.selectedIndex];

             if (mode.value === 'fullscreen') {
                 this.container.addClassName('fullscreen');
                 this.container.removeAttribute('style');
             } else {
                 var x = parseInt(mode.getAttribute('x'));
                 var y = parseInt(mode.getAttribute('y'));

                 this.container.setStyle({width: x + 'px', height: y +'px', margin: -(y / 2) + 'px  0 0 ' +  -(x / 2) + 'px'});
                 this.container.removeClassName('fullscreen');
             }
         }.bind(this));

         var themeSelectElement = new Element('select', {id: 'options-theme'});
         var themeElements = this.themes.map(function(theme) {
           return new Element('option', {value: theme.id}).update(theme.name);
         });
         themeElements.each(function(themeElement) {
           var themeLink = $('theme');
           if (themeLink && themeLink.getAttribute('name') == themeElement.value) {
             themeElement.setAttribute('selected', 'selected');
           }
           themeSelectElement.appendChild(themeElement);
         });

         themeSelectElement.on('change', function(e) {
           var theme = e.element().value;
           Game.instance.setTheme(theme);
         });

         fieldset.appendChild(new Element('br'));
         fieldset.appendChild(new Element('label', {'for': 'options-theme'}).update('Theme'));
         fieldset.appendChild(themeSelectElement);

         fieldset.appendChild(new Element('br'));
         fieldset.appendChild(new Element('label', {'for': 'options-sounds'}).update('Sounds'));
         var soundCheckbox = new Element('input', {id: 'options-sounds', type: 'checkbox', checked: Sound.isEnabled()})
             .observe('change', function(e) {Sound.setEnabled(e.element().checked)});
         fieldset.appendChild(soundCheckbox);

         var actionsElement = new Element('div').addClassName('actions');
         actionsElement.appendChild(new Element('a').update('Back').observe('click', function() {
             Game.instance.setScreen(Menu);
         }.bind(this)));
         actionsElement.appendChild(new Element('div').addClassName('clear'));
         fieldset.appendChild(actionsElement);
     },
     dispatch: function($super) {
         $super();
     },
     update: function() {
     },
     render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
            //this.menu.render(this.container);
        }
     }
});
