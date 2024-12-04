class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5);

    /* Some global variables */
    this.plantType = "";
    this.neightbor = 0;
    this.water = 0;
    this.sun = 0;
    this.days = 0;
    this.level = 0;
    this.sun = Math.floor(Math.random() * (100 - 50 + 1)) + 50;
    this.requirements = "";

    /* Randomize plant type */
    this.setPlantType(Phaser.Math.Between(1, 3));

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
        this.plantType = "Wheat";
        this.setFrame(1);
        // console.log(this.plantType);
        break;
      case 2:
        this.plantType = "Plum";
        this.setFrame(7);
        // console.log(this.plantType);
        break;
      case 3:
        this.plantType = "Tomato";
        this.setFrame(13);
        // console.log(this.plantType);
        break;
    }
  }

  getPlantType() {
    return this.plantType;
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
            // Delegate harvesting logic to Game.js
            scene.harvestPlant(this);
            scene.closePopup(
                overlay,
                popupText,
                harvestButton,
                waterButton,
                closeButton
            );
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
        if (this.water >= 75) {
          this.water = 100;
        } else {
          this.water += 25;
        }
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
}
