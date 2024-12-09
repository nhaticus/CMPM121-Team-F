//import { t, setLanguage } from '../utils/localization.js'; // Adjust the path as needed
class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5);

    /* Randomize plant type */

    /* Some global variables */
    this.neightbor = 0;
    this.water = 0;
    this.sun = 0;
    this.days = 0;
    this.level = 0;
    this.sun = 0;

    this.requirements = "";

    this.requirementsList = "";

    this.setInteractive().on("pointerdown", () => {
      this.showPlantInfoPopup(scene);
    });
  }

  setPlantTypes(availablePlants) {
    console.log(availablePlants);
    const thisPlant = availablePlants[Phaser.Math.Between(0, availablePlants.length - 1)];
    this.requirementsList = thisPlant[2];
    this.plantType = thisPlant[0];
    console.log("PLANT TYPE" + this.plantType);

    console.log("Assigned plant type:", this.plantType); // Log assigned type

    this.setFrame(thisPlant[1]);

    this.requirementsGenerator(this.requirementsList);
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

  showPlantInfoPopup(scene) {
    scene.physics.pause();
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;

    const popupWidth = 300;
    const popupHeight = 200;

    const overlay = scene.add.rectangle(centerX, centerY, popupWidth, popupHeight, 0x000000, 0.7).setOrigin(0.5).setDepth(2);

    const popupText = scene.add
      .text(
        centerX,
        centerY - popupHeight / 2, // Position text at the top of the popup
        t("DAYS_PLANTED") + this.days + "\n" + t("WATER_LEVEL") + this.water + "%\n" + t("CURRENT_SUNLIGHT") + this.sun + "%\n" + t("REQUIREMENTS") + this.requirements + "\n" + t("PLANT_LEVEL") + this.level,
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
      .text(centerX - 80, centerY + buttonYOffset, t("HARVEST"), {
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
          this.harvestPlant(scene);
          // console.log(`Harvest button clicked for plant type: ${this.plantType}`); // Debugging log
          closePopup(scene, overlay, popupText, harvestButton, waterButton, closeButton);
        } else {
          console.log("Plant is not fully grown; cannot harvest.");
        }
      });

    const waterButton = scene.add
      .text(centerX + 80, centerY + buttonYOffset, t("WATER"), {
        font: "14px Arial",
        color: "#ffffff",
        backgroundColor: "#0000ff",
        padding: { x: 8, y: 4 },
      })
      .setInteractive()
      .setOrigin(0.5)
      .setDepth(2)
      .on("pointerdown", () => {
        this.waterPlant(scene);

        popupText.setText("Days Planted: " + this.days + "\nWater Level: " + this.water + "%\nCurrent Sunlight: " + this.sun + "%\nRequirements: " + this.requirements + "\nPlant Level: " + this.level);
      });

    const closeButton = scene.add
      .text(centerX, centerY + popupHeight / 2 - 20, t("CLOSE"), {
        font: "14px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 8, y: 4 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setDepth(2)
      .on("pointerdown", () => {
        closePopup(scene, overlay, popupText, harvestButton, waterButton, closeButton);
      });
  }

  closePopup(...elements) {
    elements.forEach((element) => element.destroy());
    this.physics.resume();
  }

  grow() {
    if (this.level === 3) {
      return;
    }
    this.level++;
    this.setFrame(this.frame.name + 1);
    this.water = 0;
    this.requirementsGenerator(this.requirementsList);
  }

  requirementsGenerator(reqs) {
    if (reqs.includes("sun")) {
      this.sunReq = Phaser.Math.Between(5, 20) * 5;
    } else {
      this.sunReq = 0;
    }
    if (reqs.includes("water")) {
      this.waterReq = Phaser.Math.Between(5, 20) * 5;
    } else {
      this.waterReq = 0;
    }
    if (reqs.includes("neighbor")) {
      if (this.level === 0) {
        this.neighborReq = Phaser.Math.Between(2, 8);
      }
    } else {
      this.neighborReq = 0;
    }
    this.requirements = `\n` + t("WATER_REQ") + `${this.waterReq}% \n` + t("SURROUND") + `${this.neighborReq} \n` + t("SUN_REQ") + `${this.sunReq}`;
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

  waterPlant(scene) {
    const randomWaterIncrease = Phaser.Math.Between(1, 10) * 5; //multiple of 5 so its 5 - 50

    // Save the watering action
    saveState(scene, "water", {
      x: this.x,
      y: this.y,
      previousWater: this.water,
      newWater: Math.min(this.water + randomWaterIncrease, 100),
    });

    this.water = Math.min(this.water + randomWaterIncrease, 100);
    console.log(`Plant watered: ${this.water} (+${randomWaterIncrease})`);
  }

  harvestPlant(scene) {
    console.log(`Attempting to harvest plant with type: ${this.plantType}`);

    // Save the state before destroying the plant
    saveState(scene, "harvest", {
      x: this.x,
      y: this.y,
      harvestedthis: {
        x: this.x,
        y: this.y,
        plantType: this.plantType, // Save the type
        days: this.days,
        water: this.water,
        sun: this.sun,
        level: this.level, // Save the level explicitly
      },
    });
    // Add plant type to harvested set
    scene.harvestedPlantTypes.add(this.plantType);
    console.log("Harvested Plant Types:", Array.from(scene.harvestedPlantTypes));

    // Check if all plant types have been harvested
    const allPlantTypes = ["wheat", "plum", "tomato"]; // Define all possible plant types
    if (allPlantTypes.every((type) => scene.harvestedPlantTypes.has(type))) {
      showCompletionPopup(scene);
    }
    this.destroy();
    console.log(`${this.plantType} at (${this.x}, ${this.y}) harvested.`);
  }
}
