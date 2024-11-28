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

    /* layers */
    const groundLayer = map.createLayer("Grass-n-Paths", [grass, farmTiles], 0, 0);
    const houseLayer = map.createLayer("House", farmTiles, 0, 0);
    const decorLayer = map.createLayer("Decor", [decor, fences, tree], 0, 0);
    const waterLayer = map.createLayer("Water", water, 0, 0);
    const tiledGroundLayer = map.createLayer("Tiled Ground", tiledGround, 0, 0);

    /* player */
    this.player = new Player(this, 50, 50, "player", 0);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    waterLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, waterLayer);

    houseLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, houseLayer);

    decorLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, decorLayer);

    /* camera */
    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    /* controls */
    this.cursors = this.input.keyboard.createCursorKeys();

    // Click detection for house
    this.input.on("pointerdown", (pointer) => {
      const tile = houseLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      if (tile) {
        this.showPopup();
      }
    });

    // Click detection for tiled ground
    this.input.on("pointerdown", (pointer) => {
      const tile = tiledGroundLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      if (tile) {
        this.showPlantInfoPopup();
      }
    });

    /* day */
    this.day = 1;
    this.showDay();
  }

  showDay() {
    if (this.dayText) {
      this.dayText.setText(`Day: ${this.day}`);
    } else {
      this.dayText = this.add.text(10, 10, `Day: ${this.day}`, {
        font: "18px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 5, y: 5 },
      }).setScrollFactor(0);
    }
  }

  showPopup() {
    this.physics.pause();
    const centerX = this.cameras.main.midPoint.x;
    const centerY = this.cameras.main.midPoint.y;

    const overlay = this.add.rectangle(centerX, centerY, 300, 200, 0x000000, 0.7).setOrigin(0.5);
    const popupText = this.add.text(
      centerX,
      centerY - 50,
      "Would you like to go to sleep?",
      { font: "20px Arial", color: "#ffffff", align: "center" }
    ).setOrigin(0.5);

    const yesButton = this.add.text(centerX - 50, centerY + 30, "Yes", {
      font: "18px Arial",
      color: "#00ff00",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        this.day++;
        this.showDay();
        this.closePopup(overlay, popupText, yesButton, noButton);
      });

    const noButton = this.add.text(centerX + 50, centerY + 30, "No", {
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

  showPlantInfoPopup() {
    this.physics.pause();
    const centerX = this.cameras.main.midPoint.x;
    const centerY = this.cameras.main.midPoint.y;

    const overlay = this.add.rectangle(centerX, centerY, 300, 200, 0x000000, 0.7).setOrigin(0.5);
    const popupText = this.add.text(
      centerX,
      centerY - 50,
      "Days Planted:\nWatered:\nAdjacency Issues:\nPlant Level:",
      { font: "20px Arial", color: "#ffffff", align: "center" }
    ).setOrigin(0.5);

    const harvestButton = this.add.text(centerX - 50, centerY + 20, "Harvest", {
      font: "18px Arial",
      color: "#ffffff",
      backgroundColor: "#0000ff",
      padding: { x: 10, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        // Placeholder for Harvest functionality
      });

    const waterButton = this.add.text(centerX + 50, centerY + 20, "Water", {
      font: "18px Arial",
      color: "#ffffff",
      backgroundColor: "#00ff00",
      padding: { x: 10, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        // Placeholder for Water functionality
      });

    const closeButton = this.add.text(centerX, centerY + 80, "Close", {
      font: "18px Arial",
      color: "#ff0000",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        this.closePopup(overlay, popupText, harvestButton, waterButton, closeButton);
      });
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }

  update() {
    this.player.update(this.cursors, this);
  }
}
