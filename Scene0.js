class Scene0 extends Phaser.Scene {
  constructor() {
    super('bootGame')
  }

  create() {
    this.add.text(20, 20, 'Loading game...')
    setTimeout(() => {
      this.scene.start('playGame')
    }, 1000)
  }
}
