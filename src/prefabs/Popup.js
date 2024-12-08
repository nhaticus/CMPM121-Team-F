class Popup {
    constructor(scene) {
      this.scene = scene; // Reference to the Phaser scene
    }
  
    // Base function to create popups
    createPopup(title, message, buttons = []) {
      const centerX = this.scene.cameras.main.midPoint.x;
      const centerY = this.scene.cameras.main.midPoint.y;
      const popupWidth = 300;
      const popupHeight = 200;
  
      // Create popup background
      const overlay = this.scene.add
        .rectangle(centerX, centerY, popupWidth, popupHeight, 0x000000, 0.7)
        .setOrigin(0.5)
        .setDepth(100);
  
      // Add title
      const titleText = this.scene.add
        .text(centerX, centerY - popupHeight / 2 + 20, title, {
          font: "20px Arial",
          color: "#ffffff",
          align: "center",
        })
        .setOrigin(0.5)
        .setDepth(101);
  
      // Add message
      const messageText = this.scene.add
        .text(centerX, centerY, message, {
          font: "16px Arial",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: popupWidth - 40 },
        })
        .setOrigin(0.5)
        .setDepth(101);
  
      // Add buttons
      const buttonYOffset = popupHeight / 2 - 50;
      const buttonElements = buttons.map((button, index) => {
        const buttonX = centerX - (buttons.length - 1) * 60 + index * 120;
  
        return this.scene.add
          .text(buttonX, centerY + buttonYOffset, button.text, {
            font: "14px Arial",
            color: button.color || "#ffffff",
            backgroundColor: button.backgroundColor || "#000000",
            padding: { x: 10, y: 5 },
          })
          .setInteractive()
          .setOrigin(0.5)
          .setDepth(102)
          .on("pointerdown", () => {
            if (button.callback) button.callback(); // Execute button callback
            this.closePopup([overlay, titleText, messageText, ...buttonElements]); // Close popup
          });
      });
  
      return { overlay, titleText, messageText, buttonElements };
    }
  
    // Specific popup for sleeping
    showSleepingPopup() {
      this.createPopup("Sleep", "Do you want to end the day?", [
        {
          text: "Yes",
          color: "#00ff00",
          callback: () => {
            this.scene.newDay(); // Logic for starting a new day
          },
        },
        {
          text: "No",
          color: "#ff0000",
          callback: () => {
            console.log("Player chose not to sleep.");
          },
        },
      ]);
    }
  
    // Specific popup for saving slots
    showSaveSlotPopup() {
      const slots = [1, 2, 3];
      const buttons = slots.map((slot) => ({
        text: `Save Slot ${slot}`,
        callback: () => {
          this.scene.activeSaveSlot = slot;
          this.scene.saveGameSlot(slot);
          console.log(`Saved game to slot ${slot}`);
        },
      }));
  
      this.createPopup("Save Game", "Choose a slot to save your progress.", buttons);
    }
  
    // Specific popup for harvesting all crops
    showHarvestAllPopup() {
      this.createPopup("Harvest Complete", "You have harvested all the crops!", [
        {
          text: "Close",
          color: "#ff0000",
          callback: () => {
            console.log("Harvest popup closed.");
          },
        },
      ]);
    }
  
    // Specific popup for quitting the game
    showQuitPopup() {
      this.createPopup("Quit Game", "Are you sure you want to quit?", [
        {
          text: "Yes",
          color: "#00ff00",
          callback: () => {
            this.scene.quitGame(); // Logic for quitting the game
          },
        },
        {
          text: "No",
          color: "#ff0000",
          callback: () => {
            console.log("Quit canceled.");
          },
        },
      ]);
    }
  
    closePopup(elements) {
      elements.forEach((element) => element.destroy());
      this.scene.physics.resume(); // Resume game
    }
  }
  