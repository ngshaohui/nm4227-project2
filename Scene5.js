import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from './utils.js'

class Scene5 extends Phaser.Scene {
  constructor() {
    super('verification')
  }

  preload() {}

  create() {
    this.add
      .text(
        (SCREEN_WIDTH * TILE_SIZE) / 2,
        (SCREEN_HEIGHT * TILE_SIZE) / 2,
        'Your score has been submitted\nto Prof Alex for verification',
      )
      .setFontSize(40)
      .setOrigin(0.5)
    setTimeout(() => {
      // go to next level
      this.scene.start('reveal')
    }, 5000)
  }
}

export { Scene5 }
