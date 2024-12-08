class Player extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, playerConfig) {
    super(scene, playerConfig.position.x, playerConfig.position.y, playerConfig.texture, playerConfig.frame);

    scene.add.existing(this);
    scene.physics.world.enable(this);

    /* reduce hitbox size */
    this.setBodySize(this.width / 2, this.height / 1.5);
    this.setCollideWorldBounds(true);

    this.setDepth(playerConfig.depth);
    this.playerDirection = playerConfig.direction;
    this.playerSpeed = playerConfig.speed;
  }

  update(cursors, scene) {
    let playerVector = new Phaser.Math.Vector2(0, 0);

    /* basic movement */
    if (cursors.left.isDown || scene.input.keyboard.addKey("A").isDown) {
      playerVector.x = -1;
      this.playerDirection = "left";
      this.flipX = true;
    } else if (cursors.right.isDown || scene.input.keyboard.addKey("D").isDown) {
      playerVector.x = 1;
      this.playerDirection = "right";
      this.flipX = false;
    }

    if (cursors.up.isDown || scene.input.keyboard.addKey("W").isDown) {
      playerVector.y = -1;
      this.playerDirection = "up";
    } else if (cursors.down.isDown || scene.input.keyboard.addKey("S").isDown) {
      playerVector.y = 1;
      this.playerDirection = "down";
    }

    playerVector.normalize();
    let playerMovement;

    this.setVelocity(playerVector.x * this.playerSpeed, playerVector.y * this.playerSpeed);
    playerVector.length() ? (playerMovement = "run") : (playerMovement = "idle");
    this.play(playerMovement + "-" + this.playerDirection, true);
  }
}
