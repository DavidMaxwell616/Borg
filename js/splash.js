function mainMenuCreate(scene) {
  var width = scene.game.config.width; 
  var height = scene.game.config.height;
   splash = scene.add.image(0, 0, 'splash');
  splash.setDisplaySize(width, height);
  splash.setOrigin(0, 0);
  maxxdaddy = scene.add.image(width * 0.9, height * 0.87, 'maxxdaddy');
  title = scene.add.sprite(width/2, height*.25, 'title');
  title.setOrigin(.5);
  
  var animConfig = {
    key: 'title',
    frames: scene.anims.generateFrameNumbers('title'),
    frameRate: 6,
    repeat: -1
  };
   title.anims.load('title');
//  title.anims.play('title');
 var pointer = scene.input.activePointer;
 // console.log(pointer);
  scene.input.on('pointerdown', function(pointer){
    Start();
 });
//  if (pointer.isDown) {
//     console.log(pointer);

//   }
//     //  Start();
  scene.input.keyboard.on('keydown_SPACE', Start);

  function Start(){
  if (startGame)
      return;
    splash.visible = false;
  title.visible = false;
    startGame = true;
    gameCreate(scene);
}

}