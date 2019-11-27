function mainMenuCreate(scene) {
  splash = scene.add.image(0, 0, 'splash');
  var config = scene.game.config;
  splash.setDisplaySize(scene.game.config.width, scene.game.config.height);
  splash.setOrigin(0, 0);
  maxxdaddy = scene.add.image(config.width * 0.9, config.height * 0.87, 'maxxdaddy');
  title = scene.add.sprite(0, 0, 'title');

  var animConfig = {
    key: 'title',
    frames: scene.anims.generateFrameNumbers('title'),
    frameRate: 6,
    repeat: -1
  };

  scene.anims.create(animConfig);
  title.setOrigin(0, 0);
  title.setPosition(10, 80);
  title.anims.load('title');
  title.anims.play('title');
  cursorKeys = scene.input.keyboard.createCursorKeys();
  isSpaceDown = cursorKeys.space.isDown;
  scene.scale.resize(config.width, config.height);
  scene.input.keyboard.on('keydown', function () {
    splash.visible = false;
    title.visible = false;
    startGame = true;
    gameCreate(scene);
  });
}