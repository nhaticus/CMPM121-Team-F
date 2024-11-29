class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5);

    /* Randomize plant type */
    const plantType = Phaser.Math.Between(1, 3);

    let frame = (plantType - 1) * 6 + 1;

    this.setFrame(frame);

    /* Some global variables */
    this.plantType = "";
    this.water = 0;
    this.sun = 0;
    this.days = 0;
    this.level = 0;
    this.requirements = "";
  }

  grow() {
    this.level++;
    this.setFrame(this.frame.name + 1);
  }

  showPlantInfoPopup(scene) {
    scene.physics.pause();
    const centerX = scene.cameras.main.midPoint.x;
    const centerY = scene.cameras.main.midPoint.y;

    const overlay = scene.add
      .rectangle(centerX, centerY, 300, 200, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(2);
    const popupText = scene.add
      .text(
        centerX,
        centerY - 50,
        "Days Planted: " +
          this.days +
          "\nWater Level: " +
          this.water +
          "%\nRequirements: " +
          this.requirements +
          "\nPlant Level: " +
          this.level,
        { font: "20px Arial", color: "#ffffff", align: "center" }
      )
      .setOrigin(0.5)
      .setDepth(2);

    const harvestButton = scene.add
      .text(centerX - 50, centerY + 20, "Harvest", {
        font: "18px Arial",
        color: "#ffffff",
        backgroundColor: "#00ff00",
        padding: { x: 10, y: 5 },
      })
      .setInteractive()
      .setOrigin(0.5)
      .setDepth(2)
      .on("pointerdown", () => {
        if (this.level === 3) {
          this.destroy();
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
      .text(centerX + 50, centerY + 20, "Water", {
        font: "18px Arial",
        color: "#ffffff",
        backgroundColor: "#0000ff",
        padding: { x: 10, y: 5 },
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
        popupText.text =
          "Days Planted: " +
          this.days +
          "\nWater Level: " +
          this.water +
          "%\nRequirements: " +
          this.requirements +
          "\nPlant Level: " +
          this.level;
        console.log(this.water);
      });

    const closeButton = scene.add
      .text(centerX, centerY + 80, "Close", {
        font: "18px Arial",
        color: "#ff0000",
        backgroundColor: "#000000",
        padding: { x: 10, y: 5 },
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
}
