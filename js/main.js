//This is the place where we will create a new game instance and add a menu state.

var game;

// Create a new game instance 960px wide and 960px tall:
game = new Phaser.Game(300, 500, Phaser.CANVAS, '');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.add('GameOver', GameOver);

game.state.start('Menu');

