class Buttons {
    constructor(scene) {
      this.scene = scene; // Store reference to the Phaser scene
      this.createUndoButton();
      this.createRedoButton();
      this.createRestartButton();
      this.createSaveButton();
      this.createQuitButton();
    }
  
    createUndoButton() {
      this.scene.add
        .image(this.scene.cameras.main.width - 100, 50, "UndoButton")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .setDisplaySize(32, 32)
        .on("pointerdown", () => {
          this.scene.undoAction();
        });
    }
  
    createRedoButton() {
      this.scene.add
        .image(this.scene.cameras.main.width - 50, 50, "RedoButton")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .setDisplaySize(32, 32)
        .on("pointerdown", () => {
          this.scene.redoAction();
        });
    }
  
    createRestartButton() {
      this.scene.add
        .image(this.scene.cameras.main.width - 450, 270, "RestartButton")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .setDisplaySize(32, 32)
        .on("pointerdown", () => {
          this.scene.restartGameData();
        });
    }
  
    createSaveButton() {
      this.scene.add
        .image(this.scene.cameras.main.width - 50, this.scene.cameras.main.height - 50, "SaveButton")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .setDisplaySize(64, 32)
        .on("pointerdown", () => {
          this.scene.saveGame();
        });
    }
  
    createQuitButton() {
      this.scene.add
        .image(this.scene.cameras.main.width - 50, this.scene.cameras.main.height - 20, "PauseButton")
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setInteractive()
        .setDisplaySize(24, 24)
        .on("pointerdown", () => {
          this.scene.showQuitPopup();
          this.scene.saveGameSlot(this.scene.activeSaveSlot);
        });
    }
  }
