
function   undoAction(scene) {
    console.log("Undo Action Triggered");
    if (scene.undoStack.length > 0) {
        const lastState = scene.undoStack.pop();
        scene.redoStack.push(lastState);

        switch (lastState.actionType) {
            case "plant":
                console.log("Undoing Plant Action");
                const lastPlant = scene.plants.getChildren().find(
                    (plant) =>
                        plant.x === lastState.payload.x &&
                        plant.y === lastState.payload.y
                );
                if (lastPlant) lastPlant.destroy();
                break;

            case "water":
                console.log("Undoing Water Action");
                const wateredPlant = scene.plants.getChildren().find(
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
                    scene,
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
                    restoredPlant.showPlantInfoPopup(scene);
                });

                scene.plants.add(restoredPlant);
                console.log(
                    `Plant restored at (${restoredPlant.x}, ${restoredPlant.y}) with type ${restoredPlant.plantType} and level ${restoredPlant.level}`
                );
                break;

            case "progressDay":
                console.log("Undoing Day Progression");
                // Restore the previous day value
                scene.day = lastState.day;
                scene.showDay();

                // Restore plant states to the saved state
                scene.loadState(lastState);
                break;

            default:
                console.log("Unknown Action Type");
        }
    } else {
        console.log("Undo Stack is Empty");
    }
}


function redoAction(scene){
    console.log("Redo Action Triggered");
  if (scene.redoStack.length > 0) {
      const nextState = scene.redoStack.pop();
      scene.undoStack.push(nextState);

      switch (nextState.actionType) {
        case "plant":
          console.log("Redoing Plant Action");

          const plantData = nextState.payload;

          // Create a new plant at the saved position
          const redonePlant = new Plant(
              scene,
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
              redonePlant.showPlantInfoPopup(scene);
          });

          scene.plants.add(redonePlant);
          break;

          case "water":
              console.log("Redoing Water Action");
              const plantToWater = scene.plants.getChildren().find(
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
              const plantToRemove = scene.plants.getChildren().find(
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
              scene.day = nextState.payload.day + 1;
              scene.showDay(); // Update day display

              // Apply day progression logic to plants
              scene.checkPlantReq(); // Update plant states based on new day
              break;

          default:
              console.log("Unknown Action Type");
      }
  } else {
      console.log("Redo Stack is Empty");
  }
}