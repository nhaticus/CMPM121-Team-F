class Game extends Phaser.Scene {
  constructor() {
    super("gameScene");
    this.undoStack = [];
    this.redoStack = [];
    this.plantGrid = null;
    this.availablePlants = [];
    this.harvestedPlantTypes = new Set(); // Track harvested plant types
    this.activeSaveSlot = 1; 
    this.dayManager = new Day(); 
    this.saveManager = new Saving();
    this.popupManager = null;  
  }

  create() {
    testFunction();
    console.log(testVar);
    
    /* Language */
    setLanguage("en");

    // Initialize the game based on the active save slot
    this.loadGameSlot(this.activeSaveSlot);
    this.popupManager = new Popup(this);


    /* Initialize Map & Player */
    initializeGame(this);


    /* PlantGrid */
    const gridWidth = 10;
    const gridHeight = 10;

    /* Local Storage */
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
    
    /*  Camera  */
    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    /*  Controls  */
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.on("pointerdown", (pointer) => {
      // Get the tile at the clicked position in the house layer
      const tile = this.layers["houseLayer"].getTileAtWorldXY(
        pointer.worldX,
        pointer.worldY
      );
      if (tile) {
        //console.log("Clicked on the house layer! Tile index:", tile.index); // Debug: See which tile was clicked

        this.popupManager.showSleepingPopup(); // Delegate to Popup.js

      } else {
        //console.log("No tile found on the house layer at clicked position.");
      }
    });

    /* Day */
    this.dayManager = new Day();
    this.dayManager.loadDay(); 
    this.showDay();

    /*  House */
    this.houseLayer.setTileIndexCallback(10, this.showPopup, this);
    inventorySetup(this);

    /*  Buttons  */
    Buttons.create(this);

    /*  Plants  */

    this.createPlant("wheat", 1, ['sun', 'water', 'neighbor']);
    this.createPlant("plum", 7, ["sun", 'neighbor']);
    this.createPlant("tomato", 13, ["water"]);
  
    /* Popups */
    this.popupManager = new Popup(this); // Initialize Popup manager
  }


  /* Save/Load  */
  loadGameSlot(slot) {
    const savedData = this.saveManager.loadGame(slot);
  
    if (savedData) {
      const { day, plants } = savedData;
      this.dayManager.day = day || 1; // Restore day
      this.showDay();
  
      this.plants.clear(true, true);
      plants.forEach((plantData) => {
        if (plantData) {
          const plant = Plant.createFromData(this, plantData);
          this.plants.add(plant);
          this.plantGrid.addPlant(plantData.x, plantData.y, plant);
        }
      });
    } else {
      this.startNewGameState(slot);
    }
  }
  
saveGameSlot(slot) {
  const gameState = {
    day: this.dayManager.getCurrentDay(),
    plants: this.plantGrid.getGrid().map((plant) => {
      if (plant) {
        return {
          x: plant.x,
          y: plant.y,
          days: plant.days,
          water: plant.water,
          sun: plant.sun,
          level: plant.level,
          plantType: plant.plantType,
        };
      }
      return null;
    }),
  };

  this.saveManager.saveGame(slot, gameState);
}

quickSaveGame() {
  const gameState = {
    day: this.dayManager.getCurrentDay(),
    plants: this.plants.getChildren().map((plant) => ({
      x: plant.x,
      y: plant.y,
      days: plant.days,
      water: plant.water,
      sun: plant.sun,
      level: plant.level,
      plantType: plant.plantType,
    })),
  };
  this.saveManager.quickSave(gameState);
}

saveGame() {
  const gameState = {
    day: this.dayManager.getCurrentDay(),
    plants: this.plants.getChildren().map((plant) => ({
      x: plant.x,
      y: plant.y,
      days: plant.days,
      water: plant.water,
      sun: plant.sun,
      level: plant.level,
      plantType: plant.plantType,
    })),
  };

  this.saveManager.saveGame(this.activeSaveSlot, gameState); // Delegate to Saving.js
  console.log("Game saved:", gameState);
}

saveState(actionType, payload) {
  const state = {
      actionType,   // Type of action (e.g., "plant", "water", "progressDay")
      payload,      // Action-specific payload (e.g., plant details)
      day: this.day, // Current day
      plants: this.plants.getChildren().map((plant) => ({
        x: plant.x,
        y: plant.y,
        level: plant.level,
        plantType: plant.plantType,
        days: plant.days,
        water: plant.water,
        sun: plant.sun,
    })),
    };

  // If action involves plants, save plant-specific data
  if (actionType === "plant") {
      state.payload = {
          x: payload.x,
          y: payload.y,
          level: payload.level,
          days: payload.days,
          water: payload.water,
          sun: payload.sun,
          plantType: payload.plantType, // Save plantType explicitly
      };
  }

  console.log("Saving State:", JSON.stringify(state, null, 2)); // Debug log
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
  if (state.plants && Array.isArray(state.plants)) {
      state.plants.forEach((plantData) => {
          const plant = new Plant(this, plantData.x, plantData.y, "plant");
          plant.setPlantTypes(this.availablePlants);
          Object.assign(plant, plantData); // Restore plant properties
          
          // Set the correct sprite frame based on type and level
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
              default:
                  console.error(`Unknown plant type: ${plant.plantType}`);
          }

          // Reapply interactivity
          plant.setInteractive().on("pointerdown", () => {
              plant.showPlantInfoPopup(this);
          });

          this.plants.add(plant);
      });
  } else {
      console.error("No plants data found in state.");
  }
  console.log("State Loaded: Day and Plants Restored");
}

  /* Popups */
  showQuitPopup() {
    this.popupManager.showSaveSlotPopup();
}

