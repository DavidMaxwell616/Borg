function mainMenuCreate() {
  splash = game.add.image(0, 0, 'splash');
  splash.width = game.width;
  splash.height = game.height;

  maxxdaddy = game.add.image(game.width * 0.85, game.height * 0.95, 'maxxdaddy');

  title = game.add.sprite(0, 0, 'title');
  title.animations.add('title');
  title.reset(60, 80);
  title.animations.play('title', 10, true);
  game.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function mainMenuUpdate() {
  if (game.spaceKey.isDown) {
    gameCreate();
    splash.visible = false;
    title.visible = false;
    startGame = true;
  }
}