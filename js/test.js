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
  this.load.json('levelData', 'level_data.json');

  this.load.path = '../assets/images/';
  this.load.image('level 1', 'level_1.png');
}

function create() {
  loadLevel(this, 1);
}

function loadLevel(scene, level) {
  let data = scene.cache.json.get('levelData');
  let levelData = data['level_1'];
  for (let index = 0; index < levelData.length; index++) {
    var level = {
      polygons: [],
    };
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
    const yScale = .7;
    for (let i = 0; i < verts.length; i++) {
      ((verts[i].x -= centre.x) * -1) * xScale;
      ((verts[i].y -= centre.y) * -1) * yScale;
    }
    var poly = scene.add.polygon(
      centre.x * xScale,
      centre.y * yScale,
      verts,
      0x0000ff
    );
    level.polygons.push(poly);
    scene.matter.add
      .gameObject(poly, {
        shape: {
          type: 'fromVerts',
          verts,
          flagInternal: true,
        },
      })
      .setOrigin(0, 0);

  }
}


function update() {

}