class Scene7 extends Phaser.Scene {
  constructor() {
    super('brace')
  }

  preload() {
    this.load.image('brace_screen', 'assets/brace_screen.png')
  }

  create() {
    const brace_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'brace_screen',
    )
    const scaleX = this.cameras.main.width / brace_screen.width
    const scaleY = this.cameras.main.height / brace_screen.height
    const scale = Math.min(scaleX, scaleY)
    brace_screen.setScale(scale).setScrollFactor(0)

    const restartGame = () => this.scene.start('playGame')
    this.input.keyboard.on('keydown_ENTER', () => {
      restartGame()
    })
  }
}

export { Scene7 }
