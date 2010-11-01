var Options = Class.create(Screen, {
     counter: 0,
     name: "Options",
     menu: null,
     rendered: false,
     init: function() {
         this.listeners = {
            mousemove: function(e) {
            },
            keydown: function(e) {
            }.bind(this),
            keyup: function(e) {
                if (e.keyCode == 27) {
                    Game.instance.setScreen(new Start());
                }
            }.bind(this)
        }

         var fieldset = new Element("fieldset").appendChild(new Element("legend").update("General Settings")).parentNode;
         var select = new Element("select", {id: "options-screenmode"});

         var options = $A([
            new Element("option", {x: 320, y: 200}).update("320x200"),
             new Element("option", {x: 640, y: 480}).update("640x480"),
             new Element("option", {x: 800, y: 600}).update("800x600"),
             new Element("option", {x: 1024, y: 768}).update("1024x768"),
             new Element("option", {value: "fullscreen"}).update("fullscreen")
         ]);

         options.each(function(select, item) {
              select.appendChild(item);
         }.bind(this, select));

         this.container.appendChild(fieldset);

         fieldset.appendChild(new Element("label", {"for": "options-screenmode"}).update("Screen mode"));
         fieldset.appendChild(select);
         select.on("change", function(event) {
             var select = event.element();
             var mode = select.options[select.selectedIndex];

             if (mode.value === "fullscreen") {
                 this.container.addClassName("fullscreen");
                 this.container.removeAttribute("style");
             } else {
                 var x = parseInt(mode.getAttribute("x"));
                 var y = parseInt(mode.getAttribute("y"));

                 this.container.setStyle({width: x + "px", height: y +"px", margin: -(y / 2) + "px  0 0 " +  -(x / 2) + "px"});
                 this.container.removeClassName("fullscreen");
             }
         }.bind(this));

         fieldset.appendChild(new Element("label", {"for": "options-sounds"}).update("Sounds"));
         fieldset.appendChild(new Element("input", {id: "options-sounds", type: "checkbox"}));

         var actionsElement = new Element("div").addClassName("actions");
         actionsElement.appendChild(new Element("a").update("Back").observe("click", function() {
             Game.instance.setScreen(new Start());
         }.bind(this)));
         actionsElement.appendChild(new Element("div").addClassName("clear"));
         fieldset.appendChild(actionsElement);

     },
     dispatch: function() {
         this.container.update();
         this.rendered = false;
     },
     update: function() {
     },
     render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
            //this.menu.render(this.container);
        }
     },
     listeners: {
         mousemove: function(e) {
         },
         keydown: function(e) {
             console.log(e);
         }
     }
});
