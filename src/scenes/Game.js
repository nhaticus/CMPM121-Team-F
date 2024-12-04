class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.plantGrid = null;
    this.undoStack = [];
    this.redoStack = [];
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

    /* player */
    this.player = new Player(this, 500, 500, "player", 0);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    /* collisions */
    this.waterLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.waterLayer);

    this.houseLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.houseLayer);

    this.decorLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.player, this.decorLayer);

    console.log("Not empty!");
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
    this.day = parseInt(localStorage.getItem("day")) || 1;
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

    /* undo & redo buttons */
    // Add Undo Button
    const undoButton = this.add
    .image(this.cameras.main.width - 100, 50, 'UndoButton')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setInteractive()
    .setDisplaySize(32, 32)
    .on('pointerdown', () => {
        this.undoAction(); // Link to undoAction
    });

    // Add Redo Button
    const redoButton = this.add
    .image(this.cameras.main.width - 50, 50, 'RedoButton')
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setInteractive()
    .setDisplaySize(32, 32)
    .on('pointerdown', () => {
        this.redoAction(); // Link to redoAction
    });

    const restartButton = this.add
      .image(this.cameras.main.width - 450, 270, "RestartButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(32, 32)
      .on("pointerdown", () => {
        console.log("Restart Button clicked");
        this.restartGameData();
      });

    /* Initialize PlantGrid */
    const gridWidth = 10;
    const gridHeight = 10;
    this.plantGrid = new PlantGrid(gridWidth, gridHeight);
  }

  saveState(actionType, payload) {
    const state = {
        actionType,
        payload,
        day: this.day,
        plants: this.plants.getChildren().map((plant) => ({
            x: plant.x,
            y: plant.y,
            days: plant.days,
            water: plant.water,
            sun: plant.sun,
            level: plant.level,
        })),
    };
    this.undoStack.push(state);
    this.redoStack = []; // Clear redo stack after a new action
}

// Undo an action
undoAction() {
    if (this.undoStack.length > 0) {
        const lastState = this.undoStack.pop();
        this.redoStack.push(lastState);

        switch (lastState.actionType) {
            case "plant":
                const plantToRemove = this.plants.getChildren().find(
                    (p) => p.x === lastState.payload.x && p.y === lastState.payload.y
                );
                if (plantToRemove) {
                    plantToRemove.destroy();
                }
                break;
            case "water":
                const plantToUnwater = this.plants.getChildren().find(
                    (p) => p.x === lastState.payload.x && p.y === lastState.payload.y
                );
                if (plantToUnwater) {
                    plantToUnwater.water = lastState.payload.previousWater;
                }
                break;
            case "harvest":
                const restoredPlantData = lastState.payload.harvestedPlant;
                const restoredPlant = new Plant(
                    this,
                    restoredPlantData.x,
                    restoredPlantData.y,
                    "plant"
                );
                restoredPlant.days = restoredPlantData.days;
                restoredPlant.water = restoredPlantData.water;
                restoredPlant.sun = restoredPlantData.sun;
                restoredPlant.level = restoredPlantData.level;
                restoredPlant.setInteractive().on("pointerdown", () => {
                    restoredPlant.showPlantInfoPopup(this);
                });
                this.plants.add(restoredPlant);
                break;
            case "progressDay":
                this.day = lastState.day;
                this.showDay();
                break;
        }
    }
}

// Redo an action
redoAction() {
    if (this.redoStack.length > 0) {
        const nextState = this.redoStack.pop();
        this.undoStack.push(nextState);

        switch (nextState.actionType) {
            case "plant":
                const replanted = new Plant(
                    this,
                    nextState.payload.x,
                    nextState.payload.y,
                    "plant"
                );
                replanted.setInteractive().on("pointerdown", () => {
                    replanted.showPlantInfoPopup(this);
                });
                this.plants.add(replanted);
                break;
            case "water":
                const plantToRewater = this.plants.getChildren().find(
                    (p) => p.x === nextState.payload.x && p.y === nextState.payload.y
                );
                if (plantToRewater) {
                    plantToRewater.water = nextState.payload.newWater;
                }
                break;
            case "harvest":
                const harvestedPlant = this.plants.getChildren().find(
                    (p) => p.x === nextState.payload.x && p.y === nextState.payload.y
                );
                if (harvestedPlant) {
                    harvestedPlant.destroy();
                }
                break;
            case "progressDay":
                this.day++;
                this.showDay();
                break;
        }
    }
}

  restartGameData() {
    localStorage.setItem("day", null);
    localStorage.setItem("plants", null);
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
      .setOrigin(0.5)
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
      .setOrigin(0.5)
      .on("pointerdown", () => {
        this.closePopup(overlay, popupText, yesButton, noButton);
      });
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }

  newDay() {
    this.saveState("progressDay");
    this.day++;
    localStorage.setItem("day", this.day);
    localStorage.setItem("plants", this.plants);
    this.checkPlantReq();
    console.log("Day After Increment:", this.day);
    this.showDay();
  }
  waterPlant(plant) {
    // Save the watering action
    this.saveState("water", {
        x: plant.x,
        y: plant.y,
        previousWater: plant.water,
        newWater: Math.min(plant.water + 25, 100),
    });

    if (plant.water >= 75) {
        plant.water = 100;
    } else {
        plant.water += 25;
    }
    console.log("Plant watered", plant.water);
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
        const tile = this.tiledGroundLayer.getTileAtWorldXY(tileX, tileY);

        // console.log(`Checking tile at (${tileX}, ${tileY})`);

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
      const plantTile = this.tiledGroundLayer.getTileAtWorldXY(
        plant.x,
        plant.y
      );

      return (
        plantTile &&
        plantTile.x === currentTile.x &&
        plantTile.y === currentTile.y
      );
    });
  }

  harvestPlant(plant) {
    // Save the state before destroying the plant
    this.saveState("harvest", {
        x: plant.x,
        y: plant.y,
        harvestedPlant: {
            x: plant.x,
            y: plant.y,
            days: plant.days,
            water: plant.water,
            sun: plant.sun,
            level: plant.level,
        },
    });

    // Destroy the plant
    plant.destroy();

    console.log(`Plant at (${plant.x}, ${plant.y}) harvested.`);
}

  
  farmingUpdate() {
    const tile = this.tiledGroundLayer.getTileAtWorldXY(
      this.player.x,
      this.player.y
    );

    if (
      tile &&
      Phaser.Input.Keyboard.JustDown(
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      )
    ) {
      if (this.plantCheck(tile)) {
        return;
      }
      console.log(tile.x, tile.y);
      this.addPlant(tile.getCenterX(), tile.getCenterY(), "plant");
    }
  }

  addPlant(x, y, texture) {
    const plant = new Plant(this, x, y, texture);
    plant.setInteractive().on("pointerdown", () => {
      plant.showPlantInfoPopup(this);
    });

    this.plantGrid.setPlant(x, y, plant);
    this.plants.add(plant);

    console.log(x, y);
    this.plantGrid.debug();
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

  update() {
    this.player.update(this.cursors, this);

    this.farmingUpdate();
  }
}
