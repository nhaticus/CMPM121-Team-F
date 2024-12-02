class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
  }

  create() {
    /* map */
    const map = this.add.tilemap("mapJSON");
    const tiledGround = map.addTilesetImage("TiledGround", "tiledGroundTiles");
    const water = map.addTilesetImage("Water", "waterTiles");
    const decor = map.addTilesetImage("Decor", "decorTiles");
    const fences = map.addTilesetImage("Fences", "fencesTiles");
    const tree = map.addTilesetImage("Tree", "treeTiles");
    const farmTiles = map.addTilesetImage("FarmTiles", "farmTiles");
    const grass = map.addTilesetImage("Grass", "grassTiles");

    /*  layers  */
    this.groundLayer = map.createLayer(
      "Grass-n-Paths",
      [grass, farmTiles],
      0,
      0
    );
    this.houseLayer = map.createLayer("House", farmTiles, 0, 0);
    this.decorLayer = map.createLayer("Decor", [decor, fences, tree], 0, 0);
    this.waterLayer = map.createLayer("Water", water, 0, 0);
    this.tiledGroundLayer = map.createLayer("Tiled Ground", tiledGround, 0, 0);
    /* layers */
    const groundLayer = map.createLayer(
      "Grass-n-Paths",
      [grass, farmTiles],
      0,
      0
    );
    const houseLayer = map.createLayer("House", farmTiles, 0, 0);
    const decorLayer = map.createLayer("Decor", [decor, fences, tree], 0, 0);
    const waterLayer = map.createLayer("Water", water, 0, 0);
    const tiledGroundLayer = map.createLayer("Tiled Ground", tiledGround, 0, 0);

    /*  player  */
    this.player = new Player(this, 500, 500, "player", 0);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    /*  collisions  */
    this.waterLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.waterLayer);

    this.houseLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.houseLayer);

    this.decorLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.decorLayer);

    this.plants = this.add.group();

    /*  camera  */
    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    /*  controls  */
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on("pointerdown", (pointer) => {
      // Get the tile at the clicked position in the house layer
      const tile = this.houseLayer.getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY
      );

      if (tile) {
        //console.log("Clicked on the house layer! Tile index:", tile.index); // Debug: See which tile was clicked
        this.showPopup(); // Show popup for any tile in the house layer
      } else {
        //console.log("No tile found on the house layer at clicked position.");
      }
    });

    /* day */
    this.day = 1;
    this.showDay();

    /*  house */
    this.houseLayer.setTileIndexCallback(10, this.showPopup, this);

    /* inventory */

    let inventory = [];

    const inventorybutton = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 150,
      y: 280,
    });
    inventorybutton.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton);

    const inventorybutton2 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 182,
      y: 280,
    });
    inventorybutton2.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton2);

    const inventorybutton3 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 214,
      y: 280,
    });
    inventorybutton3.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton3);

    const inventorybutton4 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 246,
      y: 280,
    });
    inventorybutton4.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton4);

    const inventorybutton5 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 278,
      y: 280,
    });
    inventorybutton5.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton5);

    const inventorybutton6 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 310,
      y: 280,
    });
    inventorybutton6.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton6);

    const inventorybutton7 = new Inventory({
      scene: this,
      key: "inventory",
      up: 0,
      down: 1,
      over: 1,
      x: 342,
      y: 280,
    });
    inventorybutton7.on("pointerdown", this.onPressed, this);

    inventory.push(inventorybutton7);

    inventory.forEach((slot) => console.log(slot.contents));
  }

  onPressed(content) {
    //console.log(this.contents);
  }

  showDay() {
    if (this.dayText) {
      this.dayText.setText(`Day: ${this.day}`);
    } else {
      // Create the day text for the first time
      this.dayText = this.add
        .text(10, 10, `Day: ${this.day}`, {
          font: "18px Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 5, y: 5 },
        })
        .setScrollFactor(0); // Fix the text to the camera view
    }
  }

  showPopup(player, tile) {
    // Pause the game
    this.physics.pause();

    // Get the camera's center
    const centerX = this.cameras.main.midPoint.x;
    const centerY = this.cameras.main.midPoint.y;

    // Create a background overlay for the popup
    const overlay = this.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5);

    // Add text for the popup
    const popupText = this.add
      .text(centerX, centerY - 50, "Would you like to go to sleep?", {
        font: "20px Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Create 'Yes' button
    const yesButton = this.add
      .text(centerX - 50, centerY + 30, "Yes", {
        font: "18px Arial",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.newDay();
        this.showDay();
        this.closePopup(overlay, popupText, yesButton, noButton);
      });

    // Create 'No' button
    const noButton = this.add
      .text(centerX + 50, centerY + 30, "No", {
        font: "18px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .on("pointerdown", () => {
        this.closePopup(overlay, popupText, yesButton, noButton);
      });
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }

  newDay() {
    this.day++;
    this.checkPlantReq();
  }

  checkPlantReq() {
    const surroundingTiles = [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    this.plants.getChildren().forEach((plant) => {
      let surroundingPlants = 0;

      surroundingTiles.forEach((offset) => {
        const tile = this.tiledGroundLayer.getTileAtWorldXY(plant.x, plant.y);
        tile.x += offset.x;
        tile.y += offset.y;

        if (tile && this.plantCheck(tile)) {
          surroundingPlants++;
        }
      });

      console.log(
        `Plant at (${plant.x}, ${plant.y}) has ${surroundingPlants} surrounding plants.`
      );

      /* calls a function that will check if the surrounding plants matches with required plants */
      plant.newDay(surroundingPlants);
    });
  }

  plantCheck(currentTile) {
    return this.plants.getChildren().some((plant) => {
      const plantTile = this.tiledGroundLayer.getTileAtWorldXY(
        plant.x,
        plant.y
      );

      // console.log(
      //   "Tile checking: " + currentTile.x,
      //   currentTile.y + " Plant tile: " + plantTile.x,
      //   plantTile.y
      // );
      return (
        plantTile &&
        plantTile.x === currentTile.x &&
        plantTile.y === currentTile.y
      );
    });
  }

  farmingUpdate() {
    const tile = this.tiledGroundLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y
    );

    if (
      tile &&
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      )
    ) {
      if (this.plantCheck(tile)) {
        return;
      }
      const plant = new Plant(
        this,
        tile.getCenterX(),
        tile.getCenterY(),
        "plant"
      );
      plant.setInteractive().on("pointerdown", () => {
        plant.showPlantInfoPopup(this);
      });
      this.plants.add(plant);
      console.log(this.plants);
    }
  }
  update() {
    this.player.update(this.cursors, this);

    this.farmingUpdate();
  }
}
