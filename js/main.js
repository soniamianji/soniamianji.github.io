//This is the place where we will create a new game instance and add a menu state.

var game;

// Create a new game instance 600px wide and 450px tall:
game = new Phaser.Game(960, 960, Phaser.AUTO, '');

// First parameter is how our state will be called.
// Second parameter is an object containing the needed methods for state functionality
game.state.add('Menu', Menu);

game.state.add('Game', Game);

game.state.start('Menu');

game.state.add('Game_Over', Game_Over);