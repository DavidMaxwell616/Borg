var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: 'game',
  scene: {
    preload: preload,
    create: create
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0
      },
      debug: true
    }
  },
};

var game = new Phaser.Game(config);

function create() {
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate(scene) {
  cursorKeys = scene.input.keyboard.createCursorKeys();
  isUpDown = cursorKeys.up.isDown;
  isDownDown = cursorKeys.down.isDown;
  isLeftDown = cursorKeys.left.isDown;
  isRightDown = cursorKeys.right.isDown;
  isSpaceDown = cursorKeys.space.isDown;
  score = 0;

  player = scene.matter.add.sprite(50, 240, 'player');
  player.body.collideWorldBounds = true;
  player.setOrigin(0.5, 0.5);

  scene.anims.create({
    key: 'runLeft',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  scene.anims.create({
    key: 'runRight',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 4,
      end: 7
    }),
    frameRate: 10,
    repeat: -1
  });

  player.anims.load('runLeft');
  player.anims.load('runRight');

  player.facingRight = true;
  playerXSpeed = 0;
  playerYSpeed = 0;

  level1bkgd = scene.add.image(0, 0, 'level 1');
  level1bkgd.setOrigin(0, 0);
  level1bkgd.width = scene.game.config.width;
  level1bkgd.height = scene.game.config.height * .7;
  // level1bkgd.body.clearShapes();
  // level1bkgd.body.loadPolygon("physicsData", "level_1");
  //level1bkgd.body.static = true;
  maxxdaddy.visible = false;

  numGuards = curLevel + 4;
  initEnemies(scene);

  scoreText = game.add.text(16, 16, 'SCORE: 0', {
    fontSize: '18px',
    fill: '#eee',
  });

  livesText = game.add.text(game.width * 0.45, 16, 'LIVES: 3', {
    fontSize: '18px',
    fill: '#eee',
  });

  levelText = game.add.text(game.width * 0.89, 16, 'LEVEL: 1', {
    fontSize: '18px',
    fill: '#eee',
  });
}

function initEnemies(scene) {
  for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(100, scene.game.config.width - 50);
    let y = Phaser.Math.Between(50, 450);
    console.log(scene.matter);
    guards[index] = scene.mattter.add.sprite(x, y, 'guard');
    guards[index].body.collideWorldBounds = true;
    guards[index].setOrigin(0.5, 0.5);
  }
}

// the game loop. Game logic lives in here.
// is called every frame
function update() {
  player.body.fixedRotation = true;

  if (this.cursors.right.isDown) {
    player.facingRight = true;
    playerXSpeed = playerXSpeed === -50 ? 0 : 50;
    player.anims.play('runRight', 10, true);
  }

  if (this.cursors.left.isDown) {
    player.facingRight = false;
    playerXSpeed = playerXSpeed === 50 ? 0 : -50;
    player.anims.play('runLeft', 10, true);
  }
  if (this.cursors.up.isDown) {
    playerYSpeed = playerYSpeed === 50 ? 0 : -50;
    player.anims.play('runRight', 10, true);
  }
  if (this.cursors.down.isDown) {
    playerYSpeed = playerYSpeed === -50 ? 0 : 50;
    player.anims.play('runLeft', 10, true);
  }


  if (this.fireButton.isDown) {
    player.anims.currentAnim.stop();
    playerXSpeed = 0;
    playerYSpeed = 0;
  }

  player.body.velocity.x = playerXSpeed;
  player.body.velocity.y = playerYSpeed;


}

function clearLevel() {}

function destroyChildren(group) {
  group.forEach(element => {
    element.kill();
  });
}


function restart() {
  lives--;
  game.state.restart();
}

function render() {
  //if (level1bkgd != null)
  //  game.debug.body(level1bkgd);

  //  game.debug.bodyInfo(player, 32, 132);
  //  game.debug.body(player);
  // bricks.forEach(brick => {
  //   game.debug.body(brick);
  // });
  // guards.forEach(guard => {
  //   game.debug.body(guard);
  // });
}

function restartGame() {
  game.state.start(game.state.current);
}