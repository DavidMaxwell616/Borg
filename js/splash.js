function mainMenuCreate(scene) {
  splash = scene.add.image(0, 0, 'splash');
  var config = scene.game.config;
  splash.width = config.width;
  splash.height = config.height;
  console.log(splash.width);
  splash.setOrigin(0, 0);
  maxxdaddy = scene.add.image(config.width * 0.85, config.height * 0.95, 'maxxdaddy');
  title = scene.add.sprite(0, 0, 'title');

  var animConfig = {
    key: 'title',
    frames: scene.anims.generateFrameNumbers('title'),
    frameRate: 6,
    repeat: -1
  };

  var anim = scene.anims.create(animConfig);
  title.setOrigin(0, 0);
  title.setPosition(60, 80);
  title.anims.load('title');
  title.anims.play('title');
  cursorKeys = scene.input.keyboard.createCursorKeys();
  isSpaceDown = cursorKeys.space.isDown;
  scene.input.keyboard.on('keydown', function () {
    splash.visible = false;
    title.visible = false;
    startGame = true;
    gameCreate(scene);
  });
}