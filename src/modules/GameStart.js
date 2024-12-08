function initializeGame(scene) {
  const externalDSL = scene.cache.text.get("externalConfig");
  const externalConfig = jsyaml.load(externalDSL);

  const mapConfig = externalConfig.map;
  const playerConfig = externalConfig.player;
  const layersConfig = externalConfig.map.layers;

  /* map */
  scene.map = scene.add.tilemap(mapConfig.tilemap);

  /* tilesets */
  scene.tilesets = {};
  for (const [tilesetName, key] of Object.entries(mapConfig.tilesets)) {
    scene.tilesets[tilesetName] = scene.map.addTilesetImage(tilesetName, key);
  }

  /* layers */
  scene.layers = {};
  for (const [layer, layerProperties] of Object.entries(layersConfig)) {
    const requiredTilesets = layerProperties.requiredTilesets.map((tileset) => scene.tilesets[tileset]);
    console.log(layer);
    scene.layers[layer] = scene.map.createLayer(layerProperties.name, requiredTilesets, 0, 0);
    console.log(scene.layers[layer]);
  }

  /*  player  */
  scene.player = new Player(scene, playerConfig);
  scene.physics.world.setBounds(0, 0, scene.map.widthInPixels, scene.map.heightInPixels);

  /*  collisions  */
  for (const [layer, layerProperties] of Object.entries(layersConfig)) {
    if (layerProperties.collision.enabled) {
      scene.layers[layer].setCollisionByExclusion([-1]);
      scene.physics.add.collider(scene.player, scene.layers[layer]);
    }
  }
}
