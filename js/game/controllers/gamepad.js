import Controller from 'babel!./controller';

export default class Gamepad extends Controller {

  constructor(type) {
    super();
    this.i = 1;
    this.gamepadIndex = type;
    this.keys = type;
  }

  update(keys, delay) {
    if (!this.active) return;
    var gamepad = navigator.getGamepads()[this.gamepadIndex];
    if (!(gamepad && gamepad.connected)) return;

    var left   = gamepad.axes[4] < 0;
    var right  = gamepad.axes[4] > 0;
    var down   = gamepad.axes[5] > 0;
    var up     = gamepad.axes[5] < 0;

    var action = gamepad.buttons[0].pressed ||
                 gamepad.buttons[1].pressed ||
                 gamepad.buttons[2].pressed ||
                 gamepad.buttons[3].pressed ||
                 gamepad.buttons[4].pressed;

    super.react(up, right, down, left, action, delay);
  }

  static initialize() {
    if (Gamepad._initialized) {
      Gamepad._initialized = true;
      return;
    }

    window.addEventListener("gamepadconnected", function(e) {
      var gp = navigator.getGamepads()[e.gamepad.index];
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gp.index, gp.id,
        gp.buttons.length, gp.axes.length);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
      console.log("Gamepad disconnected from index %d: %s",
        e.gamepad.index, e.gamepad.id);
    });
  }
}

Gamepad.initialize();