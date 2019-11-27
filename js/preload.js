function preload() {
  const TITLE_WIDTH = 867;
  const TITLE_HEIGHT = 142;

  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  this.load.path = '../assets/images/';
  this.load.image('splash', 'splash.png');
  this.load.image('scoreboard', 'scoreboard.png');
  this.load.image('maxxdaddy', 'maxxdaddy.gif');
  this.load.image('level 1', 'level_1.png');
  this.load.image('level 2', 'level_2.png');
  this.load.image('level 3', 'level_3.png');
  this.load.image('level 4', 'level_4.png');
  this.load.image('level 5', 'level_5.png');
  this.load.image('level 6', 'level_6.png');
  this.load.image('level 7', 'level_7.png');
  this.load.image('level 8', 'level_8.png');
  this.load.image('level 9', 'level_9.png');
  this.load.image('level 10', 'level_10.png');
  this.load.spritesheet(
    'title',
    'title.png', {
      frameWidth: TITLE_WIDTH,
      frameHeight: TITLE_HEIGHT
    }
  );

  this.load.spritesheet('player', 'player.png', {
    frameWidth: 40,
    frameHeight: 76
  }, );

  this.load.spritesheet('guard', 'guard.png', {
    frameWidth: 55,
    frameHeight: 46
  }, );
  this.load.path = '../assets/json/';
  this.load.json('physicsData', 'sprite_physics.json');
}