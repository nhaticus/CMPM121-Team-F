class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.setOrigin(0.5);

    /* Randomize plant type */
    const plantType = Phaser.Math.Between(1, 2);
    console.log("hello");
    this.level = 0;
    this.days = 0;

    let frame;

    /* There are currently 2 plant types in plant.png first plant row is index 0-5 second plant row is 6-11 */

    if (plantType === 1) {
      frame = 1;
    } else {
      frame = 7;
    }

    this.setFrame(frame);
  }

  grow() {
    this.level++;
    this.setFrame(this.frame.name + 1);
  }
}
