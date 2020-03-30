import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  throttle,
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
    this.deathCounter = 0
  }

  preload() {
    this.load.image('avatar_left_jump_1', 'assets/avatar/left-jump-1.png')
    this.load.image('avatar_left_jump_2', 'assets/avatar/left-jump-2.png')
    this.load.image('avatar_left_jump_3', 'assets/avatar/left-jump-3.png')
    this.load.image('avatar_right_jump_1', 'assets/avatar/right-jump-1.png')
    this.load.image('avatar_right_jump_2', 'assets/avatar/right-jump-2.png')
    this.load.image('avatar_right_jump_3', 'assets/avatar/right-jump-3.png')
    this.load.image('avatar_left_walk_1', 'assets/avatar/left-step-1.png')
    this.load.image('avatar_left_walk_2', 'assets/avatar/left-step-2.png')
    this.load.image('avatar_left_walk_3', 'assets/avatar/left-step-3.png')
    this.load.image('avatar_left_walk_4', 'assets/avatar/left-step-4.png')
    this.load.image('avatar_left_walk_5', 'assets/avatar/left-step-5.png')
    this.load.image('avatar_left_walk_6', 'assets/avatar/left-step-6.png')
    this.load.image('avatar_right_walk_1', 'assets/avatar/right-step-1.png')
    this.load.image('avatar_right_walk_2', 'assets/avatar/right-step-2.png')
    this.load.image('avatar_right_walk_3', 'assets/avatar/right-step-3.png')
    this.load.image('avatar_right_walk_4', 'assets/avatar/right-step-4.png')
    this.load.image('avatar_right_walk_5', 'assets/avatar/right-step-5.png')
    this.load.image('avatar_right_walk_6', 'assets/avatar/right-step-6.png')

    this.load.image('platform_tile', 'assets/platform_tile.png') // 32px x 32px
    this.load.image('spike_down_tile', 'assets/spike_down_tile.png') // 12px x 32px
    this.load.image('spike_right_tile', 'assets/spike_right_tile.png') // 12px x 32px
    this.load.image('spike_tile', 'assets/spike_tile.png') // 32px x 12px
    this.load.image('goal', 'assets/aplus.png') // 32px x 32px

    this.load.audio('audio_death_spike_tile', 'assets/audio/death_spike.mp3')
    this.load.audio(
      'audio_death_spike_bottom_tile',
      'assets/audio/death_spike_bottom.mp3',
    )
    this.load.audio(
      'audio_death_spike_right_tile',
      'assets/audio/death_spike_right.mp3',
    )
    this.load.audio('audio_jump', 'assets/audio/jump.mp3')
    this.load.audio('audio_respawn', 'assets/audio/respawn.mp3')
    this.load.audio('audio_walk', 'assets/audio/reg_footstep.mp3')
    this.throttledWalkSound = throttle(function() {
      this.walkSound.play()
    }, 200)

    this.load.image('1st_taunt', 'assets/taunts/1st_taunt.png') // 384px x 101px
    this.load.image('2nd_taunt', 'assets/taunts/2nd_taunt.png') // 384px x 101px
    this.load.image('3rd_taunt', 'assets/taunts/3rd_taunt.png') // 384px x 101px
    this.load.image('taunt1', 'assets/taunts/taunt1.png') // 384px x 101px
    this.load.image('taunt2', 'assets/taunts/taunt2.png') // 384px x 101px
    this.load.image('taunt3', 'assets/taunts/taunt3.png') // 384px x 101px
    this.load.image('taunt4', 'assets/taunts/taunt4.png') // 384px x 101px
    this.load.image('taunt5', 'assets/taunts/taunt5.png') // 384px x 101px
    this.load.image('taunt6', 'assets/taunts/taunt6.png') // 384px x 101px
    this.load.image('taunt7', 'assets/taunts/taunt7.png') // 384px x 101px
    this.load.image('taunt8', 'assets/taunts/taunt8.png') // 384px x 101px
    this.load.image('taunt9', 'assets/taunts/taunt9.png') // 384px x 101px
    this.load.image('taunt10', 'assets/taunts/taunt10.png') // 384px x 101px
    this.load.image('taunt11', 'assets/taunts/taunt11.png') // 384px x 101px
    this.load.image('taunt12', 'assets/taunts/taunt12.png') // 384px x 101px
    this.load.image('taunt13', 'assets/taunts/taunt13.png') // 384px x 101px
    this.load.image('taunt14', 'assets/taunts/taunt14.png') // 384px x 101px
    this.load.image('taunt15', 'assets/taunts/taunt15.png') // 384px x 101px
    this.load.image('taunt16', 'assets/taunts/taunt16.png') // 384px x 101px
    this.load.image('taunt17', 'assets/taunts/bbtaunt1.png') // 384px x 101px
    this.load.image('taunt18', 'assets/taunts/bbtaunt2.png') // 384px x 101px
    this.load.image('taunt19', 'assets/taunts/bbtaunt3.png') // 384px x 101px
  }

  create() {
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
      'avatar_right_walk_1',
    )
    this.player.setSize(14, 26, 2, 0) // modify bounding box
    this.anims.create({
      key: 'walk_left',
      frames: [
        { key: 'avatar_left_walk_1' },
        { key: 'avatar_left_walk_2' },
        { key: 'avatar_left_walk_3' },
        { key: 'avatar_left_walk_4' },
        { key: 'avatar_left_walk_5' },
        { key: 'avatar_left_walk_6' },
      ],
      frameRate: 24,
      repeat: 0,
    })
    this.anims.create({
      key: 'walk_right',
      frames: [
        { key: 'avatar_right_walk_1' },
        { key: 'avatar_right_walk_2' },
        { key: 'avatar_right_walk_3' },
        { key: 'avatar_right_walk_4' },
        { key: 'avatar_right_walk_5' },
        { key: 'avatar_right_walk_6' },
      ],
      frameRate: 24,
      repeat: 0,
    })

    // audio
    this.deathSoundSpikeTile = this.sound.add('audio_death_spike_tile')
    this.deathSoundSpikeBottomTile = this.sound.add(
      'audio_death_spike_bottom_tile',
    )
    this.deathSoundSpikeRightTile = this.sound.add(
      'audio_death_spike_right_tile',
    )
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
        this.player.anims.play('walk_left', true)
        this.throttledWalkSound()
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(120)
      if (this.player.body.touching.down) {
        this.player.anims.play('walk_right', true)
        this.throttledWalkSound()
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
      // throttle collision
      return
    }
    gameObject.setVisible(true)
    setTimeout(() => {
      gameObject.setVisible(false)
    }, 500)
    setTimeout(() => {
      gameObject.setVisible(true)
    }, 1000)
    setTimeout(() => {
      gameObject.setVisible(false)
    }, 1500)
    this.gameOver = true
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
    switch (gameObject.texture.key) {
      case 'spike_tile':
        this.deathSoundSpikeTile.play()
        break
      case 'spike_right_tile':
        this.deathSoundSpikeBottomTile.play()
        break
      case 'spike_down_tile':
        this.deathSoundSpikeRightTile.play()
        break
    }
    this.updateDeathCounter(this.deathCounter)
    this.showMotivationalText(this.deathCounter)
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

  updateDeathCounter(deathCount) {
    this.deathCounter = deathCount + 1
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

  showMotivationalText(deathCount) {
    // select random taunt
    const rng = Math.floor(Math.random() * 19) + 1
    const randomTaunt = 'taunt' + rng
    let useTaunt = randomTaunt
    switch (deathCount) {
      case 1:
        useTaunt = '1st_taunt'
        break
      case 2:
        useTaunt = '2nd_taunt'
        break
      case 3:
        useTaunt = '3rd_taunt'
        break
    }
    const taunt_screen = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      useTaunt,
    )
    setTimeout(() => {
      taunt_screen.destroy()
    }, TIMEOUT_DURATION)
  }

  showVictoryText() {
    this.add
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
