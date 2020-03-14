import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TAUNTS,
  TILE_SIZE,
  TIMEOUT_DURATION,
} from './utils.js'

const PLATFORM_TILES = [
  [1, 13],
  [2, 13],
  [3, 13],
  [4, 13],
  [6, 13],
  [7, 13],
  [8, 13],
  [9, 13],
  [10, 13],
  [11, 13],
  [12, 13],
  [13, 13],
  [15, 13],
  [16, 13],
  [19, 13],
  [20, 13],
  [21, 13],
  [22, 13],
  [23, 13],
  [24, 13],
  [25, 13],
  [26, 13],
  // broom closet
  [13, 7],
  [14, 7],
  [15, 7],
  [16, 7],
  [13, 8],
  [14, 8],
  [15, 8],
  [16, 8],
  [16, 11],
  [13, 9],
  [16, 9],
  [16, 10],
  [11, 11],
  [12, 11],
  [13, 11],
  [14, 11],
  [15, 11],
  [16, 11],
  // stepping stone
  [11, 7],
  // left portion
  [3, 5],
  [4, 5],
  [5, 5],
  [6, 5],
  [7, 5],
  [8, 5],
  [9, 5],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 8],
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 9],
  // bottom right junk
  [25, 12],
  [26, 11],
  // above broom closet
  [14, 3],
  [15, 3],
  // stepping stone below end
  [19, 8],
  [20, 8],
  [20, 6],
  // end
  [21, 4],
  [23, 4],
  [24, 4],
  [25, 4],
]

const SPIKES_TILES = [
  [5, 13],
  [14, 13],
  [17, 13],
  [18, 13],
  [8, 12],
  [26, 10],
]

const GOAL = [25, 3]

class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame')
    this.gameOver = false
    this.canJump = true
  }

  preload() {
    this.load.image('owl', 'assets/owl.png') // 32px x 32px
    this.load.image('platform_tile', 'assets/platform_tile.png') // 32px x 32px
    this.load.image('spike_tile', 'assets/spike_tile.png') // 32px x 12px
    this.load.image('goal', 'assets/aplus.png') // 32px x 32px
  }

  create() {
    this.deathCounter = 0

    function getScreenCoordinate(tileNumber, tileSize) {
      const origin = tileSize / 2
      // -1 due to 1 based indexing
      return origin + (tileNumber - 1) * tileSize
    }
    function getSpikeScreenYCoordinate(tileNumber, tileSize) {
      const origin = tileSize - 6
      // -1 due to 1 based indexing
      return origin + (tileNumber - 1) * tileSize
    }

    // Death Counter
    this.deathCounterText = this.add.text(
      16,
      16,
      this.getDeathCounterText(this.deathCounter),
      {
        fontSize: '24px',
        fill: '#FFF',
      },
    )

    // create platforms
    const platforms = this.physics.add.staticGroup()
    const platformsCreated = PLATFORM_TILES.map(coordinate => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      return platforms.create(x, y, 'platform_tile')
    })
    // hide platforms
    platformsCreated.map(platform => {
      platform.setVisible(false)
    })

    // create spikes
    const spikes = this.physics.add.staticGroup()
    const spikesCreated = SPIKES_TILES.map(coordinate => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getSpikeScreenYCoordinate(coordinate[1], TILE_SIZE)
      return spikes.create(x, y, 'spike_tile')
    })
    // hide spikes
    spikesCreated.map(spike => {
      spike.setVisible(false)
    })

    // create goal
    const goal = this.physics.add.staticGroup()
    const goalX = getScreenCoordinate(GOAL[0], TILE_SIZE)
    const goalY = getSpikeScreenYCoordinate(GOAL[1], TILE_SIZE)
    goal.create(goalX, goalY, 'goal')

    // create player
    this.playerStartingX = getScreenCoordinate(2, TILE_SIZE)
    this.playerStartingY = getScreenCoordinate(12, TILE_SIZE)
    this.player = this.physics.add.sprite(
      this.playerStartingX,
      this.playerStartingY,
      'owl',
    )

    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, platforms)
    this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this)
    this.physics.add.collider(this.player, goal, this.reachGoal, null, this)

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (this.gameOver) {
      return
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-120)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(120)
    } else {
      this.player.setVelocityX(0)
    }

    if (this.cursors.up.isUp) {
      // debounce jump
      this.canJump = true
    }
    if (
      this.canJump &&
      this.cursors.up.isDown &&
      this.player.body.touching.down
    ) {
      this.player.setVelocityY(-380)
      this.canJump = false
    }
  }

  hitSpikes(pointer, gameObject) {
    if (this.gameOver) {
      // debounce collision
      return
    }
    this.gameOver = true
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
    this.updateDeathCounter()
    this.showMotivationalText(TAUNTS)
    setTimeout(() => {
      this.gameOver = false
      this.player.x = this.playerStartingX
      this.player.y = this.playerStartingY
    }, TIMEOUT_DURATION)
  }

  reachGoal() {
    this.showVictoryText()
    this.gameOver = true
  }

  updateDeathCounter() {
    this.deathCounter = this.deathCounter + 1
    this.deathCounterText.setText(this.getDeathCounterText(this.deathCounter))
  }

  getDeathCounterText(count) {
    return 'deaths: ' + count
  }

  showMotivationalText(taunts) {
    // select random taunt
    var taunt = taunts[Math.floor(Math.random() * taunts.length)]
    // add text
    const text = this.add
      .text(
        (SCREEN_WIDTH * TILE_SIZE) / 2,
        (SCREEN_HEIGHT * TILE_SIZE) / 2,
        taunt,
      )
      .setFontSize(32)
      .setFontFamily('Arial')
      .setOrigin(0.5)
    // remove text after 1s
    setTimeout(() => {
      text.destroy()
    }, TIMEOUT_DURATION)
  }

  showVictoryText() {
    const text = this.add
      .text(
        (SCREEN_WIDTH * TILE_SIZE) / 2,
        (SCREEN_HEIGHT * TILE_SIZE) / 2,
        'NM4227 Final Grade A+',
      )
      .setFontSize(64)
      .setFontFamily('Arial')
      .setOrigin(0.5)
  }
}

export { Scene2 }
