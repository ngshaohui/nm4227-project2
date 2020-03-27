class Scene0 extends Phaser.Scene {
  constructor() {
    super('bootGame')
  }

  preload() {
    this.load.image('intro_screen', 'assets/intro_screen.png')
  }

  create() {
    const intro_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'intro_screen',
    )
    const scaleX = this.cameras.main.width / intro_screen.width
    const scaleY = this.cameras.main.height / intro_screen.height
    const scale = Math.min(scaleX, scaleY)
    intro_screen.setScale(scale).setScrollFactor(0)

    const startTutorial = () => this.scene.start('learnGame')
    this.input.keyboard.on('keydown_ENTER', () => {
      startTutorial()
    })
  }
}

export { Scene0 }
