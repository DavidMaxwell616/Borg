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
  player.body.label = 'player';

  scene.anims.create({
    key: 'run',
    frames: scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 2
    }),
    frameRate: 10,
    repeat: -1
  });
  player.setFixedRotation();
  player.anims.load('run');
  cat1 = scene.matter.world.nextCategory();
  player.setCollisionCategory(cat1);
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
  buildLevel(scene, curLevel);

  BORG = scene.matter.add.sprite(xStart, 500, 'borg');
  BORG.setOrigin(0.5, 0.5);
  BORG.body.label = 'BORG';
  BORG.visible = false;
  cat2 = scene.matter.world.nextCategory();

  BORG.setCollisionCategory(cat2);

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
      xv: playerXSpeed * 5,
      yv: playerYSpeed * 5
    };
    var frame = 2 + bulletDirection.yv;
    player.setFrame(frame);
    var bullet = scene.matter.add.sprite(0, 0, 'bullet');
    bullet.body.label = 'bullet';
    var frame = setFrame(playerXSpeed, playerYSpeed);
    shootBullet(scene, bullet, bulletDirection, frame);
    playerXSpeed = 0;
    playerYSpeed = 0;
    shooting = true;
  }, scene);

  scene.input.keyboard.on('keyup_SPACE', function (event) {
    shooting = false;
  });


  scene.matter.world.on('collisionstart', function (event) {
    for (var i = 0; i < event.pairs.length; i++) {
      var bodyA = getRootBody(event.pairs[i].bodyA);
      var bodyB = getRootBody(event.pairs[i].bodyB);
      if (bodyA.label == 'bullet' && bodyB.label == 'obstacle') {
        bodyA.gameObject.destroy();
        scene.matter.world.remove(bodyA);
      } else if (bodyB.label == 'bullet' && bodyA.label == 'obstacle') {
        if (bodyB.gameObject != null)
          bodyB.gameObject.destroy();
        scene.matter.world.remove(bodyB);
      } else if (bodyA.label == 'bullet' && bodyB.label == 'guard') {
        killGuard(scene, bodyB);
        if (bodyA.gameObject != null)
          bodyA.gameObject.destroy();
        scene.matter.world.remove(bodyA);
      } else if (bodyB.label == 'bullet' && bodyA.label == 'guard') {
        killGuard(scene, bodyA);
        bodyB.gameObject.destroy();
        scene.matter.world.remove(bodyB);
      } else if (bodyA.label == 'player' && bodyB.label == 'obstacle') {
        fryPlayer(scene);
      } else if (bodyB.label == 'player' && bodyA.label == 'obstacle') {
        fryPlayer(scene);
      } else if (bodyA.label == 'player' && bodyB.label == 'guard') {
        fryPlayer(scene);
        bodyB.gameObject.destroy();
        scene.matter.world.remove(bodyB);
      } else if (bodyB.label == 'player' && bodyA.label == 'guard') {
        fryPlayer(scene);
        bodyA.gameObject.destroy();
        scene.matter.world.remove(bodyA);
      }
    }
  });

}

function setFrame(xv, yv) {
  if (yv == 0 && xv != 0)
    return 0;
  else if (xv == 0 && yv != 0)
    return 1;
  else if ((xv > 0 && yv > 0) || (xv < 0 && yv < 0))
    return 2;
  else
    return 3;
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

function shootBullet(scene, bullet, direction, frame) {
  bullet.setPosition(player.x + direction.xv, player.y + direction.yv);
  bullet.setVelocityX(direction.xv);
  bullet.setVelocityY(direction.yv);
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat1);
  bullet.setFrame(frame);
}

function guardShoot(scene, guard, direction, frame) {
  var bullet = scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'bullet';
  bullet.setPosition(guard.x + direction.xv, guard.y + direction.yv);
  bullet.setVelocityX(direction.xv * 5);
  bullet.setVelocityY(direction.yv * 5);
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat1);
  bullet.setFrame(frame);
}

function initEnemies(scene) {
  let physics = scene.matter;
  for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(200, scene.game.config.width - 50);
    let y = Phaser.Math.Between(50, 350);
    guards[index] = scene.matter.add.sprite(x, y, 'guard');

    scene.anims.create({
      key: 'guardRun',
      frames: scene.anims.generateFrameNumbers('guard', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });
    guards[index].setFixedRotation();
    guards[index].anims.load('guardRun');
    guards[index].setCollisionCategory(cat1);

    guards[index].body.collideWorldBounds = true;
    guards[index].setOrigin(0.5, 0.5).setScale(xScale, yScale);
    guards[index].body.label = 'guard';
  }
}

