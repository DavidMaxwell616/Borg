const game = new Phaser.Game(1000, 640, Phaser.AUTO, 'game', {
  preload,
  create,
  update,
  render,
});

function create() {
  if (!startGame) mainMenuCreate();
  else gameCreate();
}

function gameCreate() {
  score = 0;
  // we're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.world.enableBody = true;

  player = game.add.sprite(50, 220, 'player');
  game.physics.p2.enable(player);
  player.dead = false;
  // player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.anchor.set(0.5, 0.5);
  player.animations.add('runRight', [0, 1, 2, 3], 10, true);
  player.animations.add('runLeft', [4, 5, 6, 7], 10, true);

  level = game.add.sprite(0, 0, 'level 1');
  level.width = game.width;
  level.height = game.height;
  game.physics.p2.enable(level);
  level.enableBody = true;
  level.body.immovable = true;
  level.body.clearShapes();
  level.body.loadPolygon('physicsData', 'level_1');
  console.log(level.body);

  buildLevel();
  cursors = game.input.keyboard.createCursorKeys();
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

// setup all the game objects, physics etc
function create() {
  if (!startGame) mainMenuCreate();
  else gameCreate();
}

function initEnemies() {}

function buildLevel() {
  if (currLevel === 1) {}
}

function update() {
  if (!startGame) {
    mainMenuUpdate();
    return;
  }

  movePlayer();
}

function movePlayer() {
  //  console.log(player.body.velocity.x);
  if (cursors.right.isDown) {
    if (player.body.velocity.x >= 0) {
      player.animations.play('runRight', 10, true);
      player.body.velocity.x = playerSpeed;
    } else {
      player.animations.currentAnim.stop();
      player.body.velocity.x = 0;
    }
  }
  if (cursors.left.isDown) {
    if (player.body.velocity.x <= 0) {
      player.animations.play('runLeft', 10, true);
      player.body.velocity.x = -playerSpeed;
    } else {
      player.animations.currentAnim.stop();
      player.body.velocity.x = 0;
    }
  }
  if (cursors.down.isDown) {
    if (player.body.velocity.y < -1) {
      player.animations.play('runRight', 10, true);
      player.body.velocity.y = playerSpeed;
    } else {
      player.animations.currentAnim.stop();
      player.body.velocity.y = 0;
    }
  }

  if (cursors.up.isDown) {
    if (player.body.velocity.y < 1) {
      player.animations.play('runRight', 10, true);
      player.body.velocity.y = -playerSpeed;
    } else {
      player.animations.currentAnim.stop();
      player.body.velocity.y = 0;
    }
  }
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
  //  game.debug.bodyInfo(player, 32, 132);
  //  if (typeof level !== 'undefined') game.debug.body(level);
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