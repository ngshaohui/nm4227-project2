import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from './utils.js'

class Scene5 extends Phaser.Scene {
  constructor() {
    super('verification')
  }

  preload() {
    this.load.image('submit_screen', 'assets/submit_screen.png')
  }

  create() {
    const submit_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'submit_screen',
    )
    const scaleX = this.cameras.main.width / submit_screen.width
    const scaleY = this.cameras.main.height / submit_screen.height
    const scale = Math.min(scaleX, scaleY)
    submit_screen.setScale(scale).setScrollFactor(0)

    setTimeout(() => {
      // go to next level
      this.scene.start('reveal')
    }, 5000)
  }
}

export { Scene5 }
