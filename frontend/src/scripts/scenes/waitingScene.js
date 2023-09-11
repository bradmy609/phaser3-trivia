class WaitingScene extends Phaser.Scene {
    constructor() {
      super({ key: 'WaitingScene' });
    }

    init(data) {
        console.log(JSON.stringify(data))
        this.data = data;
    }
  
    preload() {
    }
  
    create() {
        const spacing = this.game.config.height/50;
        // Display a waiting message
        const groupText = this.add.text(this.game.config.width / 2, this.game.config.height/6, `${this.data.groupName}`, {
        fontSize: '24px',
        fill: '#fff',
        align: 'center'
        })
        .setOrigin(0.5);
        const groupTextTitle = this.add.text(this.game.config.width/2, this.game.config.height/6 - groupText.height - spacing, 'Group Code', {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
        }).setOrigin(0.5);
        const waitingText = this.add.text(this.game.config.width / 2, this.game.config.height/3, 'Waiting for other players...', {
        fontSize: '24px',
        fill: '#fff',
        });
        waitingText.setOrigin(0.5);
  
      // You can add other UI elements or loading animations as needed
    }
  
    // You can add more waiting scene logic here if needed
  }
  
  export default WaitingScene;
  