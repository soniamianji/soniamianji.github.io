
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

       //parse the saved scores
       if (localStorage.topScores !== undefined) {
           topScores = JSON.parse(localStorage.topScores);
           //console.log(localStorage);
        }

        //top scores title
        var highScoreText = game.add.text(150, 330, "Top Scores:", {
          fontSize: "20px",
          fill: '#4b657d',
          align: "center",
        });
        highScoreText.anchor.set(0.5, 0.5);

        //actual top scores
        var yPos = 360;
        for (var i = 0; i < topScores.length; i++) {
            boop = game.add.text(150,yPos,topScores[i], {
            fontSize: "20px",
            fill: '#4b657d',
            align: "center",
          });
          boop.anchor.set(0.5, 0.5);
          yPos += 30
        }

        //last score text
        var lastScoreText = game.add.text(150, 290, "Score: " + score, {
            fontSize: "30px",
            fill: '#4b657d',
            align: "center",
        });
        lastScoreText.anchor.set(0.5, 0.5);



    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Menu');

    }

};
