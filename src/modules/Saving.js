
function loadGameSlot(scene, slot) {
    console.log(`Loading game from slot ${slot}...`);
    const savedData = localStorage.getItem(`gameStateSlot${slot}`);
    console.log("Retrieved saved data:", savedData);

    if (savedData) {
        const { day, plants } = JSON.parse(savedData);

        console.log("Day restored:", day);
        scene.day = day || 1;
        scene.showDay();

        if (!scene.plantGrid) {
            const gridWidth = 10; // Adjust to your grid size
            const gridHeight = 10;
            scene.plantGrid = new PlantGrid(gridWidth, gridHeight);
            console.log("Initialized a new PlantGrid.");
        }

        if (!scene.plants) {
            scene.plants = scene.add.group();
            console.log("Initialized `this.plants` group.");
        } else {
            scene.plants.clear(true, true);
        }

        if (plants && Array.isArray(plants)) {
            console.log("Restoring plants from save data...");
            plants.forEach((plantData, index) => {
                if (plantData) {
                    console.log(`Restoring plant ${index}:`, plantData);
                    const plant = new Plant(scene, plantData.x, plantData.y, "plant");
                    Object.assign(plant, plantData);

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
                        plant.showPlantInfoPopup(scene);
                    });

                    scene.plants.add(plant);
                    scene.plantGrid.setPlant(plantData.x, plantData.y, plant);
                } else {
                    console.warn(`Missing plant data at index ${index}`);
                }
            });

            console.log("PlantGrid updated:", scene.plantGrid.getGrid());
        }
    } else {
        console.log(`No saved data found for slot ${slot}. Starting a new game.`);
        startNewGameState(scene, slot);
    }
} 

function startNewGameState(scene, slot) {
    // Reset the game to a new state
    scene.day = 1;
    scene.showDay();
  
    if (scene.plants) {
      scene.plants.clear(true, true); // Clear all plants
    } else {
      scene.plants = scene.add.group();
    }
  
    if (!scene.plantGrid) {
      const gridWidth = 10;
      const gridHeight = 10;
      scene.plantGrid = new PlantGrid(gridWidth, gridHeight); // Initialize plant grid
    }
    scene.plantGrid.setGrid([]); // Reset the plant grid
  
    // Save the initial state to the selected slot
    saveGameSlot(scene, slot);
  }
  


function saveGameSlot(scene, slot) {
    console.log(`Saving game to slot ${slot}...`);
  
    const gameState = {
        day: scene.day,
        plants: scene.plantGrid.getGrid().map((plant, index) => {
            if (plant) {
                console.log(`Saving plant at grid index ${index}:`, plant);
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
  
    localStorage.setItem(`gameStateSlot${slot}`, JSON.stringify(gameState));
    console.log(`Game saved to slot ${slot}:`, gameState);
  }






function saveGame(scene) {
    const gameState = {
      day: scene.day,
      plants: scene.plants.getChildren().map((plant) => ({
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

function saveState(scene, actionType, payload) {
    const state = {
        actionType,   // Type of action (e.g., "plant", "water", "progressDay")
        payload,      // Action-specific payload (e.g., plant details)
        day: scene.day, // Current day
        plants: scene.plants.getChildren().map((plant) => ({
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
    scene.undoStack.push(state);
    scene.redoStack = []; // Clear redo stack on new action
  }

function loadState(scene, state) {
    console.log("Loading State:", state);
  
    // Update the day
    scene.day = state.day;
    scene.showDay(); // Update day text
  
    // Restore plants
    scene.plants.clear(true, true); // Remove all current plants
    if (state.plants && Array.isArray(state.plants)) {
        state.plants.forEach((plantData) => {
            const plant = new Plant(scene, plantData.x, plantData.y, "plant");
            plant.setPlantTypes(scene.availablePlants);
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
                plant.showPlantInfoPopup(scene);
            });
  
            scene.plants.add(plant);
        });
    } else {
        console.error("No plants data found in state.");
    }
    console.log("State Loaded: Day and Plants Restored");
  }

function restartGameData(){
    localStorage.clear();
  }