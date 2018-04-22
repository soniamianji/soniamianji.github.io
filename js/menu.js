//only displays the start image. When it is clicked, the game transitions to the Game state.

var Menu = {

    preload : function() {
        // Load all the needed resources for the menu.
        game.load.image('menu', './assets/images/menu.png');
    },

    create: function () {

        // Add menu screen.
        // It will act as a button to start the game.
        var menuPage = this.add.button(0,0, 'menu', this.startGame, this);
        menuPage.scale.setTo(0.5,0.5); 
       

    },

    startGame: function () {

        // Change the state to the actual game.
        this.state.start('Game');

    }

};