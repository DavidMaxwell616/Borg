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
  plugins: {
    scene: [{
      plugin: PhaserMatterCollisionPlugin, // The plugin class
      key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
      mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
    }]
  }
};

var game = new Phaser.Game(config);
var player;
var cursorKeys;
var playerXSpeed;
var playerYSpeed;
var bulletDirection = {
  xv: 1,
  yv: 0
};

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
  let bounds = this.matter.world.setBounds(0, 0, 300, 300);
  player.body.collideWorldBounds = true;

  this.matterCollision.addOnCollideStart({
    objectA: player,
    objectB: bounds.walls.right,
    callback: function (eventData) {
      // This function will be invoked any time the player and trap door collide
      const {
        bodyA,
        bodyB,
        gameObjectA,
        gameObjectB,
        pair
      } = eventData;
      fryPlayer(this);
      // bodyA & bodyB are the Matter bodies of the player and door respectively
      // gameObjectA & gameObjectB are the player and door respectively
      // pair is the raw Matter pair data
    },
    context: this // Context to apply to the callback function
  });

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
  playerXSpeed = 0;
  playerYSpeed = 0;
}

function fryPlayer(scene) {
  // Set the visibility to 0 i.e. hide the player
  // Add a tween that 'blinks' until the player is gradually visible
  player.setAlpha(0);
  let tw = scene.tweens.add({
    targets: player,
    alpha: 1,
    duration: 200,
    ease: 'Linear',
    repeat: 5,
  });
  player.x = 150;
  player.y = 150;
  player.rotate = 0;
}

function shootBullet(scene, direction) {
  var bullet = scene.matter.add.sprite(player.x, player.y, 'bullet');
  bullet.setVelocityX(direction.xv * 10);
  bullet.setVelocityY(direction.yv);
  player.flipX = direction.xv < 0;
  var frame = 3 + direction.yv;
  player.setFrame(frame);
}

function update() {
  if (playerXSpeed == 0 && playerYSpeed == 0)
    player.setFrame(0);

  if (cursorKeys.right.isDown && playerXSpeed != 1) {
    playerXSpeed = playerXSpeed === -1 ? 0 : 1;
    player.anims.play('run');
    player.flipX = false;
  }
  if (cursorKeys.left.isDown && playerXSpeed != -1) {
    playerXSpeed = playerXSpeed === 1 ? 0 : -1;
    player.flipX = true;
    player.anims.play('run');
  }
  if (cursorKeys.up.isDown && playerYSpeed != -1) {
    playerYSpeed = playerYSpeed === 1 ? 0 : -1;
    player.anims.play('run');
  }
  if (cursorKeys.down.isDown && playerYSpeed != 1) {
    playerYSpeed = playerYSpeed === -1 ? 0 : 1;
    player.anims.play('run');
  }


  if (cursorKeys.space.isDown) {
    player.anims.pause(player.anims.currentAnim.frames[0]);
    bulletDirection = {
      xv: playerXSpeed,
      yv: playerYSpeed
    };
    shootBullet(this, bulletDirection);
    playerXSpeed = 0;
    playerYSpeed = 0;
  }

  player.setVelocityX(playerXSpeed);
  player.setVelocityY(playerYSpeed);
}