class Scene3 extends Phaser.Scene {
  constructor() {
    super('endGame')
  }

  init(data) {
    this.deathCounter = data.deathCounter
    this.timeTaken = data.timeTaken
  }

  preload() {
    this.load.image('victory_screen', 'assets/victory_screen.png')
  }

  create() {
    const intro_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'victory_screen',
    )
    const scaleX = this.cameras.main.width / intro_screen.width
    const scaleY = this.cameras.main.height / intro_screen.height
    const scale = Math.min(scaleX, scaleY)
    intro_screen.setScale(scale).setScrollFactor(0)
  }
}

export { Scene3 }
