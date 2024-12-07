class Saving {
    constructor(localStorageKeyPrefix = "gameStateSlot") {
      this.localStorageKeyPrefix = localStorageKeyPrefix;
    }
  
    // Save game state to a specific slot
    saveGame(slot, gameState) {
      const key = `${this.localStorageKeyPrefix}${slot}`;
      localStorage.setItem(key, JSON.stringify(gameState));
      console.log(`Game saved to slot ${slot}:`, gameState);
    }

    quickSave(gameState) {
        localStorage.setItem(this.quickSaveKey, JSON.stringify(gameState));
        console.log("Quick save complete:", gameState);
      }
  
    // Load game state from a specific slot
    loadGame(slot) {
      const key = `${this.localStorageKeyPrefix}${slot}`;
      const savedData = localStorage.getItem(key);
      if (savedData) {
        console.log(`Loaded game from slot ${slot}:`, JSON.parse(savedData));
        return JSON.parse(savedData);
      } else {
        console.log(`No saved data found for slot ${slot}.`);
        return null;
      }
    }
  
     // Load quick save state
  loadQuickSave() {
    const savedData = localStorage.getItem(this.quickSaveKey);
    if (savedData) {
      console.log("Quick save loaded:", JSON.parse(savedData));
      return JSON.parse(savedData);
    } else {
      console.log("No quick save found.");
      return null;
    }
  }
  
    // Start a new game state for a specific slot
    startNewGame(slot, defaultState) {
      console.log(`Starting a new game in slot ${slot}...`);
      this.saveGame(slot, defaultState);
      return defaultState;
    }
  
    // Clear all save data
    clearAllData() {
      for (const key in localStorage) {
        if (key.startsWith(this.localStorageKeyPrefix)) {
          localStorage.removeItem(key);
          console.log(`Cleared save data for ${key}`);
        }
      }
    }
    restartGameData() {
      console.log("Clearing all saved game data...");
      for (const key in localStorage) {
        if (key.startsWith(this.localStorageKeyPrefix) || key === this.quickSaveKey) {
          localStorage.removeItem(key);
          console.log(`Cleared save data for ${key}`);
        }
      }
    }
  }
