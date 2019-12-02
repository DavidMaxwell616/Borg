var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
};

var game = new Phaser.Game(config);

function create() {
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate(scene) {
  cursorKeys = scene.input.keyboard.createCursorKeys();
  var level1Body = scene.cache.json.get('Level1Body');
  score = 0;

  player = scene.matter.add.sprite(50, 240, 'player');
  player.setOrigin(0.5, 0.5);

  scene.anims.create({
    key: 'runLeft',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 3,
    }),
    frameRate: 10,
    repeat: -1,
  });

  scene.anims.create({
    key: 'runRight',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 4,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

  player.anims.load('runLeft');
  player.anims.load('runRight');

  player.facingRight = true;
  playerXSpeed = 0;
  playerYSpeed = 0;
  scene.matter.world.setBounds(0, 0, scene.game.config.width, scene.game.config.height);
  level1bkgd = scene.add.image(0, 0, 'level 1');
  level1bkgd.setOrigin(0, 0);

  //level1bkgd.width = scene.game.config.width;
  //level1bkgd.height = scene.game.config.height * .7;
  level1bkgd.setDisplaySize(
    scene.game.config.width,
    scene.game.config.height * 0.7,
  );
  // level1bkgd.body.clearShapes();
  // level1bkgd.body.loadPolygon("physicsData", "level_1");
  //level1bkgd.body.static = true;
  maxxdaddy.visible = false;

  scoreboard = scene.add.image(0, scene.game.config.height * 0.7, 'scoreboard');
  scoreboard.setOrigin(0, 0);
  //level1bkgd.width = scene.game.config.width;
  //level1bkgd.height = scene.game.config.height * .7;
  scoreboard.setDisplaySize(
    scene.game.config.width,
    scene.game.config.height * 0.3,
  );

  numGuards = curLevel + 4;
  initEnemies(scene);

  scoreText = scene.add.text(
    scene.game.config.width * 0.31,
    scene.game.config.height * 0.85,
    'SCORE: 0', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  livesText = scene.add.text(
    scene.game.config.width * 0.63,
    scene.game.config.height * 0.85,
    'LIVES: 3', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  levelText = scene.add.text(
    scene.game.config.width * 0.75,
    scene.game.config.height * 0.85,
    'LEVEL: 1', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );
}

function initEnemies(scene) {
  let physics = scene.matter;
  for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(100, scene.game.config.width - 50);
    let y = Phaser.Math.Between(50, 450);
    guards[index] = physics.add.sprite(x, y, 'guard');
    guards[index].body.collideWorldBounds = true;
    guards[index].setOrigin(0.5, 0.5);
  }
}

function moveEnemies(scene) {
  // for (let index = 0; index < numGuards; index++) {
  //   if (player.y < guards[index].y) guards[index].y--;
  //   else if (player.y > guards[index].y) guards[index].y++;
  //   else if (player.x < guards[index].x) guards[index].x--;
  //   else if (player.x > guards[index].x) guards[index].x++;
  // }
}
// the game loop. Game logic lives in here.
// is called every frame
function update() {
  if (!startGame) return;

  //player.body.fixedRotation = true;
  if (cursorKeys.right.isDown) {
    player.facingRight = true;
    playerXSpeed = playerXSpeed === -runSpeed ? 0 : runSpeed;
    player.anims.play('runRight');
  }

  if (cursorKeys.left.isDown) {
    player.facingRight = false;
    playerXSpeed = playerXSpeed === runSpeed ? 0 : -runSpeed;
    player.anims.play('runLeft');
  }
  if (cursorKeys.up.isDown) {
    playerYSpeed = playerYSpeed === runSpeed ? 0 : -runSpeed;
    player.anims.play('runRight');
  }
  if (cursorKeys.down.isDown) {
    playerYSpeed = playerYSpeed === -runSpeed ? 0 : runSpeed;
    player.anims.play('runLeft');
  }

  if (cursorKeys.space.isDown) {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    playerXSpeed = 0;
    playerYSpeed = 0;
  }

  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);

  moveEnemies(this);
}

function clearLevel() {}

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