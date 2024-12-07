function showQuitPopup(scene) {
    // Pause the game
    scene.physics.pause();
  
    // Get the camera's center
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;
  
    // Create a background overlay for the popup
    const overlay = scene.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(100);
  
    // Add popup text
    const popupText = scene.add
      .text(centerX, centerY - 60, t("SAVE_SLOT"), {
        font: "18px Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(101);
  
    // Collect all buttons in an array
    const slotButtons = [];
    const slots = [1, 2, 3];
    slots.forEach((slot, index) => {
      const slotButton = scene.add
        .text(centerX, centerY - 30 + index * 40, ("SAVE") + `${slot}`, {
          font: "16px Arial",
          color: "#ffffff",
          backgroundColor: "#000000",
          padding: { x: 10, y: 5 },
        })
        .setInteractive()
        .setOrigin(0.5)
        .setDepth(102)
        .on("pointerdown", () => {
          scene.activeSaveSlot = slot;
  
          // Check if the slot has saved data
          const savedData = localStorage.getItem(`gameStateSlot${slot}`);
          if (savedData) {
            console.log(`Loading data from slot ${slot}`);
            loadGameSlot(scene, slot); // Load the saved data
          } else {
            console.log(`Starting a new game in slot ${slot}`);
            startNewGameState(scene, slot); // Reset to a new state
          }
  
          closePopup(scene, overlay, popupText, ...slotButtons); // Close the popup and remove buttons
        });
  
      slotButtons.push(slotButton); // Add the button to the array
    });
  }
  
  

function showCompletionPopup(scene) {
    console.log("Popup triggered");
  
    // Pause the game temporarily (remove this line if it causes issues)
    // this.physics.pause();
  
    // Get screen center positions
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;
  
    // Create the popup background
    const overlay = scene.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(100)
      .setStrokeStyle(2, 0xffffff); // Add a border for visibility
    console.log("Overlay created");
  
    // Add popup text
    const popupText = scene.add
      .text(centerX, centerY - 30, t("HARVESTED_ALL"), {
        font: "18px Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(101);
    console.log("Popup text created");
  
    // Add the 'Close' button
    const closeButton = scene.add
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
        closePopup(scene, overlay, popupText, closeButton);
      });
    console.log("Close button created");
    console.log("Popup displayed");
  }

function showPopup(scene, player, tile) {
    // Pause the game
    scene.physics.pause();

    // Get the camera's center
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;

    // Create a background overlay for the popup
    const overlay = scene.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5);
      

    // Add text for the popup
    const popupText = scene.add
      .text(centerX, centerY - 50, t("POPUP_SLEEP"), {
        font: "20px Arial",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Create 'Yes' button
    const yesButton = scene.add
      .text(centerX - 50, centerY + 30, t("YES"), {
        font: "18px Arial",
        color: "#00ff00",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        newDay(scene);
        showDay(scene);
        closePopup(scene, overlay, popupText, yesButton, noButton);
      });

    // Create 'No' button
    const noButton = scene.add
      .text(centerX + 50, centerY + 30, t("NO"), {
        font: "18px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setOrigin(0.5)
      .on("pointerdown", () => {
        closePopup(scene, overlay, popupText, yesButton, noButton);
      });
  }

function closePopup(scene, ...elements) {
  elements.forEach((element) => element.destroy());
  scene.physics.resume();
}