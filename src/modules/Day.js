

function newDay(scene) {
    // Save the current state before progressing
    console.log("Starting a new day...");
    saveState(scene, "progressDay", { day: scene.day });

    // Increment the day
    scene.day++;
    console.log("Incremented day:", scene.day);
    localStorage.setItem("day", scene.day);

    // Save grid state to localStorage
    const gridState = scene.plantGrid.getGrid();
    console.log("Grid state before saving to localStorage:", gridState);
    localStorage.setItem("gridState", JSON.stringify(gridState));

    // Update plant requirements and display the day
    scene.checkPlantReq();
    showDay(scene);
}

function showDay(scene) {
    if (scene.dayText) {
      scene.dayText.setText(`Day: ${scene.day}`);
    } else {
      // Create the day text for the first time
      scene.dayText = scene.add
        .text(10, 10, `Day: ${scene.day}`, {
          font: "18px Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 5, y: 5 },
        })
        .setScrollFactor(0) // Fix the text to the camera view
        .setDepth(200);
    }
  }
