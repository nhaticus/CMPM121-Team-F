class Inventory extends Phaser.GameObjects.Sprite {
    constructor(config){
        if(!config.scene){
            //console.log('missing scene');
            return;
        }
        if(!config.key){
            //console.log('missing key');
            return;
        }
        if(!config.up){
            config.up = 0;
        }
        if(!config.down){
            config.down = config.up;
        }
        if(!config.over){
            config.over = config.up;
        }

        if(!config.contents){
            config.contents = 'nothing';
        }

        super(config.scene, 0, 0, config.key, config.up);

        this.config = config;
        this.contents = config.contents

        if(config.x){
            this.x = config.x;
        }
        if(config.y){
            this.y = config.y;
        }

        config.scene.add.existing(this);
        this.setScrollFactor(0);

        this.setInteractive();
        this.on('pointerdown', this.onDown, this);
        this.on('pointerup', this.onUp, this);
        this.on('pointerover', this.onOver, this);
        this.on('pointerout', this.onUp, this);

        this.setDepth(10);
    }

    setContents(content){
        this.contents = content;
    }

    onDown(){
        //console.log("down")
        this.setFrame(this.config.down);
    }

    onOver(){
        //console.log("over");
        this.setFrame(this.config.over);
    }
    onUp(){
        //console.log("up");
        this.setFrame(this.config.up);
    }
}