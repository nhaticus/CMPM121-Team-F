class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.undoStack = [];
    this.redoStack = [];
    this.plantGrid = null;
    this.availablePlants = [];
    this.harvestedPlantTypes = new Set(); // Track harvested plant types
    this.activeSaveSlot = 1; // Default to Slot 1
  }

  create() {
    setLanguage("en");

    // Initialize the game based on the active save slot
    loadGameSlot(this, this.activeSaveSlot);

    /* Initialize Map & Player */
    initializeGame(this);

    /* Initialize PlantGrid */
    const gridWidth = 10;
    const gridHeight = 10;

    if (localStorage) {
      console.log("there is local storage!");
      const savedGrid = localStorage.getItem("gridState");
      console.log(savedGrid);
      if (savedGrid) {
        console.log("SAVED GRID");
        this.plantGrid = new PlantGrid(gridWidth, gridHeight);
        this.plantGrid.setGrid(JSON.parse(savedGrid));
      } else {
        console.log("making new grid");
        this.plantGrid = new PlantGrid(gridWidth, gridHeight);
      }
    }

    /*  camera  */
    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    /*  controls  */
    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.on("pointerdown", (pointer) => {
      // Get the tile at the clicked position in the house layer
      const tile = this.layers["houseLayer"].getTileAtWorldXY(pointer.worldX, pointer.worldY);

      if (tile) {
        //console.log("Clicked on the house layer! Tile index:", tile.index); // Debug: See which tile was clicked
        showPopup(this); // Show popup for any tile in the house layer
      } else {
        //console.log("No tile found on the house layer at clicked position.");
      }
    });

    /* day */
    this.day = parseInt(localStorage.getItem("day")) || 1;
    showDay(this);

    /*  house */
    this.layers["houseLayer"].setTileIndexCallback(10, showPopup, this);
    inventorySetup(this);

    /* undo & redo buttons */
    const undoButton = this.add
      .image(this.cameras.main.width - 100, 50, "UndoButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(32, 32)
      .on("pointerdown", () => {
        undoAction(this); // Link to undoAction
      });

    // Add Redo Button
    const redoButton = this.add
      .image(this.cameras.main.width - 50, 50, "RedoButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(32, 32)
      .on("pointerdown", () => {
        redoAction(this); // Link to redoAction
      });

    const restartButton = this.add
      .image(this.cameras.main.width - 450, 270, "RestartButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(32, 32)
      .on("pointerdown", () => {
        restartGameData();
      });

    // Add Save Button
    const saveButton = this.add
      .image(
        this.cameras.main.width - 50, // X position: near the right edge
        this.cameras.main.height - 50, // Y position: near the bottom edge
        "SaveButton" // The key for the save.png image (make sure to preload this key in your Load.js or preload method)
      )
      .setOrigin(0.5)
      .setScrollFactor(0) // Ensures it stays fixed on the screen
      .setInteractive() // Makes the image clickable
      .setDisplaySize(64, 32) // Adjust size as needed
      .on("pointerdown", () => {
        saveGame(this); // Add functionality to save the game
      });

    /* quit button  */
    const quitButton = this.add
      .image(this.cameras.main.width - 50, this.cameras.main.height - 20, "PauseButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(24, 24)
      .on("pointerdown", () => {
        showQuitPopup(this);
        saveGameSlot(this, this.activeSaveSlot); // Save to active slot
      });

    //create plants with different requirements (Must have frame in order in spritesheets);
    this.createPlant("wheat", 1, ["sun", "water", "neighbor"]);
    this.createPlant("plum", 7, ["sun", "neighbor"]);
    this.createPlant("tomato", 13, ["water"]);
  }

  // Quit Game
  quitGame() {
    console.log("Game exited");
    // Logic to quit the game (e.g., redirect to the main menu or close the app)
  }

  harvestPlant(plant) {
    console.log(`Attempting to harvest plant with type: ${plant.plantType}`);

    // Save the state before destroying the plant
    saveState(this, "harvest", {
      x: plant.x,
      y: plant.y,
      harvestedPlant: {
        x: plant.x,
        y: plant.y,
        plantType: plant.plantType, // Save the type
        days: plant.days,
        water: plant.water,
        sun: plant.sun,
        level: plant.level, // Save the level explicitly
      },
    });
    // Add plant type to harvested set
    this.harvestedPlantTypes.add(plant.plantType);
    console.log("Harvested Plant Types:", Array.from(this.harvestedPlantTypes));

    // Check if all plant types have been harvested
    const allPlantTypes = ["wheat", "plum", "tomato"]; // Define all possible plant types
    if (allPlantTypes.every((type) => this.harvestedPlantTypes.has(type))) {
      showCompletionPopup(this);
    }
    plant.destroy();
    console.log(`${plant.plantType} at (${plant.x}, ${plant.y}) harvested.`);
  }

  onPressed(content) {
    console.log(content);
  }

  createPlant(type, frame, reqs) {
    const newPlant = [type, frame, reqs];
    this.availablePlants.push(newPlant);
    console.log(this.availablePlants);
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
        const tileX = plant.x + offset.x * 16;
        const tileY = plant.y + offset.y * 16;
        const tile = this.layers["tiledGroundLayer"].getTileAtWorldXY(tileX, tileY);

        if (tile) {
          // console.log(`Tile found at (${tileX}, ${tileY})`);
          if (this.plantCheck(tile)) {
            surroundingPlants++;
          }
        }
      });

      /* calls a function that will check if the surrounding plants matches with required plants */
      plant.newDay(surroundingPlants);
    });
  }

  plantCheck(currentTile) {
    return this.plants.getChildren().some((plant) => {
      const plantTile = this.layers["tiledGroundLayer"].getTileAtWorldXY(plant.x, plant.y);

      return plantTile && plantTile.x === currentTile.x && plantTile.y === currentTile.y;
    });
  }

  farmingUpdate() {
    const tile = this.layers["tiledGroundLayer"].getTileAtWorldXY(this.player.x, this.player.y);

    if (tile) {
      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E))) {
        // Fully grown plant (level 3)
        if (!this.plantCheck(tile)) {
          this.addPlant(tile.getCenterX(), tile.getCenterY(), "plant", 3);
        }
      }

      if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE))) {
        // Freshly planted seed (level 0)
        if (!this.plantCheck(tile)) {
          this.addPlant(tile.getCenterX(), tile.getCenterY(), "plant", 0);
        }
      }
    }
  }

  addPlant(x, y, texture, level = 0) {
    const plant = new Plant(this, x, y, texture);

    plant.setPlantTypes(this.availablePlants);
    plant.level = level;
    plant.days = 0;
    plant.water = 0;
    plant.sun = 0;

    switch (plant.plantType) {
      case "wheat":
        plant.setFrame(1 + plant.level);
        break;
      case "plum":
        plant.setFrame(7 + plant.level);
        break;
      case "tomato":
        plant.setFrame(13 + plant.level);
        break;
    }
    plant.setInteractive().on("pointerdown", () => {
      plant.showPlantInfoPopup(this);
    });

    // Add plant to the group and grid
    this.plants.add(plant);
    this.plantGrid.setPlant(x, y, plant);

    // Save game after adding a plant
    saveGameSlot(this, this.activeSaveSlot);

    return plant;
  }

  getPlant(x, y) {
    return this.plantGrid.getPlant(x, y);
  }

  growPlant(x, y) {
    const plant = this.getPlant(x, y);
    if (plant) {
      plant.grow();
    }
  }
  waterPlant(plant) {
    const randomWaterIncrease = Phaser.Math.Between(20, 100);

    // Save the watering action
    saveState(this, "water", {
      x: plant.x,
      y: plant.y,
      previousWater: plant.water,
      newWater: Math.min(plant.water + randomWaterIncrease, 100),
    });

    plant.water = Math.min(plant.water + randomWaterIncrease, 100);
    console.log(`Plant watered: ${plant.water} (+${randomWaterIncrease})`);
  }

  update() {
    this.player.update(this.cursors, this);

    this.farmingUpdate();
  }
}
