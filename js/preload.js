function preload() {
  game.load.crossOrigin = 'anonymous';

  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.scale.refresh();

  game.load.image('splash', '../assets/images/splash.png');
  game.load.image('maxxdaddy', '../assets/images/maxxdaddy.gif');
  game.load.image('level 1', '../assets/images/level_1.png');
  game.load.image('level 2', '../assets/images/level_2.png');
  game.load.image('level 3', '../assets/images/level_3.png');
  game.load.image('level 4', '../assets/images/level_4.png');
  game.load.image('level 5', '../assets/images/level_5.png');
  game.load.physics('physicsData', 'assets/physics/sprite_physics.json');
  game.load.spritesheet(
    'title',
    'assets/images/title.png',
    TITLE_WIDTH,
    TITLE_HEIGHT,
  );

  game.load.spritesheet('player', 'assets/images/player.png', 40, 76);
  game.load.spritesheet('guard', 'assets/images/guard.png', 55, 46);
}