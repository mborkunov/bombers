export default class Scene {

  constructor() {
    this.actors = [];
  }
/*
  /!**
   * @param {Actor} object
   *!/
  add(object) {
    if (object instanceof objects.Bomb) {
      this.objects.bombs.push(object);
    } else if (object instanceof objects.Explosion) {
      this.objects.explosions.push(object);
    } else if (object instanceof objects.extras.Extra) {
      this.objects.extras.push(object);
    } else if (object instanceof objects.Corpse) {
      this.objects.corpses.push(object);
    } else if (object instanceof objects.Bomber) {
      this.objects.bombers.push(object);
    } else if (object instanceof objects.Arbiter) {
      this.objects.arbiter = object;
    }
    object.arena = this;
  }

  /!**
   * @param {Actor} object
   *!/
  remove(object) {
    if (object instanceof objects.Bomber) {
      this.objects.bombers = this.objects.bombers.without(object);
    } else if (object instanceof objects.extras.Extra) {
      this.objects.extras = this.objects.extras.without(object);
    } else if (object instanceof objects.Explosion) {
      this.objects.explosions = this.objects.explosions.without(object);
    } else if (object instanceof objects.Bomb) {
      this.objects.bombs = this.objects.bombs.without(object);
    } else if (object instanceof objects.Corpse) {
      this.objects.corpses = this.objects.corpses.without(object);
    }
    object.arena = null;
  }*/
}

export class Actor {

  constructor() {
  }

  set scene(scene) {
    this._scene = scene;
  }

  update(delay) {
  }
  
  prerender() {
    
  }

  render(delay) {
  }
}