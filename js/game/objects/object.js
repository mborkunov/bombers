var GameObject = Class.create({
  canFlyOverWalls: null,
  canKick: null,
  canPassBomber: null,
  stopped: null,
  flying: null,
  falling: null,
  fallen: null,
  element: null,
  speed: null,
  x: null,
  y: null,
  direction: null,
  

  initialize: function() {
    
  },
  getElement: function() {
    return this.element;
  },
  setDirection: function(direction) {

  },
  snap: function() {

  },
  setPosition: function(x, y) {

  },
  getX: function() {

  },
  getY: function() {

  },
  setOffset: function(x, y) {

  },
  getSpeed: function() {
    return this.speed;
  },
  setSpeed: function(speed) {
    this.speed = speed;
  },
  increaseSpeed: function(s) {
    this.speed += s || 1;
  },
  decreaseSpeed: function(s) {
    this.speed -= s || 1;
  },
  fall: function(_continue) {

  },
  move: function(speed, direction) {

  },
  flyTo: function(x, y) {

  },
  gainKick: function() {
    
  },
  loseKick: function() {

  }
});