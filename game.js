import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from './utils.js'
import { Scene0 } from './Scene0.js'
import { Scene1 } from './Scene1.js'
import { Scene2 } from './Scene2.js'
import { Scene3 } from './Scene3.js'
import { Scene4 } from './Scene4.js'

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH * TILE_SIZE,
  height: SCREEN_HEIGHT * TILE_SIZE,
  scene: [Scene0, Scene1, Scene2, Scene3, Scene4],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      // debug: true,
    },
  },
}

window.onload = function () {
  const game = new Phaser.Game(config)
}
