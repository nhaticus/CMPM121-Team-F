class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.undoStack = [];
    this.redoStack = [];
    this.plantGrid = null;
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
    this.day = parseInt(localStorage.getItem('day')) || 1;
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
      .image(this.cameras.main.width -450, 270, "RestartButton")
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setInteractive()
      .setDisplaySize(32, 32)
      .on("pointerdown", () => {
        console.log("Restart Button clicked");
        this.restartGameData();
      })
  }

  undoAction() {
    console.log("Undo Action Triggered");
    if (this.undoStack.length > 0) {
        const lastState = this.undoStack.pop(); // Get the last state
        this.redoStack.push(lastState);        // Save it for redo

        switch (lastState.actionType) {
            case "plant":
                console.log("Undoing Plant Action");
                // Remove the last planted plant
                const lastPlant = this.plants.getChildren().find((plant) => 
                    plant.x === lastState.payload.x && 
                    plant.y === lastState.payload.y
                );
                if (lastPlant) {
                    lastPlant.destroy();
                }
                break;

            case "water":
                console.log("Undoing Water Action");
                // Find and revert the water level of the specific plant
                const wateredPlant = this.plants.getChildren().find((plant) => 
                    plant.x === lastState.payload.x && 
                    plant.y === lastState.payload.y
                );
                if (wateredPlant) {
                    wateredPlant.water = lastState.payload.previousWater;
                }
                break;

            case "harvest":
                console.log("Undoing Harvest Action");
                // Re-add the harvested plant
                const harvestedPlant = lastState.payload.harvestedPlant;
                const restoredPlant = new Plant(this, harvestedPlant.x, harvestedPlant.y, "plant");
                restoredPlant.days = harvestedPlant.days;
                restoredPlant.water = harvestedPlant.water;
                restoredPlant.sun = harvestedPlant.sun;
                restoredPlant.level = harvestedPlant.level;
                this.plants.add(restoredPlant);
                break;

            case "progressDay":
                console.log("Undoing Day Progression");
                this.day = lastState.day; // Revert the day
                this.showDay();          // Update day display
                this.loadState(lastState); // Restore plants
                break;

            default:
                console.log("Unknown Action Type");
        }
        console.log("Undo Stack After Pop:", this.undoStack);
    } else {
        console.log("Undo Stack is Empty");
    }
}

  
redoAction() {
  console.log("Redo Action Triggered");
  if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop(); // Get the next state
      this.undoStack.push(nextState);        // Save it for undo

      switch (nextState.actionType) {
          case "plant":
              console.log("Redoing Plant Action");
              const plant = new Plant(this, nextState.payload.x, nextState.payload.y, "plant");
              plant.setInteractive().on("pointerdown", () => {
                  plant.showPlantInfoPopup(this);
              });
              this.plants.add(plant);
              break;

          case "water":
              console.log("Redoing Water Action");
              const plantToWater = this.plants.getChildren().find((p) =>
                  p.x === nextState.payload.x && p.y === nextState.payload.y
              );
              if (plantToWater) {
                  plantToWater.water = nextState.payload.newWater;
              }
              break;

          case "harvest":
              console.log("Redoing Harvest Action");
              const plantToHarvest = new Plant(this, nextState.payload.x, nextState.payload.y, "plant");
              plantToHarvest.days = nextState.payload.harvestedPlant.days;
              plantToHarvest.water = nextState.payload.harvestedPlant.water;
              plantToHarvest.sun = nextState.payload.harvestedPlant.sun;
              plantToHarvest.level = nextState.payload.harvestedPlant.level;
              plantToHarvest.setInteractive().on("pointerdown", () => {
                  plantToHarvest.showPlantInfoPopup(this);
              });
              this.plants.add(plantToHarvest);
              break;

          case "progressDay":
              console.log("Redoing Day Progression");

              // Restore the saved day value and re-progress
              this.day = nextState.payload.day + 1;
              console.log("Day Redone:", this.day);
              this.showDay(); // Update the day text
              break;

          default:
              console.log("Unknown Action Type");
      }

      console.log("Redo Stack After Pop:", this.redoStack);
  } else {
      console.log("Redo Stack is Empty");
  }
}




saveState(actionType, payload) {
  const state = {
      actionType,   // Type of action (e.g., "plant", "water", "progressDay")
      payload,      // Additional data specific to the action
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
  console.log("Saving State with Action:", actionType, state); // Debug
  this.undoStack.push(state);
  this.redoStack = []; // Clear redo stack on new action
}

loadState(state) {
  console.log("Loading State:", state);

  // Update the day
  this.day = state.day; 
  this.showDay(); // Update day text

  // Restore plants
  this.plants.clear(true, true); // Remove all current plants
  state.plants.forEach((plantData) => {
      const plant = new Plant(this, plantData.x, plantData.y, "plant");
      plant.days = plantData.days;
      plant.water = plantData.water;
      plant.sun = plantData.sun;
      plant.level = plantData.level;
      plant.setFrame(plant.level * 6 + 1); // Set correct sprite frame for plant
      this.plants.add(plant);

      // Reapply interactivity
      plant.setInteractive().on("pointerdown", () => {
          plant.showPlantInfoPopup(this);
      });
  });
  console.log("State Loaded: Day and Plants Restored");
}


  restartGameData(){
    localStorage.setItem('day', null);
    localStorage.setItem('plants', null);
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
    console.log("New Day Triggered");

    // Save the current state before progressing
    this.saveState("progressDay", { day: this.day });

    // Increment the day
    this.day++;
    console.log("Day After Increment:", this.day);

    // Update plant requirements and display the day
    this.checkPlantReq();
    this.showDay();
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

        // Save the planting action
        this.saveState("plant", { x: plant.x, y: plant.y });

        plant.setInteractive().on("pointerdown", () => {
            plant.showPlantInfoPopup(this);
        });
        this.plants.add(plant);
        console.log(this.plants);
    }
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



  update() {
    this.player.update(this.cursors, this);

    this.farmingUpdate();
  }
}
