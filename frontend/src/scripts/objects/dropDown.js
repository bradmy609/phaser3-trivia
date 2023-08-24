// DropdownComponent.js
import { Scene } from 'phaser';
import { DropDownList } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

export default class DropdownComponent {
    constructor(scene, x, y, options, onChangeCallback) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.options = options;
        this.onChangeCallback = onChangeCallback;

        this.createDropdown();
    }

    createDropdown() {
        this.dropdown = new DropDownList(this.scene, {
            x: this.x,
            y: this.y,
            width: 200,
            height: 40,
            options: this.options,
            orientation: 'y',
            expandEvent: 'valuechange'
        });

        this.dropdown.on('valuechange', this.handleDropdownChange, this);

        this.scene.add.existing(this.dropdown);
    }

    handleDropdownChange(value) {
        if (this.onChangeCallback) {
            this.onChangeCallback(value);
        }
    }
}
