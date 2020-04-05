import { SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE } from './utils.js'

const MAX_LEN = 7

class Scene4 extends Phaser.Scene {
  // https://phaser.io/examples/v3/view/input/keyboard/enter-name
  constructor() {
    super('enterName')
    this.submitted = false
    this.startTime = new Date()
  }

  init(data) {
    this.deathCounter = data.deathCounter
    this.timeTaken = data.timeTaken
  }

  preload() {
    this.load.image('block', 'assets/input/block.png')
    this.load.image('rub', 'assets/input/rub.png')
    this.load.image('end', 'assets/input/end.png')
    this.load.bitmapFont(
      'arcade',
      'assets/fonts/bitmap/arcade.png',
      'assets/fonts/bitmap/arcade.xml',
    )
  }

  create() {
    const goVerificationScreen = () => {
      this.scene.start('verification')
    }
    this.title = this.add
      .text(
        (SCREEN_WIDTH * TILE_SIZE) / 2,
        (SCREEN_HEIGHT * TILE_SIZE) / 8,
        'NEW HIGHSCORE',
      )
      .setFontSize(48)
      .setOrigin(0.5)
    this.add
      .text(
        (SCREEN_WIDTH * TILE_SIZE) / 3 - 30,
        (SCREEN_HEIGHT * TILE_SIZE) / 4,
        'Deaths: ' + this.deathCounter,
      )
      .setFontSize(32)
      .setOrigin(0.5)
    this.add
      .text(
        ((SCREEN_WIDTH * TILE_SIZE) / 3) * 2,
        (SCREEN_HEIGHT * TILE_SIZE) / 4,
        'Time: ' + this.timeTaken,
      )
      .setFontSize(32)
      .setOrigin(0.5)

    const chars = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>'],
    ]
    const cursor = { x: 0, y: 0 }
    let name = ''

    const input = this.add
      .bitmapText(
        160,
        (SCREEN_HEIGHT * TILE_SIZE) / 2,
        'arcade',
        'ABCDEFGHIJ\n\nKLMNOPQRST\n\nUVWXYZ.-',
      )
      .setLetterSpacing(20)
    input.setInteractive()

    this.add.image(input.x + 430, input.y + 148, 'rub')
    this.add.image(input.x + 482, input.y + 148, 'end')

    const block = this.add
      .image(input.x - 10, input.y - 2, 'block')
      .setOrigin(0)

    const playerText = this.add
      .bitmapText(
        (SCREEN_WIDTH * TILE_SIZE) / 3 + 20,
        ((SCREEN_HEIGHT * TILE_SIZE) / 8) * 3,
        'arcade',
        name,
      )
      .setTint(0xff0000)

    this.input.keyboard.on('keyup', function (event) {
      if (this.submitted) {
        return
      }
      if (event.keyCode === 37) {
        //  left
        if (cursor.x > 0) {
          cursor.x--
          block.x -= 52
        }
      } else if (event.keyCode === 39) {
        //  right
        if (cursor.x < 9) {
          cursor.x++
          block.x += 52
        }
      } else if (event.keyCode === 38) {
        //  up
        if (cursor.y > 0) {
          cursor.y--
          block.y -= 64
        }
      } else if (event.keyCode === 40) {
        //  down
        if (cursor.y < 2) {
          cursor.y++
          block.y += 64
        }
      } else if (event.keyCode === 13 || event.keyCode === 32) {
        //  Enter or Space
        if (cursor.x === 9 && cursor.y === 2 && name.length > 0) {
          //  Submit
          // make name flash 3 times
          this.submitted = true
          setTimeout(() => {
            playerText.visible = false
          }, 500)
          setTimeout(() => {
            playerText.visible = true
          }, 1000)
          setTimeout(() => {
            playerText.visible = false
          }, 1500)
          setTimeout(() => {
            playerText.visible = true
          }, 2000)
          setTimeout(() => {
            playerText.visible = false
          }, 2500)
          setTimeout(() => {
            playerText.visible = true
          }, 3000)
          setTimeout(() => {
            // go to next level
            goVerificationScreen()
          }, 4000)
        } else if (cursor.x === 8 && cursor.y === 2 && name.length > 0) {
          //  Rub
          name = name.substr(0, name.length - 1)

          playerText.text = name
        } else if (name.length < MAX_LEN) {
          //  Add
          name = name.concat(chars[cursor.y][cursor.x])

          playerText.text = name
        }
      }
    })

    input.on(
      'pointermove',
      function (pointer, x, y) {
        var cx = Phaser.Math.Snap.Floor(x, 52, 0, true)
        var cy = Phaser.Math.Snap.Floor(y, 64, 0, true)
        var char = chars[cy][cx]

        cursor.x = cx
        cursor.y = cy

        block.x = input.x - 10 + cx * 52
        block.y = input.y - 2 + cy * 64
      },
      this,
    )

    input.on(
      'pointerup',
      function (pointer, x, y) {
        if (this.submitted) {
          return
        }
        var cx = Phaser.Math.Snap.Floor(x, 52, 0, true)
        var cy = Phaser.Math.Snap.Floor(y, 64, 0, true)
        var char = chars[cy][cx]

        cursor.x = cx
        cursor.y = cy

        block.x = input.x - 10 + cx * 52
        block.y = input.y - 2 + cy * 64

        if (char === '<' && name.length > 0) {
          //  Rub
          name = name.substr(0, name.length - 1)

          playerText.text = name
        } else if (char === '>' && name.length > 0) {
          //  Submit
          // make name flash 3 times
          this.submitted = true
          setTimeout(() => {
            playerText.visible = false
          }, 500)
          setTimeout(() => {
            playerText.visible = true
          }, 1000)
          setTimeout(() => {
            playerText.visible = false
          }, 1500)
          setTimeout(() => {
            playerText.visible = true
          }, 2000)
          setTimeout(() => {
            playerText.visible = false
          }, 2500)
          setTimeout(() => {
            playerText.visible = true
          }, 3000)
          setTimeout(() => {
            // go to next level
            goVerificationScreen()
          }, 4000)
        } else if (name.length < MAX_LEN) {
          //  Add
          name = name.concat(char)

          playerText.text = name
        }
      },
      this,
    )
  }

  update() {
    const date = new Date()
    const timeNow = date.getTime()
    const timeDiffInSeconds = Math.round((timeNow - this.startTime) / 1000)
    if (timeDiffInSeconds % 2 == 0) {
      this.title.visible = false
    } else {
      this.title.visible = true
    }
  }
}

export { Scene4 }
