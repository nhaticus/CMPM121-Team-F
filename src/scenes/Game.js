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
  
    this.input.on('pointerdown', (pointer) => {
      // Get the tile at the clicked position in the house layer
      const tile = houseLayer.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      
      if (tile) {
        console.log("Clicked on the house layer! Tile index:", tile.index); // Debug: See which tile was clicked
        this.showPopup(); // Show popup for any tile in the house layer
      } else {
        console.log("No tile found on the house layer at clicked position.");
      }
    });
    
    /* day */
    this.day = 1;
    this.showDay();
    
    /*  house */
    houseLayer.setTileIndexCallback(10, this.showPopup, this);
  }
  
  showDay() {
    // If the text object already exists, update it
    if (this.dayText) {
      this.dayText.setText(`Day: ${this.day}`);
    } else {
      // Create the day text for the first time
      this.dayText = this.add.text(10, 10, `Day: ${this.day}`, {
        font: "18px Arial",
        color: "#ffffff",
        backgroundColor: "#000000",
        padding: { x: 5, y: 5 }
      }).setScrollFactor(0); // Fix the text to the camera view
    }
  }
  
  
  
  showPopup(player, tile) {
    // Pause the game
    this.physics.pause();
  
    // Get the camera's center
    const centerX = this.cameras.main.midPoint.x;
    const centerY = this.cameras.main.midPoint.y;
  
    // Create a background overlay for the popup
    const overlay = this.add.rectangle(
      centerX,
      centerY,
      300,
      200,
      0x000000,
      0.7
    ).setOrigin(0.5);
  
    // Add text for the popup
    const popupText = this.add.text(
      centerX,
      centerY - 50,
      "Would you like to go to sleep?",
      { font: "20px Arial", color: "#ffffff", align: "center" }
    ).setOrigin(0.5);
  
    // Create 'Yes' button
    const yesButton = this.add.text(centerX - 50, centerY + 30, "Yes", {
      font: "18px Arial",
      color: "#00ff00",
      backgroundColor: "#000000",
      padding: { x: 10, y: 5 },
    })
      .setInteractive()
      .on("pointerdown", () => {
        this.day++; // Increment the day
        console.log("Day: " + this.day); // Log the new day value
        this.showDay(); // Update the day display text
        this.closePopup(overlay, popupText, yesButton, noButton);
      });
  
    // Create 'No' button
    const noButton = this.add.text(
      centerX + 50,
      centerY + 30,
      "No",
      { font: "18px Arial", color: "#ff0000", backgroundColor: "#000000", padding: { x: 10, y: 5 } }
    )
      .setInteractive()
      .on("pointerdown", () => {
        this.closePopup(overlay, popupText, yesButton, noButton);
      });
  }
  

  closePopup(overlay, popupText, yesButton, noButton) {
    // Remove popup elements
    overlay.destroy();
    popupText.destroy();
    yesButton.destroy();
    noButton.destroy();

    // Resume the game
    this.physics.resume();
  }
    
  update() {
    this.player.update(this.cursors, this);
  }
}