closePopup(...elements) {
  // Destroy all elements passed to the function
  elements.forEach((element) => element.destroy());
  this.physics.resume(); // Resume the game after closing the popup
} 

showCompletionPopup() {
  this.popupManager.showHarvestedAllPopup();
}

closePopup(...elements) {
  this.popupManager.closePopup(...elements);
}
  
showPopup() {
  this.popupManager.showSleepingPopup();
}

closePopup(...elements) {
  elements.forEach((element) => element.destroy());
  this.physics.resume();
}

/* Start/Quit/Restart */
  startNewGameState(slot) {
    const defaultState = {
      day: 1,
      plants: [],
    };
  
    this.saveManager.startNewGame(slot, defaultState);
  
    this.dayManager.day = defaultState.day;
    this.showDay();
  
    this.plants.clear(true, true);
    this.plantGrid.clearGrid();
  }

quitGame() {
  console.log("Game exited");
  // Logic to quit the game (e.g., redirect to the main menu or close the app)
}
restartGameData() {
  this.saveManager.restartGameData(); 
  console.log("Game data has been reset.");
}

/* Undo/Redo */
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
                        plant.x === lastState.payload.x &&
                        plant.y === lastState.payload.y
                );
                if (lastPlant) lastPlant.destroy();
                break;

            case "water":
                console.log("Undoing Water Action");
                const wateredPlant = this.plants.getChildren().find(
                    (plant) =>
                        plant.x === lastState.payload.x &&
                        plant.y === lastState.payload.y
                );
                if (wateredPlant) {
                    wateredPlant.water = lastState.payload.previousWater; // Revert water level
                }
                break;

            case "harvest":
                console.log("Undoing Harvest Action");
                const harvestedPlant = lastState.payload.harvestedPlant;

                // Restore the harvested plant
                const restoredPlant = new Plant(
                    this,
                    harvestedPlant.x,
                    harvestedPlant.y,
                    "plant"
                );

                // Restore all plant properties
                restoredPlant.plantType = harvestedPlant.plantType;
                restoredPlant.days = harvestedPlant.days;
                restoredPlant.water = harvestedPlant.water;
                restoredPlant.sun = harvestedPlant.sun;
                restoredPlant.level = harvestedPlant.level;

                // Set the correct sprite frame based on plant type and level
                switch (restoredPlant.plantType) {
                    case "wheat":
                        restoredPlant.setFrame(1 + restoredPlant.level);
                        break;
                    case "plum":
                        restoredPlant.setFrame(7 + restoredPlant.level);
                        break;
                    case "tomato":
                        restoredPlant.setFrame(13 + restoredPlant.level);
                        break;
                    default:
                        console.error(
                            `Unknown plant type during undo: ${restoredPlant.plantType}`
                        );
                }

                // Reattach interactivity
                restoredPlant.setInteractive().on("pointerdown", () => {
                    restoredPlant.showPlantInfoPopup(this);
                });

                this.plants.add(restoredPlant);
                console.log(
                    `Plant restored at (${restoredPlant.x}, ${restoredPlant.y}) with type ${restoredPlant.plantType} and level ${restoredPlant.level}`
                );
                break;

            case "progressDay":
                console.log("Undoing Day Progression");
                // Restore the previous day value
                this.day = lastState.day;
                this.showDay();

                // Restore plant states to the saved state
                this.loadState(lastState);
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

          const plantData = nextState.payload;

          // Create a new plant at the saved position
          const redonePlant = new Plant(
              this,
              plantData.x,
              plantData.y,
              "plant"
          );

          // Restore all plant properties
          Object.assign(redonePlant, {
              level: plantData.level,
              days: plantData.days,
              water: plantData.water,
              sun: plantData.sun,
              plantType: plantData.plantType,
          });

          console.log("Plant restored during redo:", plantData);

          // Set the correct sprite frame based on type and level
          switch (redonePlant.plantType) {
              case "wheat":
                  redonePlant.setFrame(1 + redonePlant.level); // Adjust frame for wheat
                  break;
              case "plum":
                  redonePlant.setFrame(7 + redonePlant.level); // Adjust frame for plum
                  break;
              case "tomato":
                  redonePlant.setFrame(13 + redonePlant.level); // Adjust frame for tomato
                  break;
              default:
                  console.error("Unknown plant type for frame restoration:", redonePlant.plantType);
          }

          // Reattach interactivity
          redonePlant.setInteractive().on("pointerdown", () => {
              redonePlant.showPlantInfoPopup(this);
          });

          this.plants.add(redonePlant);
          break;

          case "water":
              console.log("Redoing Water Action");
              const plantToWater = this.plants.getChildren().find(
                  (plant) =>
                      plant.x === nextState.payload.x &&
                      plant.y === nextState.payload.y
              );
              if (plantToWater) {
                  plantToWater.water = nextState.payload.newWater; // Apply water level
              }
              break;

          case "harvest":
              console.log("Redoing Harvest Action");
              const harvestedPlant = nextState.payload.harvestedPlant;

              // Find and remove the plant again
              const plantToRemove = this.plants.getChildren().find(
                  (p) => p.x === harvestedPlant.x && p.y === harvestedPlant.y
              );

              if (plantToRemove) {
                  plantToRemove.destroy();
                  console.log(
                      `Plant at (${harvestedPlant.x}, ${harvestedPlant.y}) harvested again.`
                  );
              } else {
                  console.error(
                      `Redo failed: No plant found at (${harvestedPlant.x}, ${harvestedPlant.y})`
                  );
              }
              break;

          case "progressDay":
              console.log("Redoing Day Progression");

              // Increment the day count
              this.day = nextState.payload.day + 1;
              this.showDay(); // Update day display

              // Apply day progression logic to plants
              this.checkPlantReq(); // Update plant states based on new day
              break;

          default:
              console.log("Unknown Action Type");
      }
  } else {
      console.log("Redo Stack is Empty");
  }
}

  onPressed(content) {
    console.log(content);
  }
