var config = {
  type: Phaser.AUTO,
  width: 300,
  height: 300,
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
  // plugins: {
  //   scene: [
  //     {
  //       plugin: PhaserMatterCollisionPlugin, // The plugin class
  //       key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
  //       mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
  //     }
  //   ]
  // }
};

var game = new Phaser.Game(config);
var player;
var cursorKeys;
var playerXSpeed;
var playerYSpeed;
var shooting;
var particles;
var rightWall;
var running;
var standing;

function preload() {
  this.load.path = '../assets/images/';
  this.load.spritesheet('player', 'player.png', {
    frameWidth: 40,
    frameHeight: 76
  }, );
  this.load.image('bullet', 'bullet.png');
  this.load.atlas('flares', 'flares.png', '../json/flares.json');
}

function create() {
  //cursorKeys = this.input.keyboard.createCursorKeys();
  player = this.matter.add.sprite(150, 150, 'player');
  let bounds = this.matter.world.setBounds(0, 0, 300, 300);
  rightWall = bounds.walls.right;
  player.body.collideWorldBounds = true;
  // this.matter.world.on('collisionstart', function (event, player, rightWall) {
  //  // console.log(event);
  //   fryPlayer(this);
  // });
  player.setOrigin(0.5, 0.5);
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('player', {
      start: 0,
      end: 2
    }),
    frameRate: 10,
    repeat: -1
  });

  player.anims.load('run');
  player.facing = {
    vert: 0,
    horiz: 1
  };
  playerXSpeed = 0;
  playerYSpeed = 0;

  this.input.keyboard.on('keydown_LEFT', function (event) {
    movePlayer(-1, 0);
    player.flipX = true;
  });

  this.input.keyboard.on('keydown_RIGHT', function (event) {
    movePlayer(1, 0);
    player.flipX = false;
  });

  this.input.keyboard.on('keydown_UP', function (event) {
    movePlayer(0, -1)
  });

  this.input.keyboard.on('keydown_DOWN', function (event) {
    movePlayer(0, 1);
  });

  this.input.keyboard.on('keydown_SPACE', function (event) {
    bulletDirection = {
      xv: playerXSpeed,
      yv: playerYSpeed
    };
    var frame = 3 + bulletDirection.yv;
    player.anims.pause(player.anims.currentAnim.frames[frame]);
    var bullet = this.matter.add.sprite(0, 0, 'bullet');
    shootBullet(this, bullet, bulletDirection);
    playerXSpeed = 0;
    playerYSpeed = 0;
    shooting = true;
  }, this);
  this.input.keyboard.on('keyup_SPACE', function (event) {
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

function fryPlayer(scene) {
  // console.log(scene);
  // particles = scene.scene.add.particles('flares');

  // var emitter = particles.createEmitter({
  //     frame: [ 'red', 'blue', 'green', 'yellow' ],
  //     x: player.x,
  //     y: player.y,
  //     speed: 200,
  //     lifespan: 100,
  //     blendMode: 'ADD'
  // });

}

function shootBullet(scene, bullet, direction) {
  bullet.setPosition(player.x, player.y);
  bullet.setVelocityX(direction.xv * 10);
  bullet.setVelocityY(direction.yv * 10);
  bullet.label = 'bullet';
  player.flipX = direction.xv < 0;
}

function update() {
  if (playerXSpeed === 0 && playerYSpeed === 0)
    player.anims.pause(player.anims.currentAnim.frames[0]);

  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
}