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
        scene.startNewGameState(slot);
    }
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
  