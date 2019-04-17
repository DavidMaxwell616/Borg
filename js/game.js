const TITLE_WIDTH = 871;
const TITLE_HEIGHT = 142;

let player;
let guards;
let cursors;
let levels;
let playIntro = true;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let level = 1;
let currLevel;
let levelText;
let title;

let playerSpeed = 250;
let guardSpeed = 125;

const game = new Phaser.Game(1000, 640, Phaser.AUTO, 'game', {
  preload,
  create,
  update,
  render,
});

function preload() {
  game.load.crossOrigin = 'anonymous';

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  game.load.image('splash', '../assets/images/splash.png');
  game.load.image('maxxdaddy', '../assets/images/maxxdaddy.gif');

  // game.load.json('objects', '../assets/objects.json');

  game.load.spritesheet(
    'title',
    'assets/images/title.png',
    TITLE_WIDTH,
    TITLE_HEIGHT
  );
}

function mainMenuCreate() {
  const splash = game.add.image(0, 0, 'splash');
  splash.width = game.width;
  splash.height = game.height;

  game.add.image(game.width * 0.85, game.height * 0.95, 'maxxdaddy');

  title = game.add.sprite(0, 0, 'title');
  title.animations.add('title');
  title.reset(60, 80);
  title.animations.play('title', 10, true);
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function mainMenuUpdate() {
  // console.log(title.animations.currentAnim.currentFrame.index);
}

// setup all the game objects, physics etc
function create() {

  mainMenuCreate();
  cursors = game.input.keyboard.createCursorKeys();

  return;
  // reset the score
  cursors = game.input.keyboard.createCursorKeys();
  score = 0;
  // we're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;


  player = game.add.sprite(280, 350, 'runner');
  game.physics.arcade.enable(player);
  player.dead = false;
  player.body.bounce.y = 0.2;
  player.body.collideWorldBounds = true;
  player.anchor.set(0.5, 0.5);
  player.animations.add('runRight', [0, 1, 2], 10, true);
  player.animations.add('runLeft', [3, 4, 5], 10, true);

  bricks = game.add.group();

  objects = game.cache.getJSON('objects');
  currLevel = objects.levels['level-001'];
  buildLevel(currLevel);

  initEnemies();

  scoreText = game.add.text(16, 16, 'SCORE: 0', {
    fontSize: '18px',
    fill: '#eee',
  });

  livesText = game.add.text(game.width * 0.45, 16, 'LIVES: 3', {
    fontSize: '18px',
    fill: '#eee',
  });

  levelText = game.add.text(game.width * 0.9, 16, 'LEVEL: 1', {
    fontSize: '18px',
    fill: '#eee',
  });
}

function initEnemies() {

}

function buildLevel(levelMap) {
  for (let y = 0; y < levelMap.length; y++) {
    for (let x = 0; x < levelMap[y].length; x++) {
      const tile = levelMap[y][x];
      const blockX = BASE_TILE_X * x;
      const blockY = -30 + BASE_TILE_Y * y;
      let sprite;
      if (tile === '$') totalCoins++;
      const value = TILE_MAP[tile];
      if (typeof value != 'undefined') {
        const objName = value + 's';
        const group = eval(objName);
        sprite = game.add.sprite(blockX, blockY, value);
        group.add(sprite);
        if (tile != '0') sprite.body.immovable = true;
      }
    }
  }
}

// the game loop. Game logic lives in here.
// is called every frame
function update() {
  if (playIntro)
    mainMenuUpdate();
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