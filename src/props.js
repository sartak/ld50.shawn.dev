import {
  builtinPropSpecs,
  ManageableProps,
  PropLoader,
  makePropsWithPrefix,
  preprocessPropSpecs,
} from "./scaffolding/lib/props";

const particleImages = ["dot"];

export const commands = {
  jump: {
    input: [
      "keyboard.UP",
      "keyboard.Z",
      "keyboard.W",
      "keyboard.SPACE",
      "gamepad.A",
      "gamepad.B",
      "gamepad.X",
      "gamepad.Y",
    ],
  },
  down: {
    input: ["keyboard.DOWN", "gamepad.DOWN", "keyboard.S"],
  },
  left: {
    input: ["keyboard.LEFT", "gamepad.LEFT", "keyboard.A"],
  },
  right: {
    input: ["keyboard.RIGHT", "gamepad.RIGHT", "keyboard.D"],
  },
  lstick: {
    input: ["gamepad.LSTICK.RAW"],
    joystick: true,
  },
  rstick: {
    input: ["gamepad.RSTICK.RAW"],
    joystick: true,
  },

  restart: {
    input: ["keyboard.R"],
    execute: (scene) => scene.replaceWithSelf(),
    debug: true,
    unignorable: true,
    unreplayable: true,
  },
  quit: {
    input: ["keyboard.Q"],
    execute: "forceQuit",
    debug: true,
    unignorable: true,
    unreplayable: true,
  },
  recordCycle: {
    input: ["gamepad.R1"],
    unreplayable: true,
    debug: true,
    unignorable: true,
    execute: (scene, game) => {
      const { _replay, _recording } = game;
      if (_replay && _replay.timeSight) {
        game.stopReplay();
      } else if (_replay) {
        setTimeout(() => {
          game.stopReplay();
          game.beginReplay({ ..._replay, timeSight: true });
        });
      } else if (_recording) {
        game.stopRecording();
      } else {
        game.beginRecording();
      }
    },
  },
};

export const shaderCoordFragments = ["shockwave"];
export const shaderColorFragments = null;
export const shaderPipelines = {};

export const propSpecs = {
  ...builtinPropSpecs(commands, shaderCoordFragments, shaderColorFragments),
  "command.ignore_all.spawn": [
    false,
    null,
    (scene) => scene.command.ignoreAll("spawn"),
  ],
  "command.ignore_all.dying": [
    false,
    null,
    (scene) => scene.command.ignoreAll("dying"),
  ],

  "player.speed": [150, 1, 1000],
  "player.drag": [0.3, 0, 1],
  "player.gravityBase": [3000, 1, 10000],
  "player.baseJumpVelocity": [300, 1, 1000],
  "player.touchingDown": [false, null, "level.player.body.touching.down"],
  "player.isJumping": [false, null, "level.player.isJumping"],
  "player.hasLiftedOff": [false, null, "level.player.hasLiftedOff"],
  "player.hasReleasedJump": [false, null, "level.player.hasReleasedJump"],
  "player.jumpStart": [0, null, "level.player.jumpStart"],
  "player.maxJumpTime": [200, 0, 10000],
  "player.maxJumpTrauma": [0.5, 0, 1],
  "player.jumpTraumaDivisor": [3000, 0, 10000],

  "sun.speed": [10, 1, 100],
  "sun.downsamplesLeft": [
    0,
    null,
    (scene) => scene.downsamples && scene.downsamples.length,
  ],
  "level.replaceDelay": [2000, 0, 10000],
  "effects.playerDie.tween": [
    {
      duration: 200,
      alpha: 0,
    },
  ],
  "effects.playerDieHealthBar.tween": [
    {
      duration: 200,
      dy: 100,
      alpha: 0,
    },
  ],
  "effects.playerAsh.particles": [
    {
      image: "dot",
      blendMode: "ADD",
      accelerationY: 2000,
      lifespan: 500,
      speedX: 500,
      speedY: -1000,
      frequency: 1,
      quantity: 5,
    },
  ],
};

export const tileDefinitions = {
  ".": null, // background
  "#": {
    image: "test",
    group: "wall",
    combine: "#",
    isStatic: true,
    shadow: true,
  },
  "|": {
    image: "test",
    group: "ground",
    combine: "|",
    preferCombineVertical: true,
    isStatic: true,
  },
  I: {
    image: "test",
    group: "wall",
    combine: "I",
    preferCombineVertical: true,
    isStatic: true,
    shadow: true,
  },
  _: {
    image: "test",
    group: "ground",
    combine: "_",
    isStatic: true,
  },
  "@": {
    image: "player",
    group: "player",
  },
};

preprocessPropSpecs(propSpecs, particleImages);

export const manageableProps = new ManageableProps(propSpecs);
export const propsWithPrefix = makePropsWithPrefix(propSpecs, manageableProps);
export default PropLoader(propSpecs, manageableProps);
