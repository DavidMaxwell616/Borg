var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 500,
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
  score = 0;
  objectData = scene.cache.json.get('levelData');

  player = scene.matter.add.sprite(xStart, yStart, 'player');
  player.setOrigin(0.5, 0.5);
  player.setScale(.9);
  player.body.collideWorldBounds = true;

  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 2
    }),
    frameRate: 10,
    repeat: -1
  });

  player.anims.load('run');

  playerXSpeed = 0;
  playerYSpeed = 0;
  scene.matter.world.setBounds(0, 0, scene.game.config.width, scene.game.config.height);
  maxxdaddy.visible = false;

  scoreboard = scene.add.image(0, scene.game.config.height * 0.8, 'scoreboard');
  scoreboard.setOrigin(0, 0);
  scoreboard.setDisplaySize(
    scene.game.config.width,
    scene.game.config.height * 0.2,
  );

  numGuards = curLevel + 4;
  initEnemies(scene);
  loadLevel(scene, curLevel);

  scoreText = scene.add.text(
    scene.game.config.width * 0.31,
    scene.game.config.height * 0.89,
    'SCORE: 0', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  livesText = scene.add.text(
    scene.game.config.width * 0.63,
    scene.game.config.height * 0.89,
    'LIVES: 3', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  levelText = scene.add.text(
    scene.game.config.width * 0.75,
    scene.game.config.height * 0.89,
    'LEVEL: 1', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  scene.input.keyboard.on('keydown_LEFT', function (event) {
    movePlayer(-1, 0);
    player.flipX = true;
  });

  scene.input.keyboard.on('keydown_RIGHT', function (event) {
    movePlayer(1, 0);
    player.flipX = false;
  });

  scene.input.keyboard.on('keydown_UP', function (event) {
    movePlayer(0, -1)
  });

  scene.input.keyboard.on('keydown_DOWN', function (event) {
    movePlayer(0, 1);
  });

  scene.input.keyboard.on('keydown_SPACE', function (event) {
    bulletDirection = {
      xv: playerXSpeed,
      yv: playerYSpeed
    };
    var frame = 3 + bulletDirection.yv;
    player.anims.pause(player.anims.currentAnim.frames[frame]);
    var bullet = scene.matter.add.sprite(0, 0, 'bullet');
    shootBullet(scene, bullet, bulletDirection);
    playerXSpeed = 0;
    playerYSpeed = 0;
    shooting = true;
  }, scene);

  scene.input.keyboard.on('keyup_SPACE', function (event) {
    shooting = false;
  });

}

function movePlayer(xv, yv) {
  if (xv != 0) {
    if (playerXSpeed === -xv) {
      playerXSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerXSpeed === 0) {
      playerXSpeed = xv;
      player.anims.play('run');
    }
  }
  if (yv != 0) {
    if (playerYSpeed === -yv) {
      playerYSpeed = 0;
      player.anims.pause(player.anims.currentAnim.frames[0]);
    } else if (playerYSpeed === 0) {
      playerYSpeed = yv;
      player.anims.play('run');
    }
  }
}

function shootBullet(scene, bullet, direction) {
  console.log(scene);
  bullet.setPosition(player.x, player.y);
  bullet.setVelocityX(direction.xv * 10);
  bullet.setVelocityY(direction.yv * 10);
  bullet.label = 'bullet';
  player.flipX = direction.xv < 0;
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

function fryPlayer(scene) {
  // Set the visibility to 0 i.e. hide the player
  // Add a tween that 'blinks' until the player is gradually visible
  // player.setAlpha(0);
  // let tw = scene.tweens.add({
  //   targets: player,
  //   alpha: 1,
  //   duration: 200,
  //   ease: 'Linear',
  //   repeat: 5,
  // });
  player.x = 150;
  player.y = 150;
  player.rotate = 0;
}

function loadLevel(scene, level) {
  levelData = objectData['level_' + level];
  levelBkgd = scene.add.image(0, 0, 'level ' + level);
  levelBkgd.setOrigin(0, 0);
  levelBkgd.setDisplaySize(
    scene.game.config.width,
    400,
  );
  levelBkgd.setDepth(100);
  for (let index = 0; index < levelData.length; index++) {
    var level = {
      polygons: [],
    };
    var vertices = levelData[index].shape;
    let polyObject = [];
    for (let i = 0; i < vertices.length / 2; i++) {
      polyObject.push({
        x: vertices[i * 2],
        y: vertices[i * 2 + 1],
      });
    }

    let centre = Phaser.Physics.Matter.Matter.Vertices.centre(polyObject);
    var verts = scene.matter.verts.fromPath(vertices.join(' '));
    for (let i = 0; i < verts.length; i++) {
      (verts[i].x -= centre.x) * -1 * xScale;
      (verts[i].y -= centre.y) * -1 * yScale;
    }
    var poly = scene.add.polygon(
      centre.x * xScale,
      centre.y * yScale,
      verts,
      0x0000ff, .1,
    );
    level.polygons.push(poly);
    var objBody = scene.matter.add
      .gameObject(poly, {
        shape: {
          type: 'fromVerts',
          verts,
          flagInternal: true,
        },
      })
      .setStatic(true)
      .setOrigin(0, 0);
  }
  // scene.matter.world.on('collisionstart', function (event, player, objBody) {
  //   // console.log(event);
  //   fryPlayer(this);
  // });
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
  if (!startGame)
    return;
  if (playerXSpeed === 0 && playerYSpeed === 0)
    player.anims.pause(player.anims.currentAnim.frames[0]);
  player.angle = 0;
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

}

function restartGame() {
  game.state.start(game.state.current);
}