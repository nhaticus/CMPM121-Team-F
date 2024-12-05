class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
  
    scene.add.existing(this);
    scene.physics.world.enable(this);
  
    this.setOrigin(0.5);
  
    /* Randomize plant type */
    this.setPlantType(Phaser.Math.Between(1, 3));
  
    console.log(`Plant created with type: ${this.plantType}`); // Debug during creation
  
    /* Some global variables */
    this.neightbor = 0;
    this.water = 0;
    this.sun = 0;
    this.days = 0;
    this.level = 0;
    this.sun = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  
    this.requirements = "";
  
    this.requirementsGenerator();
  }

  /*  WHEAT SPRITESHEET INDEXES
      0 - Seed
      1-3 - Plants
      4 - Produce
  */

  /*  PLUM SPRITESHEET INDEXES
      5 - Seed
      6-8 - Plants
      9 - Produce
  */

  /*  TOMATO SPRITESHEET INDEXES
      10 - Seed
      11-13 - Plants
      14 - Produce
  */

      setPlantType(x) {
        switch (x) {
          case 1:
            this.plantType = "wheat";
            this.setFrame(1);
            break;
          case 2:
            this.plantType = "plum";
            this.setFrame(7);
            break;
          case 3:
            this.plantType = "tomato";
            this.setFrame(13);
            break;
          default:
            this.plantType = ""; // Default case for safety
            break;
        }
        console.log("Assigned plant type:", this.plantType); // Log assigned type
      }

  grow() {
    if (this.level === 3) {
      return;
    }
    this.level++;
    this.setFrame(this.frame.name + 1);
    this.water = 0;
    this.requirementsGenerator();
  }

  showPlantInfoPopup(scene) {
    scene.physics.pause();
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;

    const popupWidth = 300;
    const popupHeight = 200;

    const overlay = scene.add
      .rectangle(centerX, centerY, popupWidth, popupHeight, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(2);

    const popupText = scene.add
      .text(
        centerX,
        centerY - popupHeight / 2, // Position text at the top of the popup
        "Days Planted: " +
          this.days +
          "\nWater Level: " +
          this.water +
          "%\nCurrent Sunlight: " +
          this.sun +
          "%\nRequirements: " +
          this.requirements +
          "\nPlant Level: " +
          this.level,
        {
          font: "14px Arial",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: popupWidth - 20 },
        }
      )
      .setOrigin(0.5, 0)
      .setDepth(2);

    const buttonYOffset = popupHeight / 2 - 40;

    const harvestButton = scene.add
  .text(centerX - 80, centerY + buttonYOffset, "Harvest", {
    font: "14px Arial",
    color: "#ffffff",
    backgroundColor: "#00ff00",
    padding: { x: 8, y: 4 },
  })
  .setInteractive()
  .setOrigin(0.5)
  .setDepth(2)
  .on("pointerdown", () => {
    if (this.level === 3) {
      console.log(`Harvest button clicked for plant type: ${this.plantType}`); // Debugging log
      scene.harvestPlant(this); // Delegate harvesting logic to Game.js
      scene.closePopup(
        overlay,
        popupText,
        harvestButton,
        waterButton,
        closeButton
      );
    } else {
      console.log("Plant is not fully grown; cannot harvest.");
    }
  });

    const waterButton = scene.add
      .text(centerX + 80, centerY + buttonYOffset, "Water", {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#0000ff",
        padding: { x: 8, y: 4 },
      })
      .setInteractive()
      .setOrigin(0.5)
      .setDepth(2)
      .on("pointerdown", () => {
        // Call the waterPlant method to water the plant and save its state
        scene.waterPlant(this);

        popupText.setText(
          "Days Planted: " +
            this.days +
            "\nWater Level: " +
            this.water +
            "%\nCurrent Sunlight: " +
            this.sun +
            "%\nRequirements: " +
            this.requirements +
            "\nPlant Level: " +
            this.level
        );
      });

    const closeButton = scene.add
      .text(centerX, centerY + popupHeight / 2 - 20, "Close", {
        font: "14px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(2)
      .on("pointerdown", () => {
        scene.closePopup(
          overlay,
          popupText,
          harvestButton,
          waterButton,
          closeButton
        );
      });
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }

  requirementsGenerator() {
    this.waterReq = Phaser.Math.Between(5, 20) * 5;
    this.sunReq = Phaser.Math.Between(5, 20) * 5;

    if (this.level === 0) {
      this.neighborReq = Phaser.Math.Between(2, 8);
    }
    this.requirements = `\nWater: ${this.waterReq}% \nSurrounding Plants: ${this.neighborReq} \n Sunlight: ${this.sunReq}`;
  }

  newDay(x) {
    this.days++;
    this.neighbor = x;
    this.levelUp(); // Check if plant can level up
    if (this.water >= 5) {
      this.water -= 5;
    }
  }

  levelUp() {
    const hasRequiredNeighbors = this.neighborReq === this.neighbor;
    const hasRequiredWater = this.water === this.waterReq;
    const canLevelUp = this.level < 3;

    console.log(hasRequiredNeighbors, hasRequiredWater, canLevelUp);
    if (hasRequiredNeighbors && hasRequiredWater && canLevelUp) {
      this.grow();
    }
  }

  /*  for degbugging purposes */
  fullyGrowPlant() {
    this.level = 3;
    this.setFrame(this.frame.name + 3);
  }
}