/* Planting */
  harvestPlant(plant) {
    if (plant) {
      const harvested = plant.harvest(); // Use the `harvest()` method from Plant.js
      if (harvested) {
        console.log(`Harvested:`, harvested);
      }
    } else {
      console.log("No plant found to harvest.");
    }
  }
  
  createPlant(type, frame, reqs){
    const newPlant = [type, frame, reqs];
    this.availablePlants.push(newPlant);
    console.log(this.availablePlants);
  }

  checkPlantReq() {
    this.plants.getChildren().forEach((plant) => {
      const neighbors = this.plantGrid.getNeighbors(plant.x, plant.y).length;
      plant.newDay(neighbors); // Pass neighbor count to the plant
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

  addPlant(x, y, texture, level = 0) {
    const plantData = { x, y, level, water: 0, sun: 0, plantType: null, frameIndex: 0 };
    const plant = Plant.createFromData(this, plantData);
  
    plant.setPlantTypes(this.availablePlants);
    plant.setInteractive().on("pointerdown", () => {
      plant.showPlantInfoPopup(this);
    });
  
    this.plants.add(plant); // Add to Phaser group
    this.plantGrid.addPlant(x, y, plant); // Add to grid using PlantGrid
    this.saveGameSlot(this.activeSaveSlot); // Save game state
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
    if (plant) {
      plant.water(); // Use the `water()` method from Plant.js
    } else {
      console.log("No plant found to water.");
    }
  }

/* Day */
  showDay() {
    if (this.dayText) {
      this.dayText.setText(`Day: ${this.dayManager.getCurrentDay()}`);
    } else {
      this.dayText = this.add
        .text(10, 10, `Day: ${this.dayManager.getCurrentDay()}`, {
          font: "18px Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 5, y: 5 },
        })
        .setScrollFactor(0)
        .setDepth(200);
    }
  }

  newDay() {
    console.log("Starting a new day...");
    this.saveState("progressDay", { day: this.dayManager.getCurrentDay() });
  
    // Increment and save the day
    this.dayManager.incrementDay();
    this.dayManager.saveDay();
  
    // Save grid state
    const gridState = this.plantGrid.getGrid();
    console.log("Grid state before saving to localStorage:", gridState);
    localStorage.setItem("gridState", JSON.stringify(gridState));
  
    // Update plant requirements and display the new day
    this.checkPlantReq();
    this.showDay();
  }


/* Update */
  farmingUpdate() {
    const tile = this.layers["tiledGroundLayer"].getTileAtWorldXY(
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


  update() {
    this.player.update(this.cursors, this);
    this.farmingUpdate();
  }
}
