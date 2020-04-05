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
    const victory_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'victory_screen',
    )
    const scaleX = this.cameras.main.width / victory_screen.width
    const scaleY = this.cameras.main.height / victory_screen.height
    const scale = Math.min(scaleX, scaleY)
    victory_screen.setScale(scale).setScrollFactor(0)
    setTimeout(() => {
      this.scene.start('enterName', {
        deathCounter: this.deathCounter,
        timeTaken: this.timeTaken,
      })
    }, 4000)
  }
}

export { Scene3 }
