var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  scene: {
    preload: preload,
    create: create
  },
  physics: {
    default: "matter",
    matter: {
      // debug: true
    }
  }
};

var game = new Phaser.Game(config);

function create() {
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  // reset the score

  game.cursors = game.input.keyboard.createCursorKeys();
  score = 0;
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  player = game.add.sprite(50, 240, 'player');
  game.physics.p2.enable(player);
  player.dead = false;
  player.body.collideWorldBounds = true;
  player.anchor.set(0.5, 0.5);
  player.animations.add('runRight', [0, 1, 2, 3], 10, true);
  player.animations.add('runLeft', [4, 5, 6, 7], 10, true);
  player.facingRight = true;
  playerXSpeed = 0;
  playerYSpeed = 0;

  level1bkgd = game.add.sprite(0, 0, 'level 1');
  game.physics.p2.enable(level1bkgd, true);
  level1bkgd.body.x = game.world.centerX;
  level1bkgd.body.y = game.world.centerY + 5;
  //level1bkgd.anchor.set(0, 0);
  level1bkgd.body.clearShapes();
  level1bkgd.body.loadPolygon("physicsData", "level_1");
  level1bkgd.body.static = true;
  maxxdaddy.visible = false;

  numGuards = curLevel + 4;
  initEnemies();

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

function initEnemies() {
  for (let index = 0; index < numGuards; index++) {
    let x = game.rnd.integerInRange(100, game.width - 50);
    let y = game.rnd.integerInRange(50, 450);
    guards[index] = game.add.sprite(x, y, 'guard');
    game.physics.p2.enable(guards[index]);
    guards[index].body.collideWorldBounds = true;
    guards[index].anchor.set(0.5, 0.5);
  }
}

// the game loop. Game logic lives in here.
// is called every frame
function update() {
  if (!startGame) {
    mainMenuUpdate();
    return;
  }

  player.body.fixedRotation = true;

  if (game.cursors.right.isDown) {
    player.facingRight = true;
    playerXSpeed = playerXSpeed === -50 ? 0 : 50;
    player.animations.play('runRight', 10, true);
  }

  if (game.cursors.left.isDown) {
    player.facingRight = false;
    playerXSpeed = playerXSpeed === 50 ? 0 : -50;
    player.animations.play('runLeft', 10, true);
  }
  if (game.cursors.up.isDown) {
    playerYSpeed = playerYSpeed === 50 ? 0 : -50;
    player.animations.play('runRight', 10, true);
  }
  if (game.cursors.down.isDown) {
    playerYSpeed = playerYSpeed === -50 ? 0 : 50;
    player.animations.play('runLeft', 10, true);
  }


  if (game.fireButton.isDown) {
    player.animations.currentAnim.stop();
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