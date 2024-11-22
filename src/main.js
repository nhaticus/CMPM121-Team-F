const config = {
  type: Phaser.AUTO,
  render: {
    pixelArt: true,
  },
  width: 480,
  height: 300,
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  zoom: 2,
  scene: [Load, Game],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let playerDirection, speed;

const game = new Phaser.Game(config);
