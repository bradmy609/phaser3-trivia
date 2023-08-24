import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';

export default class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, radius, text, color, callback){
        super(scene, x, y);
        this.shadowDepth = 4;
        this.darkest = color.darkest;
        this.dark = color.dark;
        this.light = color.light;
        this.lightest = color.lightest;

        this.text = scene.add.text(0, 0, text, { fontSize: '24px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(5)
        this.textBounds = this.text.getBounds()
        this.button = new RoundRectangle(scene, 0, 0, this.textBounds.width*1.3, this.textBounds.height*1.4, radius, this.light, this.dark)
            .setOrigin(0.5)
            .setDepth(4)
            .setStrokeStyle(2, this.dark, 1)
            .setInteractive({cursor: 'pointer'});
        this.buttonBounds = this.button.getBounds();
        console.log('buttonBounds: ', this.buttonBounds);
        this.shadow = new RoundRectangle(scene, 0, this.shadowDepth, this.textBounds.width*1.3, this.textBounds.height*1.4, radius, this.darkest, this.darkest)
        .setOrigin(0.5)
        .setDepth(3);

        this.components = [this.text, this.button, this.shadow];
        this.components.forEach(comp => {
            comp.y-=this.shadowDepth/2;
        })
        this.targets = [this.text, this.button];
        this.button.pointerOn = false;
        this.button.on('pointermove', () => {
            if (!this.button.pointerOn) {
                this.targets.forEach(target => {
                    target.y += this.shadowDepth;
                })
            }
            this.button.setFillStyle(this.lightest)
            this.button.pointerOn = true;
        })

        this.button.on('pointerout', () => {
            if (this.button.pointerOn) {
                this.targets.forEach(target => {
                    target.y -= this.shadowDepth;
                })
            }
            this.button.setFillStyle(this.light)
            this.button.setStrokeStyle(2, this.dark, 1)
            this.button.pointerOn = false;
        })

        this.on('pointermove', () => {
            if (this.button.pointerOn) {
                this.targets.forEach(target => {
                    target.y -= this.shadowDepth;
                })
            }
            this.button.setFillStyle(this.light)
            this.button.setStrokeStyle(2, this.dark, 1)
            this.button.pointerOn = false;
        })


        this.button.on('pointerup', callback);

        this.add(this.shadow);
        this.add(this.button);
        this.add(this.text);
        scene.add.existing(this);
    }

    // lightenColor(hexColor) {
    //     // Parse the hex color into separate RGB values
    //     console.log(hexColor);
    //     hexColor = String(hexColor);
    //     console.log(hexColor);
    //     const red = parseInt(hexColor.slice(1, 3), 16);
    //     const green = parseInt(hexColor.slice(3, 5), 16);
    //     const blue = parseInt(hexColor.slice(5, 7), 16);
    
    //     // Add 20 to each RGB value, ensuring they stay within the valid range (0 to 255)
    //     const newRed = Math.min(red + 20, 255);
    //     const newGreen = Math.min(green + 20, 255);
    //     const newBlue = Math.min(blue + 20, 255);
    
    //     const newHexColor = (newRed << 16) | (newGreen << 8) | newBlue;

    //     return Number(`0x${newHexColor.toString(16).padStart(6, '0')}`);
        
    //     return newHexColor;
    // }
}