class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  create() {
    /*  map  */
    const map = this.add.tilemap("mapJSON");

    const tiledGround = map.addTilesetImage("TiledGround", "tiledGroundTiles");
    const water = map.addTilesetImage("Water", "waterTiles");
    const decor = map.addTilesetImage("Decor", "decorTiles");
    const fences = map.addTilesetImage("Fences", "fencesTiles");
    const tree = map.addTilesetImage("Tree", "treeTiles");
    const farmTiles = map.addTilesetImage("FarmTiles", "farmTiles");
    const grass = map.addTilesetImage("Grass", "grassTiles");

    /*  layers  */
    const groundLayer = map.createLayer("Grass-n-Paths", [grass, farmTiles], 0, 0);
    const houseLayer = map.createLayer("House", farmTiles, 0, 0);
    const decorLayer = map.createLayer("Decor", [decor, fences, tree], 0, 0);
    const waterLayer = map.createLayer("Water", water, 0, 0);
    const tiledGroundLayer = map.createLayer("Tiled Ground", tiledGround, 0, 0);

    /*  player  */
    this.player = new Player(this, 50, 50, "player", 0);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    /*  collisions  */
    waterLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, waterLayer);

    waterLayer.setCollisionBetween(0, 17);


    /*  camera  */
    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    /*  controls  */
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  
  update() {
    this.player.update(this.cursors, this);
  }
}