function updateStats() {
  levelText.setText('LEVEL: ' + curLevel);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function fryPlayer(scene) {
  player.visible = false;
  makeExplosion(scene, player.x, player.y);
  scene.time.delayedCall(500, () => {
    emitter.stop();
    player.visible = true;
    player.setPosition(xStart, yStart);
    lives--;
  });
}

function killGuard(scene, guard) {
  makeExplosion(scene, guard.position.x, guard.position.y);
  scene.time.delayedCall(500, () => {
    emitter.stop();
    guard.gameObject.destroy();
    scene.matter.world.remove(guard);
    guardsLeft--;
    score += 50;
  });
}

function makeExplosion(scene, x, y) {
  particles = scene.add.particles('flares');
  emitter = particles.createEmitter({
    frame: ['red', 'blue', 'green', 'yellow'],
    x: x,
    y: y,
    speed: 200,
    lifespan: 200,
    blendMode: 'ADD'
  });

}

function buildLevel(scene, level) {
  borgTimer = 500;
  levelData = objectData['level_' + level];
  levelBkgd = scene.add.sprite(0, 0, 'level ' + level);
  levelBkgd.setOrigin(0, 0);
  levelBkgd.setDisplaySize(
    scene.game.config.width,
    400,
  );
  levelBkgd.setDepth(100);
  for (let index = 0; index < levelData.length; index++) {
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
      0x0000ff, 0,
    );
    var objBody = scene.matter.add
      .gameObject(
        poly, {
          shape: {
            type: 'fromVerts',
            verts,
            flagInternal: true,
          },
        })
      .setStatic(true)
      .setOrigin(0, 0);
    objBody.body.label = 'obstacle';
    objBody.setCollisionCategory(cat1);

  }
}

function getRootBody(body) {
  if (body.parent === body) {
    return body;
  }
  while (body.parent !== body) {
    body = body.parent;
  }
  return body;
}

function moveEnemies(scene) {
  for (let index = 0; index < numGuards; index++) {
    if (guards[index].active) {
      var guardXMove = 0;
      var guardYMove = 0;
      if (player.y < guards[index].y)
        guardYMove = -1;
      else if (player.y > guards[index].y)
        guardYMove = 1;
      else if (player.x < guards[index].x) {
        guards[index].flipX = false;
        guardXMove = -1;
      } else if (player.x > guards[index].x) {
        guards[index].flipX = true;
        guardXMove = -1;
      }
      guards[index].x += guardXMove;
      guards[index].y += guardYMove;
      if (guardXMove != 0 || guardYMove != 0)
        guards[index].anims.play('guardRun');
      else
        guards[index].anims.pause(guards[index].anims.currentAnim.frames[0]);
      let shoot = Phaser.Math.Between(1, 200);
      if (shoot == 200) {
        bulletDirection = {
          xv: guardXMove * 5,
          yv: guardYMove * 5
        };
        var frame = setFrame(guardXMove, guardYMove);
        guardShoot(scene, guards[index], bulletDirection, frame)
      }
    }
  }
}

function moveBORG() {
  BORG.setVelocityX(1);
  BORG.setVelocityY(borgYV);
  if (BORG.x > 400)
    BORG.setPosition(borgXStart, borgYStart);
  if (Math.abs(borgYPath - BORG.y) < 20)
    BORG.setFrame(1);
  else
    BORG.setFrame(0);
  if (BORG.y > borgYPath)
    borgYV = -5;
  borgYV += .1;
}
// the game loop. Game logic lives in here.
// is called every frame
function update() {
  if (!startGame)
    return;
  if (borgTimer > 0)
    borgTimer--;
  if (borgTimer == 0 && !BORG.visible) {
    BORG.visible = true;
    BORG.setPosition(xStart, yStart);
  }

  if (lives == 0)
    restartGame(this);

  if (player.x > 885) {
    if (guardsLeft > 0)
      player.setPosition(xStart, yStart).setVelocityX(0).setVelocityY(0);
    else {
      clearLevel(this);
      curLevel++;
      buildLevel(this, curLevel);
      numGuards = curLevel + 4;
      guardsLeft = numGuards;
      initEnemies(this);
    }
  }

  if (BORG.visible)
    moveBORG();
  if (playerXSpeed === 0 && playerYSpeed === 0)
    player.anims.pause(player.anims.currentAnim.frames[0]);
  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
  updateStats();
  moveEnemies(this);
}

function clearLevel(scene) {
  let bodies = scene.matter.world.localWorld.bodies;
  for (let index = 0; index < bodies.length; index++) {
    let body = bodies[index];
    if (body.gameObject != null)
      body.gameObject.destroy();
    scene.matter.world.remove(body);
  }
}

function restart() {
  lives--;
  game.state.restart();
}

function render() {

}

function restartGame(scene) {
  startGame = false;
  scene.game.state.start(game.state.current);
}