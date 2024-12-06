class Load extends Phaser.Scene {
  constructor() {
    super("loadScene");
  }
  preload() {
    this.load.path = "./assets/";

    /*  map assets  */
    this.load.image("decorTiles", "tilesets/Decor.png");
    this.load.image("farmTiles", "tilesets/FarmTiles.png");
    this.load.image("fencesTiles", "tilesets/Fences.png");
    this.load.image("grassTiles", "tilesets/Grass.png");
    this.load.image("tiledGroundTiles", "tilesets/TiledGround.png");
    this.load.image("treeTiles", "tilesets/Tree.png");
    this.load.image("waterTiles", "tilesets/Water.png");

     /* button assets */
     this.load.image('UndoButton', 'tilesets/UndoButton.png');
     this.load.image('RedoButton', 'tilesets/RedoButton.png');
     this.load.image("SaveButton", "tilesets/save.png");
     this.load.image('RestartButton', 'tilesets/RestartButton.png');
     this.load.image("QuitButton", "tilesets/QuitButton.png");

    this.load.tilemapTiledJSON("mapJSON", "map.json");

    /*  player assets  */
    this.load.spritesheet("player", "spritesheets/player.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    /*  plant assets  */
    this.load.spritesheet("plant", "spritesheets/plant.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    /* inventory assets */
    this.load.spritesheet("inventory", "spritesheets/inventory.png", {
      frameWidth: 32,
      frameHeight: 32,
    })
  }
  create() {
    /* player's down animation */
    this.anims.create({
      key: "run-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 18,
        end: 23,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: this.anims.generateFrameNumbers("player", {
        start: 0,
        end: 5,
      }),
      frameRate: 3,
      repeat: -1,
    });

    /* player's right animation */
    this.anims.create({
      key: "run-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 29,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 11,
      }),
      frameRate: 3,
      repeat: -1,
    });

    /* player's left animation (will be mirrored Player.js) */
    this.anims.create({
      key: "run-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 24,
        end: 29,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 6,
        end: 11,
      }),
      frameRate: 3,
      repeat: -1,
    });

    /* player's up animation */
    this.anims.create({
      key: "run-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 30,
        end: 35,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-up",
      frames: this.anims.generateFrameNumbers("player", {
        start: 12,
        end: 17,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.start("gameScene");
  }
}
