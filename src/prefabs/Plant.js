class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5);

    /* Randomize plant type */
    const plantType = Phaser.Math.Between(1, 3);
    console.log("hello");
    this.level = 0;
    this.days = 0;

    let frame = (plantType - 1) * 6 + 1;
    
    this.setFrame(frame);
  }

  grow() {
    this.level++;
    this.setFrame(this.frame.name + 1);
  }
}
