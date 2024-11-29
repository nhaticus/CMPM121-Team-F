class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    /* reduce hitbox size */
    this.setBodySize(this.width / 2, this.height / 1.5);

    this.setCollideWorldBounds(true);

    this.setDepth(1);

    playerDirection = "down";
    speed = 100;
  }

  update(cursors, scene) {
    let playerVector = new Phaser.Math.Vector2(0, 0);

    /* basic movement */
    if (cursors.left.isDown || scene.input.keyboard.addKey("A").isDown) {
      playerVector.x = -1;
      playerDirection = "left";
      this.flipX = true;
    } else if (
      cursors.right.isDown ||
      scene.input.keyboard.addKey("D").isDown
    ) {
      playerVector.x = 1;
      playerDirection = "right";
      this.flipX = false;
    }

    if (cursors.up.isDown || scene.input.keyboard.addKey("W").isDown) {
      playerVector.y = -1;
      playerDirection = "up";
    } else if (cursors.down.isDown || scene.input.keyboard.addKey("S").isDown) {
      playerVector.y = 1;
      playerDirection = "down";
    }

    playerVector.normalize();
    let playerMovement;

    this.setVelocity(playerVector.x * speed, playerVector.y * speed);
    playerVector.length()
      ? (playerMovement = "run")
      : (playerMovement = "idle");
    this.play(playerMovement + "-" + playerDirection, true);
  }
}
