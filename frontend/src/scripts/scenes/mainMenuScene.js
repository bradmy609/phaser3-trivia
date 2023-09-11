import socket from '../../../../shared/websocket';
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import CustomButton from '../objects/customButton';

const COLOR_PRIMARY = 0x7b5e57;
const COLOR_LIGHTEST = 0x9c7c74;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x4e342e;
const COLOR_DARKEST = 0x260e04;
const colors = {
    lightest: COLOR_LIGHTEST,
    light: COLOR_LIGHT,
    dark: COLOR_DARK,
    darkest: COLOR_DARKEST
}

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
        this.joinInputText = '';
        this.groupInputText = '';
    }

    preload() { 
        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);    
    }

    create() {
        // Background
        const background = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x333333).setOrigin(0)
            .setDepth(0);
        const buttonSpacing = this.game.config.height/10;

        const buttonBox = this.createRectangle(this.game.config.width / 2, buttonSpacing*5.7, this.game.config.width/2, 425, 5, '0x000000', '0xA9A9A9', 0.15)
        // Title
        const title = this.add.text(this.game.config.width / 2, buttonSpacing*1.5, 'Tricky Trivia', { fontSize: '40px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive();
        const dividingLine = this.createRectangle(this.game.config.width / 2, buttonSpacing*2.4, this.game.config.width/1.3, 2, 0, '0xA9A9A9')

        const playLabel = this.add.text(this.game.config.width / 2, buttonSpacing*3.2, "Play alone", {fontSize: '32px', fill: '#ffffff', align: 'center'})
            .setOrigin(0.5)
            .setDepth(2);

        const playButton = new CustomButton(this, this.game.config.width / 2, buttonSpacing*4, this.game.config.width/10, this.game.config.height/20, 5, 'Start Game', colors, () => {
                console.log('Starting game...');
                this.scene.start('StartGameScene');
            })
            .setDepth(2)

        const dividingLine2 = this.createRectangle(this.game.config.width / 2, buttonSpacing*4.6, this.game.config.width/2.5, 2, 0, '0xD3D3D3')
        const playBox = this.createRectangle(this, this.game.config.width / 2, buttonSpacing*4, playButton.width+10, playButton.height+10, 10, '0xD3D3D3')
            .setDepth(1);

        const groupLabel = this.add.text(this.game.config.width / 2, buttonSpacing*5.2, "Create a group", {fontSize: '32px', fill: '#ffffff', align: 'center'})
            .setOrigin(0.5)
            .setDepth(2);
        const [groupButton, groupInput] = this.createInput(this, this.game.config.width / 2, buttonSpacing*6, 325, 36, 'Enter a code to create group', 'Create');

        const scene = this;
        const textHolder = scene.add.text(0, 0, '', {fontSize: 24})
        const string = '';

        groupInput.on('textchange', function (e) {
            this.groupInputText = e.text;
            // console.log(this.groupInputText)
        }.bind(this))
        groupButton.on('pointerdown', this.multiplayerCallback.bind(this, 'createGroup'));

        const joinLabel = this.add.text(this.game.config.width / 2, buttonSpacing*7.2, "Join an existing group", {fontSize: '32px', fill: '#ffffff', align: 'center'})
        .setOrigin(0.5)
        .setDepth(2);
        const [joinButton, joinInput] = this.createInput(this, this.game.config.width / 2, buttonSpacing*8, 250, 36, 'Enter a code to join', 'Join');

        joinInput.on('textchange', function (e) {
            this.joinInputText = e.text;
        }.bind(this))

        joinButton.on('pointerdown', this.multiplayerCallback.bind(this, 'joinGroup'));

        socket.socket.addEventListener('message', (event) => {
            console.log('Received message:', event.data);
            const data = JSON.parse(event.data);
            if (data.type === 'group_created') {
              // Transition to the waiting scene
              this.scene.start('WaitingScene', data);
            }
          });
    }

    multiplayerCallback(action) {
        let inputValue = '';
        if (action === 'joinGroup') {
            inputValue = this.joinInputText;
        } else if (action === 'createGroup') {
            inputValue = this.groupInputText;
        }
        console.log('Sending input action to server: ', action, '\nSending input value to server: ', inputValue);
        if (inputValue) {
            socket.send({ action: action, value: inputValue });
        }
    }

    createRectangle(x, y, width, height, radius, fillColor, strokeStyle, fillAlpha, strokeThickness=2) {
        const roundRectangle = new RoundRectangle(this, x, y, width, height, radius, fillColor, fillAlpha)
            .setDepth(1)
            .setStrokeStyle(strokeThickness, strokeStyle, 1)
        this.add.existing(roundRectangle);
        return roundRectangle;
    }

    createInput(scene, x, y, width, height, inputText, buttonText, callback) {
        if (typeof callback !== 'function') {
            callback = function() {};
        }
        const borderWidth = 2;
        const spacing = 5;
        const joinButtonWidth = width / 3;
    
        const components = [];
    
        // Create input background
        const inputBackground = this.createRectangle(x, y, width, height, 5, '0xffffff')
            .setOrigin(0.5)
            .setDepth(3);
        components.push(inputBackground);
    
        // Create join button
        const joinButtonX = x + inputBackground.width / 2 + joinButtonWidth / 2 + borderWidth + spacing;
        // const joinButton = this.createRectangle(joinButtonX, y, joinButtonWidth, height, 10, COLOR_LIGHT)
        const joinButton = new CustomButton(this, joinButtonX, y, joinButtonWidth, height, 10, buttonText, colors, callback)
            .setDepth(3)
        components.push(joinButton);
        console.log(joinButton)
    
    
        // Create input
        const input = new InputText(scene, x, y, width, height, {
            type: 'textarea',
            text: inputText,
            fontSize: '20px',
            align: 'center',
            color: '000000',
            maxLength: 20
        })
            .setOrigin(0.5)
            .setDepth(3);
        this.add.existing(input);
        components.push(input);
    
        // Adjust component positions
        const totalWidth = width + joinButtonWidth + spacing;
        components.forEach(component => {
            component.x -= joinButtonWidth / 2;
        });
    
        // Create component box
        const componentBox = this.createRectangle(x+3, y, totalWidth *1.03, height + 10, 10, '0xD3D3D3')
            .setOrigin(0.5)
            .setDepth(2)
            .setStrokeStyle(2, '0xA9A9A9');
    
        return [joinButton.button, input];
    }

    createButton(x, y, text, onClick) {
        const textObject = this.add.text(x, y, text, { fontSize: '24px', fill: '#ffffff' })
            .setOrigin(0.5)
            .setDepth(3)
        const bounds = textObject.getBounds();
        const width = bounds.width;
        const height = bounds.height;

        const button = this.createRectangle(x, y, width*1.5, height*1.5, 5, COLOR_LIGHT, COLOR_PRIMARY)
            .setInteractive({ cursor: 'pointer' });

        button.on('pointerdown', () => {
            onClick();
        });
        
        return button;
    }
}