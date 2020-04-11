import { throttle, TILE_SIZE, TIMEOUT_DURATION } from './utils.js'
import { DEBUG } from './env.js'

const DIRT_TILES = [
  [1, 14],
  [2, 14],
  [3, 14],
  [4, 14],
  [5, 14],
  [6, 14],
  [7, 14],
  [8, 14],
  [9, 14],
  [10, 14],
  [11, 14],
  [12, 14],
  [13, 14],
  [14, 14],
  [15, 14],
  [16, 14],
  [17, 14],
  [18, 14],
  [19, 14],
  [20, 14],
  [21, 14],
  [22, 14],
  [23, 14],
  [24, 14],
  [25, 14],
  [26, 14],
  [25, 13],
  [26, 13],
  [26, 12],
]

const GRASS_TILES = [
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
  // broom closet
  [11, 11],
  [12, 11],
  [13, 11],
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
  [14, 2],
  [15, 2],
  // stepping stone below end
  [19, 8],
  [20, 8],
  [20, 6],
  // end
  [21, 4],
  [22, 4],
  [24, 4],
  [25, 4],
]

const WOOD_TILES = [
  [13, 6],
  [14, 6],
  [15, 6],
  [16, 6],
  [13, 7],
  [16, 7],
  [13, 8],
  [16, 8],
  [16, 11],
  [13, 9],
  [15, 9],
  [16, 9],
  [16, 10],
  [14, 11],
  [15, 11],
  [16, 11],
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
  [14, 3],
  [15, 3],
]

const GOAL = [25, 3]

const BROOM_CLOSET_COORDINATES = {
  x0: 13,
  y0: 6,
  x1: 15,
  y1: 11,
}

class Scene2 extends Phaser.Scene {
  constructor() {
    super('playGame')
  }

  preload() {
    this.load.image('bg', 'assets/sky.png')

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

    this.load.image('dirt_tile', 'assets/dirt.png') // 32px x 32px
    this.load.image('grass_tile', 'assets/grass.png') // 32px x 32px
    this.load.image('wood_tile', 'assets/wood.png') // 32px x 32px
    this.load.image('spike_down_tile', 'assets/spike_down_tile.png') // 12px x 32px
    this.load.image('spike_right_tile', 'assets/spike_right_tile.png') // 12px x 32px
    this.load.image('spike_tile', 'assets/spike_tile.png') // 32px x 12px
    this.load.image('goal', 'assets/aplus.png') // 32px x 32px

    this.load.audio('audio_winning', 'assets/audio/winning.mp3')
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
    this.throttledWalkSound = throttle(function () {
      this.walkSound.play()
    }, 200)
    this.load.audio('audio_closet_open', 'assets/audio/BC_door_open.mp3')
    this.load.audio('audio_closet_close', 'assets/audio/BC_door_close.mp3')

    this.load.audio('f0', 'assets/audio/taunts/f0.mp3')
    this.load.audio('f1', 'assets/audio/taunts/f1.mp3')
    this.load.audio('f2', 'assets/audio/taunts/f2.mp3')
    this.load.audio('a0', 'assets/audio/taunts/a0.mp3')
    this.load.audio('a1', 'assets/audio/taunts/a1.mp3')
    this.load.audio('a2', 'assets/audio/taunts/a2.mp3')
    this.load.audio('a3', 'assets/audio/taunts/a3.mp3')
    this.load.audio('a4', 'assets/audio/taunts/a4.mp3')
    this.load.audio('a5', 'assets/audio/taunts/a5.mp3')
    this.load.audio('a6', 'assets/audio/taunts/a6.mp3')
    this.load.audio('a7', 'assets/audio/taunts/a7.mp3')
    this.load.audio('a8', 'assets/audio/taunts/a8.mp3')
    this.load.audio('a9', 'assets/audio/taunts/a9.mp3')

    // secret
    this.load.image('thumbsup', 'assets/avatar/alexthumbsup.png')
  }

  create() {
    this.gameOver = false
    this.canJump = true
    this.deathCounter = 0
    this.inCloset = false
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

    this.bg = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'bg',
    )
    const scaleX = this.cameras.main.width / this.bg.width
    const scaleY = this.cameras.main.height / this.bg.height
    const scale = Math.min(scaleX, scaleY)
    this.bg.setScale(scale).setScrollFactor(0)
    this.bg.setVisible(false)

