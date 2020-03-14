import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from './utils.js'
import { Scene2 } from './Scene2.js'

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH * TILE_SIZE,
  height: SCREEN_HEIGHT * TILE_SIZE,
  scene: [Scene2],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      // debug: true,
    },
  },
}

window.onload = function() {
  const game = new Phaser.Game(config)
}
