function mainMenuCreate(game) {
  splash = game.add.image(0, 0, 'splash');
  splash.width = game.width;
  splash.height = game.height;

  maxxdaddy = game.add.image(game.width * 0.85, game.height * 0.95, 'maxxdaddy');

  title = game.add.sprite(0, 0, 'title');

  var animConfig = {
    key: 'title',
    frames: game.anims.generateFrameNumbers('title'),
    frameRate: 6,
    yoyo: false,
    repeat: -1
  };

  var anim = game.anims.create(animConfig);
  title.setPosition(60, 80);
  title.anims.load('title');
  title.anims.play('title');
  // game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function mainMenuUpdate() {
  if (game.spaceKey.isDown) {
    gameCreate();
    splash.visible = false;
    title.visible = false;
    startGame = true;
  }
}