    // create platforms
    const platforms = this.physics.add.staticGroup()
    const platformsCreated = GRASS_TILES.map((coordinate) => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      return platforms.create(x, y, 'grass_tile')
    })
    DIRT_TILES.map((coordinate) => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      const platform = platforms.create(x, y, 'dirt_tile')
      platformsCreated.push(platform)
    })
    WOOD_TILES.map((coordinate) => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      const platform = platforms.create(x, y, 'wood_tile')
      platformsCreated.push(platform)
    })
    this.platforms = platformsCreated
    // hide platforms
    if (!DEBUG) {
      platformsCreated.map((platform) => {
        platform.setVisible(false)
      })
    }

    // create spikes
    const spikes = this.physics.add.staticGroup()
    const spikesCreated = SPIKES_TILES.map((coordinate) => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getSpikeScreenYCoordinate(coordinate[1], TILE_SIZE)
      return spikes.create(x, y, 'spike_tile')
    })
    RIGHT_FACING_SPIKE_TILES.forEach((coordinate) => {
      const x = getRightSpikeScreenXCoordinate(coordinate[0], TILE_SIZE)
      const y = getScreenCoordinate(coordinate[1], TILE_SIZE)
      const spike = spikes.create(x, y, 'spike_right_tile')
      spikesCreated.push(spike)
    })
    DOWN_FACING_SPIKE_TILES.forEach((coordinate) => {
      const x = getScreenCoordinate(coordinate[0], TILE_SIZE)
      const y = getDownSpikeScreenYCoordinate(coordinate[1], TILE_SIZE)
      const spike = spikes.create(x, y, 'spike_down_tile')
      spikesCreated.push(spike)
    })
    // hide spikes
    if (!DEBUG) {
      spikesCreated.map((spike) => {
        spike.setVisible(false)
      })
    }
    this.spikes = spikesCreated

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
    this.winningSound = this.sound.add('audio_winning')
    this.deathSoundSpikeTile = this.sound.add('audio_death_spike_tile', {
      volume: 0.2,
    })
    this.deathSoundSpikeBottomTile = this.sound.add(
      'audio_death_spike_bottom_tile',
      { volume: 0.2 },
    )
    this.deathSoundSpikeRightTile = this.sound.add(
      'audio_death_spike_right_tile',
      { volume: 0.2 },
    )
    this.jumpSound = this.sound.add('audio_jump')
    this.respawnSound = this.sound.add('audio_respawn', { volume: 0.4 })
    this.walkSound = this.sound.add('audio_walk', { volume: 0.1 })
    this.closetOpenSound = this.sound.add('audio_closet_open')
    this.closetCloseSound = this.sound.add('audio_closet_close')

    // taunts
    this.f0 = this.sound.add('f0')
    this.f1 = this.sound.add('f1')
    this.f2 = this.sound.add('f2')
    this.taunts = []
    for (let i = 0; i < 10; i++) {
      this.taunts.push(this.sound.add('a' + i))
    }

    this.player.setCollideWorldBounds(true)
    this.physics.add.collider(this.player, platforms)
    this.physics.add.collider(this.player, spikes, this.hitSpikes, null, this)
    this.physics.add.collider(this.player, goal, this.reachGoal, null, this)

    // broom closet
    this.closet = new Phaser.Geom.Rectangle(
      getScreenCoordinate(BROOM_CLOSET_COORDINATES.x0, TILE_SIZE),
      getScreenCoordinate(BROOM_CLOSET_COORDINATES.y0, TILE_SIZE),
      Math.abs(
        getScreenCoordinate(BROOM_CLOSET_COORDINATES.x1, TILE_SIZE) -
          getScreenCoordinate(BROOM_CLOSET_COORDINATES.x0, TILE_SIZE),
      ),
      Math.abs(
        getScreenCoordinate(BROOM_CLOSET_COORDINATES.y1, TILE_SIZE) -
          getScreenCoordinate(BROOM_CLOSET_COORDINATES.y0, TILE_SIZE),
      ),
    )

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

    // broom closet
    if (Phaser.Geom.Rectangle.Overlaps(this.player.getBounds(), this.closet)) {
      if (!this.inCloset) {
        // debounce
        this.inCloset = true
        this.closetOpenSound.play()
        this.enterClosetTime = new Date()
      }
      const date = new Date()
      const timeNow = date.getTime()
      const timeDiffInSeconds = Math.round(
        (timeNow - this.enterClosetTime) / 1000,
      )
      this.broomClosetText(timeDiffInSeconds)
    } else {
      // player has left
      if (this.inCloset) {
        this.inCloset = false // reset boolean
        this.closetCloseSound.play()
      }
    }
  }

  broomClosetText(time) {
    if (time >= 5 && time < 10) {
      // You stepped into a broom closet
    } else if (time >= 10 && time < 15) {
      // Why are you still here? There’s nothing to see here
    } else {
      // OH, DID U GET THE BROOM CLOSET ENDING? THE BROOM CLOSET ENDING WAS MY FAVRITE!1 xD' ... I hope your friends find this concerning
    }
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
    this.winningSound.play()
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
    const rng = Math.floor(Math.random() * this.taunts.length)
    switch (deathCount) {
      case 1:
        this.f0.play()
        break
      case 2:
        this.f1.play()
        break
      case 3:
        this.f2.play()
        break
      default:
        this.taunts[rng].play()
    }
  }

  showVictoryText() {
    const thumbsup = this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'thumbsup',
    )
    this.spikes.map((spike) => {
      spike.setVisible(true)
    })
    this.platforms.map((platform) => {
      platform.setVisible(true)
    })
    this.bg.setVisible(true)
    const scaleX = this.cameras.main.width / thumbsup.width
    const scaleY = this.cameras.main.height / thumbsup.height
    const scale = Math.min(scaleX, scaleY)
    thumbsup.setScale(scale).setScrollFactor(0)
    setTimeout(() => {
      thumbsup.destroy()
      this.scene.start('endGame', {
        deathCounter: this.deathCounter,
        timeTaken: this.getTimerText(),
      })
    }, TIMEOUT_DURATION)
  }
}

export { Scene2 }
