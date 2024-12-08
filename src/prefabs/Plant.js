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
    this.sun = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
  
    this.requirements = "";
  

  }

  setPlantTypes(availablePlants){
    console.log(availablePlants);
    const thisPlant = availablePlants[Phaser.Math.Between(0, availablePlants.length - 1)];

    this.plantType = thisPlant[0];
    console.log("PLANT TYPE" + this.plantType);

    console.log("Assigned plant type:", this.plantType); // Log assigned type

    this.setFrame(thisPlant[1]);

    this.requirementsGenerator(thisPlant[2]);
    
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
     water() {
      const waterIncrease = Phaser.Math.Between(20, 100);
      this.water = Math.min(this.water + waterIncrease, 100);
      console.log(`Plant watered: ${this.water}% (+${waterIncrease}%)`);

}



harvest() {
  if (this.level === 3) {
    console.log(`Harvesting plant: ${this.plantType}`);
    return {
      type: this.plantType,
      level: this.level,
      x: this.x,
      y: this.y,
    };
  } else {
    console.log("Plant is not ready for harvest.");
    return null;
  }
}

static initializeAvailableTypes() {
  return [
    ["wheat", 1, ["sun", "water", "neighbor"]],
    ["plum", 7, ["sun", "neighbor"]],
    ["tomato", 13, ["water"]],
  ];
}

// Create plant from data (e.g., during load)
static createFromData(scene, data) {
  const plant = new Plant(scene, data.x, data.y, "plant");
  Object.assign(plant, data); // Assign saved properties
  plant.setFrame(data.frameIndex || 0); // Set correct frame
  return plant;
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
        t("DAYS_PLANTED") +this.days +
        "%\n" + t("WATER_LEVEL") + this.water +
          "%\n" + t("CURRENT_SUNLIGHT") + this.sun +
          "%\n" + t("REQUIREMENTS") + this.requirements +
          "\n" + t("PLANT_LEVEL") + this.level,
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

  requirementsGenerator(reqs) {
    if(reqs.includes("sun")){
      this.sunReq = Phaser.Math.Between(5, 20) * 5;
    }
    else{
      this.sunReq = 0;
    }
    if(reqs.includes("water")){
      this.waterReq = Phaser.Math.Between(5, 20) * 5;
    }
    else{
      this.waterReq = 0;
    }
    if(reqs.includes("neighbor")){
      if (this.level === 0) {
        this.neighborReq = Phaser.Math.Between(2, 8);
      }
    }
    else{
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
}
