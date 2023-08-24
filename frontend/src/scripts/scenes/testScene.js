import { DropDownList, Label } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import socket from '../../../../shared/websocket';

const CreateTextObject = function (scene, text) {
    const textObject = scene.add.text(0, 0, text, { fontSize: 20 });
    textObject.depth = 2;
    return textObject;
}

const CreateRectangle = function (scene, x, y, width, height, radius, fillColor, fillAlpha) {
    const roundRectangle = new RoundRectangle(scene, x, y, width, height, radius, fillColor, fillAlpha);
    scene.add.existing(roundRectangle);
    return roundRectangle;
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

export default class Example extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'StartGameScene' });
    }

    create ()
    {
        const background = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x333333).setOrigin(0)
        // Websocket button start
        const button = this.add.text(200, 150, 'Click me!', { fontSize: '24px', fill: '#ffffff' });
        button.setInteractive();

        // Add a click event listener to the button
        button.on('pointerdown', () => {
            const data = { message: 'Button clicked from Phaser!', clientID: socket.clientID };
            socket.send(data);
        });
        // Websocket button end

        var options = [];
        for (var i = 0; i < 15; i++) {
            options.push({ text: String.fromCharCode(i + 65), value: i });
        }

        var wrapEnable = true;
        var listWidth = (wrapEnable) ? 200 : undefined;

        const classInstance = this;
        var print = this.add.text(0, 0, '');    
        var dropDownList = new DropDownList(this, {
            x: 400, y: 300,

            background: this.add.existing(new RoundRectangle(this, 200, 200, 200, 200, 10, COLOR_PRIMARY)),
            icon: this.add.existing(new RoundRectangle(this, 0, 0, 20, 20, 10, COLOR_LIGHT)),
            text: CreateTextObject(this, '-- Select --').setFixedSize(150, 0),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                icon: 10
            },

            options: options,

            list: {
                wrap: true,
                width: 200,

                createBackgroundCallback: function (scene) {
                    return new RoundRectangle(scene, 0, 0, 2, 2, 0, COLOR_DARK);
                },
                createButtonCallback: function (scene, option, index, options) {
                    var text = option.text;
                    var button = new Label(scene, {
                        background: new RoundRectangle(scene, 0, 0, 20, 20, 0),

                        text: CreateTextObject(scene, text),

                        space: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10,
                            icon: 10
                        }
                    });
                    button.value = option.value;

                    return button;
                },

                // scope: dropDownList
                onButtonClick: function (button, index, pointer, event) {
                    // Set label text, and value
                    this.text = button.text;
                    this.value = button.value;
                    print.text += `Select ${button.text}, value=${button.value}\n`;
                },

                // scope: dropDownList
                onButtonOver: function (button, index, pointer, event) {
                    button.getElement('background').setStrokeStyle(1, 0xffffff);
                },

                // scope: dropDownList
                onButtonOut: function (button, index, pointer, event) {
                    button.getElement('background').setStrokeStyle();
                },

                easeIn: 400,
                easeOut: 100,
                transitIn: function (listPanel, duration) {
                    var scene = listPanel.scene;
        
                    var maskGameObject = scene.add.circle(listPanel.x, listPanel.y, 0, 0x330000).setVisible(false);
                    maskGameObject.type = 'Graphics';
                    listPanel.setMask(maskGameObject.createGeometryMask());
        
                    var radius = Math.max(listPanel.width, listPanel.height) * 2;
                    var tween = listPanel.scene.tweens.add({
                        targets: maskGameObject,
                        radius: { start: 0, to: radius },
                        duration: duration,
                        onComplete() {
                            listPanel.clearMask(true);
                            maskGameObject.destroy();
                        }
                    });
                },
                transitOut: function (listPanel, duration) {
                    var tween = listPanel.scene.tweens.add({
                        targets: listPanel,
                        alpha: 0,
                        duration: duration,
                    });
                }
            },

            setValueCallback: function (dropDownList, value, previousValue) {
                console.log(value);
            },
            value: undefined

        })
            .layout();
    }
}