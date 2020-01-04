var config = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: 'game',
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
};

var game = new Phaser.Game(config);
var polygons = [];

function preload() {
  this.load.path = '../assets/json/';
  this.load.json('levelData', 'level_data.json');

  this.load.path = '../assets/images/';
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
}

function create() {
  var level = 1;
  level1bkgd = this.add.image(0, 0, 'level ' + level);
  level1bkgd.setOrigin(0, 0);
  level1bkgd.visible = false;
  // level1bkgd.setDisplaySize(this.game.config.width, this.game.config.height );
  loadLevel(this, level);
  this.input.keyboard.on('keydown_SPACE', function (event) {
    clearLevel(this);
    // level++;
    // loadLevel(this, level);
  }, this);
}

function loadLevel(scene, level) {
  let data = scene.cache.json.get('levelData');
  let levelData = data['level_' + level];
  for (let index = 0; index < levelData.length; index++) {
    var vertices = levelData[index].shape;
    let polyObject = [];
    for (let i = 0; i < vertices.length / 2; i++) {
      polyObject.push({
        x: vertices[i * 2],
        y: vertices[i * 2 + 1],
      });
    }

    let centre = Phaser.Physics.Matter.Matter.Vertices.centre(
      polyObject,
    );
    var verts = scene.matter.verts.fromPath(vertices.join(' '));
    const xScale = .9;
    const yScale = .84;
    for (let i = 0; i < verts.length; i++) {
      ((verts[i].x -= centre.x) * -1) * xScale;
      ((verts[i].y -= centre.y) * -1) * yScale;
    }
    var poly = scene.add.polygon(
      centre.x * xScale,
      centre.y * yScale,
      verts,
      0x0000ff, 1
    );
    polygons.push(poly);
    scene.matter.add
      .gameObject(poly, {
        shape: {
          type: 'fromVerts',
          verts,
          flagInternal: true,
        },
      })
      .setStatic(true)
      .setOrigin(0, 0);
    var level1bkgd = scene.add.image(0, 0, 'level ' + level);
    level1bkgd.setOrigin(0, 0);
    level1bkgd.setDisplaySize(scene.game.config.width, scene.game.config.height * .7);
  }
}

function clearLevel(scene) {
  let bodies = scene.matter.world.localWorld.bodies;
  console.log(bodies);
  for (let index = 0; index < bodies.length; index++) {
    let body = bodies[index];
    if (body.label != 'player') {
      if (body.gameObject != null)
        body.gameObject.destroy();
      scene.matter.world.remove(body);
    }
  }
}

function update() {

}