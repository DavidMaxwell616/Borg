function preload() {
  const TITLE_WIDTH = 464;
  const TITLE_HEIGHT = 79;

  this.scale.pageAlignHorizontally = true;
  this.scale.pageAlignVertically = true;
  this.scale.refresh();

  showLoader(this);
  this.load.path = '../assets/images/';
  this.load.image('splash', 'splash.png');
  this.load.image('arrow', 'arrow.png');
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
  this.load.image('level 9 top wall', 'level_9_top_wall.png');
  this.load.image('level 9 bottom wall', 'level_9_bottom_wall.png');
  this.load.image('level 10', 'level_10.png');
  this.load.spritesheet(
    'title',
    'title_low_low_res.png', {
      frameWidth: TITLE_WIDTH,
      frameHeight: TITLE_HEIGHT
    }
  );

  this.load.spritesheet('player', 'player.png', {
    frameWidth: 30,
    frameHeight: 54
  }, );

  this.load.image('bullet', 'bullet.png');

  this.load.spritesheet('borg', 'borg.png', {
    frameWidth: 86,
    frameHeight: 54
  }, );

  this.load.spritesheet('guard', 'guard.png', {
    frameWidth: 55,
    frameHeight: 46
  }, );
  this.load.path = '../assets/json/';
  this.load.json('levelData', 'level_data.json');
}

function showLoader(game) {
  var progressBar = game.add.graphics();
  var progressBox = game.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  var x = width/2-160;
  progressBox.fillRect(x, height*.6-10, 50);
  game.load.on('progress', function (value) {});

  game.load.on('fileprogress', function (file) {});

  game.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
    loadingText.destroy();
    percentText.destroy();
  });
  game.load.on('progress', function (value) {
    progressBar.clear();
    progressBar.fillStyle(0xff4500, 1);
    var x = width/2-140;
    progressBar.fillRect(x,height*.6-10, 300 * value, 30);
    percentText.setText(parseInt(value * 100) + '%');
  });

  var width = game.cameras.main.width;
  var height = game.cameras.main.height;
  var loadingText = game.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: 'Loading...',
    style: {
      font: '20px monospace',
      fill: '#ffffff'
    }
  });
  loadingText.setOrigin(0.5);

  var percentText = game.make.text({
    x: width / 2,
    y: height / 2 - 5,
    text: '0%',
    style: {
      font: '18px monospace',
      fill: '#ffffff'
    }
  });
  percentText.setOrigin(0.5, 0.5);
}