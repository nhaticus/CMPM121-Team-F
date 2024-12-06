class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.undoStack = [];
    this.redoStack = [];
    this.plantGrid = null;
    this.harvestedPlantTypes = new Set(); // Track harvested plant types
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

    
    /* Initialize PlantGrid */
    const gridWidth = 10;
    const gridHeight = 10;

    if(localStorage){
      console.log("there is local storage!");
      const savedGrid = localStorage.getItem("gridState");
      console.log(savedGrid);
      if(savedGrid){
        console.log("SAVED GRID");
        this.plantGrid = new PlantGrid(gridWidth, gridHeight);
        this.plantGrid.setGrid(JSON.parse(savedGrid));
      }  
      else{
        console.log("making new grid");
        this.plantGrid = new PlantGrid(gridWidth, gridHeight);
    }
    }
  

    
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
        this.restartGameData();
      })
  
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
        this.saveGame(); // Add functionality to save the game
      });
  }

  harvestPlant(plant) {
    console.log(`Attempting to harvest plant with type: ${plant.plantType}`); // Debugging log

    // Save the state before destroying the plant
    this.saveState("harvest", {
      x: plant.x,
      y: plant.y,
      harvestedPlant: {
        x: plant.x,
        y: plant.y,
        plantType: plant.plantType, // Save the type
        days: plant.days,
        water: plant.water,
        sun: plant.sun,
        level: plant.level,
      },
    });

    plant.destroy();
    console.log(`Plant at (${plant.x}, ${plant.y}) harvested.`);
  }


  showCompletionPopup() {
    console.log("Popup triggered");
  
    // Pause the game temporarily (remove this line if it causes issues)
    // this.physics.pause();
  
    // Get screen center positions
    const centerX = this.cameras.main.midPoint.x;
    const centerY = this.cameras.main.midPoint.y;
  
    // Create the popup background
    const overlay = this.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(100)
      .setStrokeStyle(2, 0xffffff); // Add a border for visibility
    console.log("Overlay created");
  
    // Add popup text
    const popupText = this.add
      .text(centerX, centerY - 30, "You Harvested Every Type of Plant!", {
        font: "18px Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(101);
    console.log("Popup text created");
  
    // Add the 'Close' button
    const closeButton = this.add
      .text(centerX, centerY + 50, "Close", {
        font: "18px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setDepth(102)
      .on("pointerdown", () => {
        console.log("Close button clicked");
        this.closePopup(overlay, popupText, closeButton);
      });
    console.log("Close button created");
    console.log("Popup displayed");
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }


  saveGame() {
    const gameState = {
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
  
    // Save to localStorage
    localStorage.setItem("gameState", JSON.stringify(gameState));
    console.log("Game saved:", gameState);
  }
  

  undoAction() {
    console.log("Undo Action Triggered");
    if (this.undoStack.length > 0) {
      const lastState = this.undoStack.pop();
      this.redoStack.push(lastState);

      switch (lastState.actionType) {
        case "plant":
          console.log("Undoing Plant Action");
          const lastPlant = this.plants.getChildren().find(
            (plant) =>
              plant.x === lastState.payload.x && plant.y === lastState.payload.y
          );
          if (lastPlant) lastPlant.destroy();
          break;

        case "water":
          console.log("Undoing Water Action");
          const wateredPlant = this.plants.getChildren().find(
            (plant) =>
              plant.x === lastState.payload.x && plant.y === lastState.payload.y
          );
          if (wateredPlant) {
            wateredPlant.water = lastState.payload.previousWater; // Revert water level
          }
          break;

        case "harvest":
          console.log("Undoing Harvest Action");
          const harvestedPlant = lastState.payload.harvestedPlant;
          const restoredPlant = new Plant(
            this,
            harvestedPlant.x,
            harvestedPlant.y,
            "plant"
          );
          Object.assign(restoredPlant, harvestedPlant); // Restore all properties
          this.plants.add(restoredPlant);
          break;

        default:
          console.log("Unknown Action Type");
      }
    } else {
      console.log("Undo Stack is Empty");
    }
  }

  
  redoAction() {
    console.log("Redo Action Triggered");
    if (this.redoStack.length > 0) {
        const nextState = this.redoStack.pop();
        this.undoStack.push(nextState);

        switch (nextState.actionType) {
            case "plant":
                console.log("Redoing Plant Action");
                const plant = new Plant(
                    this,
                    nextState.payload.x,
                    nextState.payload.y,
                    "plant"
                );

                // Restore interactivity
                plant.setInteractive().on("pointerdown", () => {
                    plant.showPlantInfoPopup(this);
                });

                this.plants.add(plant);
                break;

            case "water":
                console.log("Redoing Water Action");
                const plantToWater = this.plants.getChildren().find(
                    (plant) =>
                        plant.x === nextState.payload.x &&
                        plant.y === nextState.payload.y
                );
                if (plantToWater) {
                    plantToWater.water = nextState.payload.newWater; // Apply new water level
                }
                break;

            case "harvest":
                console.log("Redoing Harvest Action");
                const harvestedPlant = nextState.payload.harvestedPlant;
                const restoredPlant = new Plant(
                    this,
                    harvestedPlant.x,
                    harvestedPlant.y,
                    "plant"
                );
                Object.assign(restoredPlant, harvestedPlant);

                // Restore interactivity
                restoredPlant.setInteractive().on("pointerdown", () => {
                    restoredPlant.showPlantInfoPopup(this);
                });

                this.plants.add(restoredPlant);
                break;

            default:
                console.log("Unknown Action Type");
        }
    } else {
        console.log("Redo Stack is Empty");
    }
}





saveState(actionType, payload) {
  const state = {
    actionType, // e.g., "plant", "water", "harvest"
    payload,
    day: this.day,
  };
  console.log("Saving State:", actionType, state); // Debugging
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
    localStorage.setItem('gridState', null);
    localStorage.clear();
  }


  onPressed(content) {

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
    // Save the current state before progressing
    this.saveState("progressDay", { day: this.day });

    // Increment the day
    this.day++;

    // Save Data
    localStorage.setItem("day", this.day);
    console.log(this.plantGrid.getGrid());
    localStorage.setItem("gridState", JSON.stringify(this.plantGrid.getGrid()));


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

    if (tile) {
        if (
            Phaser.Input.Keyboard.JustDown(
                this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
            )
        ) {
            // Fully grown plant (level 3)
            if (!this.plantCheck(tile)) {
                this.addPlant(tile.getCenterX(), tile.getCenterY(), "plant", 3);
            }
        }

        if (
            Phaser.Input.Keyboard.JustDown(
                this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            )
        ) {
            // Freshly planted seed (level 0)
            if (!this.plantCheck(tile)) {
                this.addPlant(tile.getCenterX(), tile.getCenterY(), "plant", 0);
            }
        }
    }
}


addPlant(x, y, texture, level = 0) {
  const plant = new Plant(this, x, y, texture);

  // Set the initial level of the plant
  plant.level = level;

  // Set the correct sprite frame for the level
  plant.setFrame(level * 6 + 1); // Assuming the frame index depends on level

  // Add interactivity and popup logic
  plant.setInteractive().on("pointerdown", () => {
      plant.showPlantInfoPopup(this);
  });

  // Save the planting action
  this.saveState("plant", { x: plant.x, y: plant.y });

  this.plantGrid.setPlant(x, y, plant);
  this.plants.add(plant);

  console.log(this.plantGrid);

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
  this.saveState("water", {
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
