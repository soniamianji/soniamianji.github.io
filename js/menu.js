//only displays the start image. When it is clicked, the game transitions to the Game state.

var Menu = {

    preload : function() {
        //load background image
        game.load.image('menu', './assets/images/menu.png');
        //load flame sprite sheet
        game.load.spritesheet('flames', './assets/images/flames_sprite.png', 600, 221, 3);
        //load menu audio
        game.load.audio('laughter', './assets/sounds/devils_laugh.mp3');

    },

    create: function () {

        // Add menu screen.
        // It will act as a button to start the game.
        var menuPage = this.add.button(0,0, 'menu', this.startGame, this);
        menuPage.scale.setTo(0.5);
        var flames = game.add.sprite(0, 400, 'flames');
        flames.scale.setTo(0.5);
        flames.animations.add('fire', [0,1,2], 3, true);
        flames.animations.play('fire');
        var laughter = game.add.audio('laughter');
        laughter.play();

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');
        game.sound.stopAll();

    }

};
