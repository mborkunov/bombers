var MenuTree = Class.create({
    items: null,
    list: null,
    initialize: function() {
        this.items = [];
    },
    addItem: function(item) {
        /*if (this.items.length === 0) {
            item.setSelected(true);
        }*/
        this.items.push(item);
        return this;
    },
    clearItems: function() {
        this.items.clear();
    },
    getSelectedItem: function() {
        return this.items.filter(function(item) {
            return item.isSelected() ? item : null;
        })[0];
    },
    selectItem: function(item) {
        this.items.each(function(item) {
            item.setSelected(false);
        });
        item.setSelected(true);
    },
    render: function(container) {
        this.list = new Element("ul", {id: "menu"});
        this.items.each(function(list, item) {
            var li = new Element("li").update(item.getName());
            li.observe("mouseover", function() {
                Sound.play('break');
                this.over = true;
                if (typeof(this.working) === "undefined") {
                    this.working = false;
                }
                if (typeof(this.finished) === "undefined") {
                    this.finished = true;
                }

                if (this.finished) {
                    this.finished = false;
                    this.working = true;
                    new Effect.Morph(li, {
                        duration: .5,
                        style: 'background:#000; color: #fff',
                        afterFinish: function() {
                            this.finished = true;
                            this.working = false;
                            if (this.over == false) {
                                this.working = true;
                                this.finished = false;
                                new Effect.Morph(li, {
                                    duration: .5,
                                    style: 'background:#fff; color: #000',
                                    afterFinish: function() {
                                        this.finished = true;
                                        this.working = false;
                                    }.bind(this)
                                });
                            }
                        }.bind(this)
                    });
                }
            }.bind(li));
            li.observe("mouseout", function() {
                this.over = false;
                if (this.finished) {
                    this.finished = false;
                    this.working = true;
                    new Effect.Morph(li, {
                        duration: .5,
                        style: 'background:#fff; color: #000',
                        afterFinish: function() {
                            this.finished = true;
                            this.working = false;
                            if (this.over) {
                                this.working = true;
                                this.finished = false;
                                new Effect.Morph(li, {
                                    duration: .5,
                                    style: 'background:#000; color: #fff',
                                    afterFinish: function() {
                                        this.finished = true;
                                        this.working = false;
                                    }.bind(this)
                                });
                            }
                        }.bind(this)
                    });
                }
            }.bind(li));

            li.observe("click", function() {
                Sound.play('clear');
                this.actionHandler(this);
            }.bind(item));
            this.list.appendChild(li);
        }.bind(this, this.list));
        container.appendChild(this.list);
    },
    dispatch: function() {
        this.clearItems();
        this.list.remove();
    },
    toString: function() {
        return "Menu {" + this.items + "}";
    }
});

var MenuItem = Class.create({
    disabled: false,
    name: null,
    actionHandler: null,
    selected: false,
    items: null,
    initialize: function(name, actionHandler) {
        this.name = name;
        this.actionHandler = actionHandler;
    },
    getName: function() {
        return this.name;
    },
    addItem: function(item) {
    },
    getActionHandler: function() {
        return this.actionHandler;
    },
    setSelected: function(selected) {
        this.selected = selected;
    },
    isSelected: function() {
        return this.selected;
    },
    toString: function() {
        return "item: " + this.name;
    }
});
