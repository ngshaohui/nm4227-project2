class Scene6 extends Phaser.Scene {
  constructor() {
    super('reveal')
  }

  preload() {
    this.load.image('reveal_screen', 'assets/reveal_screen.gif')
  }

  create() {
    const reveal_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'reveal_screen',
    )
    const scaleX = this.cameras.main.width / reveal_screen.width
    const scaleY = this.cameras.main.height / reveal_screen.height
    const scale = Math.min(scaleX, scaleY)
    reveal_screen.setScale(scale).setScrollFactor(0)

    const restartGame = () => this.scene.start('playGame')
    this.input.keyboard.on('keydown_ENTER', () => {
      restartGame()
    })
  }
}

export { Scene6 }
