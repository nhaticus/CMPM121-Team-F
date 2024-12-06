function startGame(scene) {
  /* map */
  scene.map = scene.add.tilemap("mapJSON");

  scene.tiledGround = scene.map.addTilesetImage("TiledGround", "tiledGroundTiles");
  scene.water = scene.map.addTilesetImage("Water", "waterTiles");
  scene.decor = scene.map.addTilesetImage("Decor", "decorTiles");
  scene.fences = scene.map.addTilesetImage("Fences", "fencesTiles");
  scene.tree = scene.map.addTilesetImage("Tree", "treeTiles");
  scene.farmTiles = scene.map.addTilesetImage("FarmTiles", "farmTiles");
  scene.grass = scene.map.addTilesetImage("Grass", "grassTiles");

  /* layers */
  scene.groundLayer = scene.map.createLayer("Grass-n-Paths", [scene.grass, scene.farmTiles], 0, 0);
  scene.houseLayer = scene.map.createLayer("House", scene.farmTiles, 0, 0);
  scene.decorLayer = scene.map.createLayer("Decor", [scene.decor, scene.fences, scene.tree], 0, 0);
  scene.waterLayer = scene.map.createLayer("Water", scene.water, 0, 0);
  scene.tiledGroundLayer = scene.map.createLayer("Tiled Ground", scene.tiledGround, 0, 0);

  /*  player  */
  scene.player = new Player(scene, 500, 500, "player", 0);
  scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

  /*  collisions  */
  scene.waterLayer.setCollisionByExclusion([-1]);
  scene.physics.add.collider(scene.player, scene.waterLayer);

  scene.houseLayer.setCollisionByExclusion([-1]);
  scene.physics.add.collider(scene.player, scene.houseLayer);

  scene.decorLayer.setCollisionByExclusion([-1]);
  scene.physics.add.collider(scene.player, scene.decorLayer);
  scene.plants = scene.add.group();
}
