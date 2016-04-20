import Screen from 'babel!./screen';
import Arena from 'babel!./arena';
import Menu from 'babel!./menu';
import Map from 'babel!../tiles/map';

export default class Level extends Screen {

  constructor(container, callback) {
    super('levels', container);
    this.callback = callback;
    this.rendered = false;
    this.selected = 0;
    this.mapList = Map.list();
    this.listeners = {
      click: function() {
      },
      keydown: function(e) {
        if (e.keyCode == 13) {
          callback(Arena, this.mapList[this.selected]);
        } else if (e.keyCode == 27) {
          callback(Menu);
        }

        if (e.keyCode == Event.KEY_DOWN) {
          this.selectNext();
        } else if (e.keyCode == Event.KEY_UP) {
          this.selectPrevious();
        }
      }.bind(this)
    };
    this.prerender();
  }

  select(index) {
    this.selected = index;
    this.rendered = false;
  }

  selectNext() {
    this.selected++;
    if (this.selected >= this.mapList.length) {
      this.selected = 0;
    }
    this.rendered = false;
  }

  selectPrevious() {
    this.selected--;
    if (this.selected < 0) {
      this.selected = this.mapList.length - 1;
    }
    this.rendered = false;
  }

  dispatch() {
    this.container.update('');
  }

  update() {
  }

  render() {
    if (!this.rendered) {
      this.rendered = true;
      this.listElement.select('li.selected')[0].removeClassName('selected');
      this.listElement.select('li')[this.selected].addClassName('selected');
      this.preview.addClassName('loading');
      this.area.update('');

      Map.load(this.mapList[this.selected], function(map) {
        map.prerender(this.area);
        this.preview.removeClassName('loading');
        this.area.select('span.map-name')[0].remove();
      }.bind(this));
    }
  }

  prerender() {
    this.listElement = new Element('ul').addClassName('list');
    this.preview = new Element('div').addClassName('preview').addClassName('loading');
    this.area = new Element('div').addClassName('area');
    this.preview.appendChild(this.area);
    this.mapList.each(function(name, i) {
      let index = i;
      var listItem = new Element('li').update(name);
      listItem.observe('mouseover', function() {
        this.select(index);
      }.bind(this));
      listItem.observe('click', function() {
        this.callback(Arena, this.mapList[this.selected]);
      }.bind(this));
      this.listElement.appendChild(listItem);
      if (i == this.selected) {
        listItem.addClassName('selected');
        Map.load(name, function(map) {
          map.prerender(this.area);
          this.preview.removeClassName('loading');
        }.bind(this));
      }
    }.bind(this));
    this.container.appendChild(this.listElement);
    this.container.appendChild(this.preview);
    super.prerender();
  }
}