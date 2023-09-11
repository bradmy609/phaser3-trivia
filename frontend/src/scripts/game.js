import 'phaser'
import '@babel/polyfill'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import Example from './scenes/skeletonScene'
import TestScene from './scenes/testScene'
import MainMenuScene from './scenes/mainMenuScene'
import WaitingScene from './scenes/waitingScene'

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.WEBGL,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  dom: {
    createContainer: true
  },
  backgroundColor: '#333333',
  parent: 'phaser-game',
  scene: [MainMenuScene, TestScene, WaitingScene]
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
