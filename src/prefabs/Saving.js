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
  }
