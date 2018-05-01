
var gameover = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', './assets/images/gameover.png');
        game.load.audio('GOSound', './assets/sounds/GO.mp3');
    },

    create : function() {

        // Create button to start game like in Menu.
        this.add.button(0, 0, 'gameover', this.startGame, this);
       var sound = this.add.audio('GOSound');
       sound.play();



    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Menu');

    }

};
