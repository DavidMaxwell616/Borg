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

function preload() {
  this.load.path = '../assets/json/';
  this.load.json('levelData', 'sprite_physics.json');

  this.load.path = '../assets/images/';
  this.load.image('level 1', 'level_1.png');
}

function create() {
  let data = this.cache.json.get('levelData').level_1;
  for (let index = 0; index < data.length; index++) {
    var level = {
      polygons: [],
    };
    var vertices = data[index].shape;
    var xScale = 1;
    var yScale = 1;
    var x = vertices[0] * xScale;
    var y = vertices[1] * yScale;
    var path = getOffsets(x, y, xScale, yScale, vertices);
    var verts = this.matter.verts.fromPath(path);
    var poly = this.add.polygon(x, y, verts, 0x0000ff);
    var body = this.matter.add
      .gameObject(poly, {
        shape: {
          type: 'fromVerts',
          verts,
          flagInternal: true,
          density: 5,
          friction: 1,
          frictionAir: 1,
          frictionStatic: 1,
          restitution: 0
        },
      })
      .setStatic(true)
      .setOrigin(0, 0);
    // level1bkgd = this.add.image(0, 0, 'level 1');
    // level1bkgd.setOrigin(0, 0);
    // level1bkgd.setDisplaySize(
    //   this.game.config.width,
    //   this.game.config.height * 0.7,
    // );
  }
  //   levelData.push(level);
}

function getOffsets(xOffset, yOffset, xScale, yScale, vertices) {
  var newPath = [];

  for (let index = 0; index < vertices.length; index += 2) {
    newPath.push((vertices[index] - xOffset) * xScale);
    newPath.push((vertices[index + 1] - yOffset) * yScale);
  }
  console.log(xOffset, yOffset, newPath);
  return newPath.toString();
}

function update() {

}