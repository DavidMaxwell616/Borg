var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 400,
  backgroundColor: '#000000',
  parent: 'phaser-example',
  physics: {
    default: 'matter',
    arcade: {
      gravity: {
        y: 600
      },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  }
};

var game = new Phaser.Game(config);

function preload() {
  const TITLE_WIDTH = 865;
  const TITLE_HEIGHT = 142;

  this.load.path = '../assets/images/';
  this.load.spritesheet(
    'title',
    'title.png', {
      frameWidth: TITLE_WIDTH,
      frameHeight: TITLE_HEIGHT
    }
  );

  this.load.image('splash', 'splash.png');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
}

function create() {
  var splash = this.add.image(0, 0, 'splash');
  splash.width = this.width;
  splash.height = this.height;

  var maxxdaddy = this.add.image(game.width * 0.85, game.height * 0.95,
    'maxxdaddy');


  var title = this.add.sprite(0, 0, 'title');
  title.animations.add('title');
  title.reset(60, 80);
  title.animations.play('title', 10, true);
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {

}