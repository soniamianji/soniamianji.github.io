
var GameOver = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('GameOver', './assets/images/gameover.png');
    },

    create : function() {

        // Create button to start game like in Menu.
        this.add.button(0, 0, 'GameOver', this.startGame, this);

      

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Game');

    }

};







