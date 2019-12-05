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
      debug: true,
    },
  },
};

var game = new Phaser.Game(config);
var player;
var cursorKeys;
var playerXSpeed;
var playerYSpeed;

function preload() {
  this.load.path = '../assets/images/';
  this.load.spritesheet('player', 'player.png', {
    frameWidth: 40,
    frameHeight: 76
  }, );
  this.load.image('bullet', 'bullet.png');
}

function create() {
  cursorKeys = this.input.keyboard.createCursorKeys();
  player = this.matter.add.sprite(150, 150, 'player');
  player.body.collideWorldBounds = true;
  player.setOrigin(0.5, 0.5);
  bullet = this.matter.add.sprite(0, 0, 'bullet');
  bullet.visible = false;
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
}


function shootBullet(direction) {
  console.log(direction);
  bullet.visible = true;
  bullet.setPosition(player.x, player.y);
  bullet.setVelocityX(direction.x);
  bullet.setVelocityY(direction.y);

}

function update() {
  if (playerXSpeed == 0 && playerYSpeed == 0)
    player.setFrame(0);
  if (cursorKeys.right.isDown) {
    playerXSpeed = playerXSpeed === -1 ? 0 : 1;
    player.anims.play('run');
    player.flipX = false;
  }
  if (cursorKeys.left.isDown) {
    player.facingRight = false;
    playerXSpeed = playerXSpeed === 1 ? 0 : -1;
    player.flipX = true;
    player.anims.play('run');
  }
  if (cursorKeys.up.isDown) {
    playerYSpeed = playerYSpeed === 1 ? 0 : -1;
    player.anims.play('run');
  }
  if (cursorKeys.down.isDown) {
    playerYSpeed = playerYSpeed === -1 ? 0 : 1;
    player.anims.play('run');
  }


  if (cursorKeys.space.isDown) {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    bulletDirection = {
      xv: playerXSpeed,
      yv: playerYSpeed
    };
    shootBullet(bulletDirection);
    playerXSpeed = 0;
    playerYSpeed = 0;
  }
  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
}