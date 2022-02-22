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
      debug: false,
    },
  },
};

var game = new Phaser.Game(config);
var _scene;
var width, height;

function create() {
  _scene = this;
  width = _scene.game.config.width;
  height = _scene.game.config.height;
  if (!startGame) mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  score = 0;
  objectData = _scene.cache.json.get('levelData');
  polygons = _scene.add.group()
  polyImages = _scene.add.group()
  player = _scene.matter.add.sprite(xStart, yStart, 'player');
  player.setOrigin(0.5).setScale(.6);
  player.body.collideWorldBounds = true;
  player.body.label = 'player';
  player.dying = false;

  _scene.anims.create({
    key: 'run',
    frames: _scene.anims.generateFrameNumbers('player', {
      start: 0,
      end: 2
    }),
    frameRate: 10,
    repeat: -1
  });
  player.setFixedRotation();
  player.anims.load('run');
  cat1 = _scene.matter.world.nextCategory();
  player.setCollisionCategory(cat1);
  cat2 = _scene.matter.world.nextCategory();
  player.setCollidesWith([cat1, cat2]);
  playerXSpeed = 0;
  playerYSpeed = 0;
  player.setDepth(1)
  _scene.matter.world.setBounds(0, 0, width, height);
  maxxdaddy.visible = false;

  scoreboard = _scene.add.image(0, height * 0.8, 'scoreboard');
  scoreboard.setOrigin(0);
  scoreboard.setDisplaySize(
    width,
    height * 0.2,
  );

  numGuards = 0;//level + 4;
  initEnemies();
  buildLevel(level);

  BORG = _scene.matter.add.sprite(xStart, 500, 'borg');
  BORG.setOrigin(0.5);
  BORG.body.label = 'BORG';
  BORG.visible = false;
  BORG.active = false;
  cat3 = _scene.matter.world.nextCategory();
  BORG.setCollisionCategory(cat3);
  BORG.setCollidesWith([cat3,cat2]);
  
  scoreText = _scene.add.text(
    width * 0.31,
    height * 0.9,
    'SCORE: 0', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  livesText = _scene.add.text(
    width * 0.47,
    height * 0.9,
    'LIVES: 3', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  levelText = _scene.add.text(
    width * 0.6,
    height * 0.9,
    'level: 1', {
      fontFamily: 'Arial',
      fontSize: '18px',
      fill: '#eee',
    },
  );

  _scene.input.keyboard.on('keydown_LEFT', function (event) {
    if (player.dying) return;
    movePlayer(-1, 0);
    player.flipX = true;
  });

  _scene.input.keyboard.on('keydown_RIGHT', function (event) {
    if (player.dying) return;
    movePlayer(1, 0);
    player.flipX = false;
  });

  _scene.input.keyboard.on('keydown_UP', function (event) {
    if (player.dying) return;
    movePlayer(0, -1)
  });

  _scene.input.keyboard.on('keydown_DOWN', function (event) {
    if (player.dying) return;
    movePlayer(0, 1);
  });

  _scene.input.keyboard.on('keydown_SPACE', function (event) {
    Fire();
  }, _scene);

  _scene.input.keyboard.on('keyup_SPACE', function (event) {
    shooting = false;
  });

  function onObjectClicked(pointer,gameObject){
    
    if(pointer.y>400)
   {
      switch (gameObject.name) {
    case 'right':
      movePlayer(1, 0);
      break;
    case 'left':
      movePlayer(-1, 0);
      break;
    case 'up':
      movePlayer(0, -1);
      break;
    case 'down':
      movePlayer(0, 1);
      break;
    default:
      break;
  }
}
  }
  
 setUpArrows();
  _scene.input.on('pointerdown', function(pointer){
    if(pointer.y<400)
    Fire();
 });
 _scene.input.on('gameobjectdown',onObjectClicked);

  _scene.matter.world.on('collisionstart', function (event) {
    for (var i = 0; i < event.pairs.length; i++) {
      var bodyA = getRootBody(event.pairs[i].bodyA);
      var bodyB = getRootBody(event.pairs[i].bodyB);
      if ((bodyA.label == 'bullet' || bodyA.label == 'guardBullet') && bodyB.label == 'obstacle') {
        bodyA.gameObject.destroy();
        _scene.matter.world.remove(bodyA);
      } else if ((bodyB.label == 'bullet' || bodyB.label == 'guardBullet') && bodyA.label == 'obstacle') {
        if (bodyB.gameObject != null)
          bodyB.gameObject.destroy();
        _scene.matter.world.remove(bodyB);
      } else if ((bodyA.label == 'bullet' || bodyA.label == 'guardBullet') && bodyB.label == 'guard') {
        killGuard(bodyB);
        if (bodyA.gameObject != null)
          bodyA.gameObject.destroy();
        _scene.matter.world.remove(bodyA);
      } else if ((bodyB.label == 'bullet' || bodyB.label == 'guardBullet') && bodyA.label == 'guard') {
        killGuard(bodyA);
        if (bodyB.gameObject != null)
          bodyB.gameObject.destroy();
        _scene.matter.world.remove(bodyB);
      } else if (bodyA.label == 'player' && bodyB.label == 'obstacle') {
        fryPlayer();
      } else if (bodyB.label == 'player' && bodyA.label == 'obstacle') {
        fryPlayer();
      } else if (bodyA.label == 'player' && bodyB.label == 'guard') {
        fryPlayer();
        bodyB.gameObject.destroy();
        _scene.matter.world.remove(bodyB);
      } else if (bodyB.label == 'player' && bodyA.label == 'guard') {
        fryPlayer();
        bodyA.gameObject.destroy();
        _scene.matter.world.remove(bodyA);
      } else if (bodyA.label == 'player' && bodyB.label == 'guardBullet') {
        fryPlayer();
        bodyB.gameObject.destroy();
        _scene.matter.world.remove(bodyB);
      } else if (bodyA.label == 'guardBullet' && bodyB.label == 'player') {
        fryPlayer();
        bodyA.gameObject.destroy();
        _scene.matter.world.remove(bodyA);
      } else if (bodyA.label == 'player' && bodyB.label == 'wall') {
        fryPlayer();
        resetWalls();
      }
      else if (bodyA.label == 'boss' && bodyB.label == 'bullet') {
          console.log('game over!')
      }
      console.log(bodyA.label,bodyB.label);
    }
  });

}

function setUpArrows(){
  var y = height-10;
  for (let index = 0; index < arrows.length; index++) {
   var arrow = arrowStats[index];
   arrows[index] = _scene.add.image(0,0,'arrow');
   arrows[index].setOrigin(0.5).setScale(.25);
   arrows[index].xOffset = arrow.xOffset;  
   arrows[index].yOffSet = arrow.yOffset;  
    arrows[index].x = 60+arrows[index].width*.25+40+arrow.xOffset;
    arrows[index].y = y- arrows[index].width*.25+arrow.yOffset;
    arrows[index].name= arrow.direction;
    arrows[index].setInteractive();
   arrows[index].angle =arrow.angle;  
  }
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
function Fire(){
  if (player.dying) return;
  bulletDirection = {
    xv: playerXSpeed * 5,
    yv: playerYSpeed * 5
  };
  var frame = 2 + bulletDirection.yv;
  player.setFrame(frame);
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'bullet';
  if (bulletDirection.xv != 0 || bulletDirection.yv != 0)
    shootBullet(bullet, bulletDirection);
  playerXSpeed = 0;
  playerYSpeed = 0;
  shooting = true;
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

function shootBullet(bullet, direction) {
  var offsetX = 0;
  var offsetY = 0;
  offsetY = direction.yv * 2;
  offsetX = direction.xv * 2;
  bullet.setPosition(player.x + offsetX + direction.xv, player.y + offsetY + direction.yv);
  bullet.setVelocityX(direction.xv);
  bullet.setVelocityY(direction.yv);
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat1);
  setBulletAngle(bullet,direction);
}

function setBulletAngle(bullet, direction){
  var angle = Math.abs(direction.xv+direction.yv);
  if(angle==10)
    bullet.angle = 45;
  else if(angle==0)
    bullet.angle = 135;
  else 
    bullet.angle=Math.abs(direction.yv)*18;
}

function guardShoot(guard) {
  var bulletDirection = Math.atan((player.x - guard.x) / (player.y - guard.y));
  //some light randomness to the bullet angle
  bulletDirection += ((Math.random() / 10) + (-(Math.random() / 10)));
  var bullet = _scene.matter.add.sprite(0, 0, 'bullet');
  bullet.body.label = 'guardBullet';
  var xOffset = 0;
  var yOffset = 0;
  var xBulletSpeed = 5;
  var yBulletSpeed = 5;
  bullet.setFixedRotation();
  // Calculate X and y velocity of bullet to moves it from shooter to target
  if (player.x >= guard.x) {
    xOffset = guard.width / 2;
  } else {
    xBulletSpeed = -xBulletSpeed;
    xOffset = -guard.width / 2;
  }
  if (player.y >= guard.y) {
    yOffset = guard.height / 2;
  } else {
    yBulletSpeed = -yBulletSpeed;
    yOffset = -guard.height / 2;
  }
  //  console.log(guard.body.id, bulletDirection);
  bullet.setVelocityX(xBulletSpeed * Math.sin(Math.abs(bulletDirection)));
  bullet.setVelocityY(yBulletSpeed * Math.cos(Math.abs(bulletDirection)));
  bullet.setPosition(guard.x + xOffset, guard.y + yOffset);
  let angle = Phaser.Math.Angle.Between(player.x, player.y, guard.x, guard.y);
  bullet.rotation = angle;
  bullet.setFrictionAir(0);
  bullet.setCollisionCategory(cat1);
}

function initEnemies() {
   for (let index = 0; index < numGuards; index++) {
    let x = Phaser.Math.Between(200, width - 50);
    let y = Phaser.Math.Between(50, 350);
    guards[index] = _scene.matter.add.sprite(x, y, 'guard');

    _scene.anims.create({
      key: 'guardRun',
      frames: _scene.anims.generateFrameNumbers('guard', {
        start: 0,
        end: 1
      }),
      frameRate: 10,
      repeat: -1
    });
    guards[index].setFixedRotation();
    guards[index].anims.load('guardRun');
    guards[index].setCollisionCategory(cat1);
    guards[index].body.dying = false;
    guards[index].body.collideWorldBounds = true;
    guards[index].setOrigin(0.5).setScale(xScale, yScale);
    guards[index].body.label = 'guard';
  }
}

function updateStats() {
  levelText.setText('level: ' + level);
  scoreText.setText('SCORE: ' + score);
  livesText.setText('LIVES: ' + lives);
}

function fryPlayer() {
  player.dying = true;
  _scene.time.delayedCall(500, () => {
    player.dying = false;
    player.setPosition(xStart, yStart);
    player.tint = 0xffffff;
    lives--;
    resetBorg();
  });
}

function killGuard(guard) {
  guard.dying = true;
  _scene.time.delayedCall(500, () => {
    if (guard.gameObject != null)
      guard.gameObject.destroy();
    _scene.matter.world.remove(guard);
    guardsLeft--;
    score += 50;
  });
}


function buildLevel() {
  levelData = objectData['level_' + level];
  levelBkgd = _scene.add.sprite(0, 0, 'level ' + level);
  levelBkgd.setOrigin(0);
  levelBkgd.setDisplaySize(
    width,
    400,
  );
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
    var verts = _scene.matter.verts.fromPath(vertices.join(' '));
    for (let i = 0; i < verts.length; i++) {
      (verts[i].x -= centre.x) * -1 * xScale;
      (verts[i].y -= centre.y) * -1 * yScale;
    }
    var poly = _scene.add.polygon(
      centre.x * xScale,
      centre.y * yScale,
      verts,
      0x0000ff, 0,
    );
    var objBody = _scene.matter.add
      .gameObject(
        poly, {
          shape: {
            type: 'fromVerts',
            verts,
            flagInternal: true,
          },
        })
      .setStatic(true)
      .setOrigin(0);
    objBody.body.label = 'obstacle';
    objBody.setCollisionCategory(cat1);
    polygons.add(poly);
    levelBkgd.setDepth(0);
  }
  if(level==9)
  {
    level_9_top_wall = _scene.matter.add.sprite(width/2, 0, 'level 9 top wall');
    level_9_top_wall2 = _scene.add.sprite(width/2, 2, 'level 9 top wall 2');
     level_9_top_wall.body.label = 'wall';
     level_9_top_wall.setCollisionCategory(cat1);
     level_9_bottom_wall = _scene.matter.add.sprite(width/2, 391, 'level 9 bottom wall');
     level_9_bottom_wall2 = _scene.add.sprite(width/2, 398, 'level 9 bottom wall 2');
     level_9_bottom_wall.body.label = 'wall';
    level_9_bottom_wall.setCollisionCategory(cat1);
    moveWall=0;
  }
  if(level==10)
  {
    boss = _scene.matter.add.sprite(width*.66, 200, 'boss');
    boss.body.label = 'boss';
    boss.setCollisionCategory(cat1);
    boss.setFixedRotation();
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

function moveEnemies() {
  for (let index = 0; index < numGuards; index++) {
    var guard = guards[index];
    if (guard.active) {
      var guardXMove = 0;
      var guardYMove = 0;
      if (guard.body.dying) {
        guard.anims.pause(guard.anims.currentAnim.frames[8]);
        guard.setFrame(8);
        return;
      }
      if (player.y < guard.y)
        guardYMove = -1;
      else if (player.y > guard.y)
        guardYMove = 1;
      if (player.x < guard.x) {
        guard.flipX = false;
        guardXMove = -1;
      } else if (player.x > guard.x) {
        guard.flipX = true;
        guardXMove = 1;
      }
      guard.x += guardXMove;
      guard.y += guardYMove;
      if (guardXMove != 0 || guardYMove != 0)
        guard.anims.play('guardRun');
      else
        guard.anims.pause(guard.anims.currentAnim.frames[0]);
      let shoot = Phaser.Math.Between(1, 200);
      if (shoot == 200) {
        guardShoot(guard)
      }
      guard.setDepth(100);
    }
  }
}

function resetBorg(){
  BORG.setPosition(borgXStart, borgYStart);
  BORG.visible = false;
  borgTimer = (10-level) * BORGTIMERLENGTH;
  BORG.active = false;
}

function resetWalls(){
  level_9_top_wall.setPosition(width/2, 0);
  level_9_bottom_wall.setPosition(width/2, 391);
  level_9_top_wall2.scaleY=1;
  level_9_bottom_wall2.scaleY=1;
  level_9_bottom_wall2.y=398;
  moveWall=0;
}

function startBorg(){
  BORG.active = true;
  BORG.visible = true;
  BORG.setPosition(xStart, yStart);
}
function MoveBorg() {
  if (player.x > BORG.x || player.x < BORG.x && BORG.active)
    BORG.setVelocityX(1);
  BORG.setVelocityY(borgYV);
  BORG.setDepth(0);
  if (BORG.x > game.width) resetBorg();
  if (Math.abs(borgYPath - BORG.y) < 20)
    BORG.setFrame(1);
  else
    BORG.setFrame(0);
  if (BORG.y > borgYPath)
    borgYV = -5;
  borgYV += .1;

  if (player.y > BORG.y)
    borgYPath += .1;
  if (player.y < BORG.y)
    borgYPath -= .1;

}
// the game loop. Game logic lives in here.
// is called every frame
function update() {

  if (!startGame)
    return;
  if (borgTimer > 0)
    borgTimer--;
  if (borgTimer == 0 && !BORG.active) {
     startBorg();
  }
  if (player.x > 885) {
    if (guardsLeft > 0)
      player.setPosition(xStart, yStart).setVelocityX(0).setVelocityY(0);
    else {
      clearLevel(this);
      player.setPosition(xStart, yStart);
      level++;
      buildLevel(level);
      numGuards = 0;//level + 4;
      guardsLeft = numGuards;
      initEnemies(this);
      resetBorg();
    }
  }
if(level==9){
  moveWall++;
  if(moveWall>50)
{
  level_9_top_wall.y+=5;
  level_9_top_wall2.scaleY+=2.5;
  
  level_9_bottom_wall.y-=5;
  level_9_bottom_wall2.y-=2.5;
 level_9_bottom_wall2.scaleY+=2.5;
    moveWall=0;
}
}
  if (player.dying) {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    playerXSpeed = 0;
    playerYSpeed = 0;
    player.tint = Math.random() * 0xffffff;
  }

  if (BORG.visible)
    MoveBorg();
  if (playerXSpeed === 0 && playerYSpeed === 0)
    player.anims.pause(player.anims.currentAnim.frames[0]);
  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
  updateStats();
  moveEnemies(this);
}

function clearLevel() {
  polygons.children.each(object => {
    object.destroy();
  })
  levelBkgd.visible = false;
}

function restart() {
  lives--;
  game.state.restart();
}

function render() {

}

function restartGame() {
  startGame = false;
  _scene.game.state.start(game.state.current);
}