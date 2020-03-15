import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  TAUNTS,
  TILE_SIZE,
  TIMEOUT_DURATION,
} from './utils.js'
import { DEBUG } from './env.js'

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

const RIGHT_FACING_SPIKE_TILES = [
  [3, 3],
  [3, 4],
]

const DOWN_FACING_SPIKE_TILES = [
  [14, 4],
  [15, 4],
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
    this.load.image('spike_down_tile', 'assets/spike_down_tile.png') // 12px x 32px
    this.load.image('spike_right_tile', 'assets/spike_right_tile.png') // 12px x 32px
    this.load.image('spike_tile', 'assets/spike_tile.png') // 32px x 12px
    this.load.image('goal', 'assets/aplus.png') // 32px x 32px

    this.load.audio('audio_death', 'assets/audio/death_b.mp3')
    this.load.audio('audio_jump', 'assets/audio/jump.mp3')
    this.load.audio('audio_respawn', 'assets/audio/respawn.mp3')
    this.load.audio('audio_walk', 'assets/audio/walk.mp3')
  }

  create() {
    this.deathCounter = 0
    const date = new Date()
    this.timeStart = date.getTime()

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
    function getRightSpikeScreenXCoordinate(tileNumber, tileSize) {
      const origin = 6
      // -1 due to 1 based indexing
      return origin + (tileNumber - 1) * tileSize
    }
    function getDownSpikeScreenYCoordinate(tileNumber, tileSize) {
      const origin = 6
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

    // timer
    this.timerText = this.add.text(700, 16, this.getTimerText(), {
      fontSize: '24px',
      fill: '#FFF',
    })

    // create platforms
    const platforms = this.physics.add.staticGroup()
    const platformsCreated = PLATFORM_TILES.map(coordinate => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      return platforms.create(x, y, 'platform_tile')
    })
    // hide platforms
    if (!DEBUG) {
      platformsCreated.map(platform => {
        platform.setVisible(false)
      })
    }

    // create spikes
    const spikes = this.physics.add.staticGroup()
    const spikesCreated = SPIKES_TILES.map(coordinate => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getSpikeScreenYCoordinate(coordinate[1], TILE_SIZE)
      return spikes.create(x, y, 'spike_tile')
    })
    RIGHT_FACING_SPIKE_TILES.forEach(coordinate => {
      const x = getRightSpikeScreenXCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      const spike = spikes.create(x, y, 'spike_right_tile')
      spikesCreated.push(spike)
    })
    DOWN_FACING_SPIKE_TILES.forEach(coordinate => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getDownSpikeScreenYCoordinate(coordinate[1], TILE_SIZE)
      const spike = spikes.create(x, y, 'spike_down_tile')
      spikesCreated.push(spike)
    })
    // hide spikes
    if (!DEBUG) {
      spikesCreated.map(spike => {
        spike.setVisible(false)
      })
    }

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

    // audio
    this.deathSound = this.sound.add('audio_death')
    this.jumpSound = this.sound.add('audio_jump')
    this.respawnSound = this.sound.add('audio_respawn')
    this.walkSound = this.sound.add('audio_walk')

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
      if (this.player.body.touching.down) {
        this.walkSound.play()
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(120)
      if (this.player.body.touching.down) {
        this.walkSound.play()
      }
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
      this.jumpSound.play()
      this.canJump = false
    }

    // update timer
    this.timerText.setText(this.getTimerText())
  }

  hitSpikes(pointer, gameObject) {
    if (this.gameOver) {
      // debounce collision
      return
    }
    this.gameOver = true
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
    this.deathSound.play()
    this.updateDeathCounter()
    this.showMotivationalText(TAUNTS)
    setTimeout(() => {
      this.gameOver = false
      this.respawnSound.play()
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

  getTimerText() {
    function padWithZero(num) {
      return ('0' + num).slice(-2)
    }
    const date = new Date()
    const timeNow = date.getTime()
    const timeDiffInSeconds = Math.round((timeNow - this.timeStart) / 1000)
    const timeInHours = Math.floor(timeDiffInSeconds / 3600)
    const timeInMinutes = Math.floor(timeDiffInSeconds / 60) % 3600
    const timeInSeconds = Math.round(timeDiffInSeconds) % 60
    return `${padWithZero(timeInHours)}:${padWithZero(
      timeInMinutes,
    )}:${padWithZero(timeInSeconds)}`
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
      .setFontSize(24)
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
      .setOrigin(0.5)
  }
}

export { Scene2 }
