
var gameover = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', './assets/images/gameover.png');
        game.load.audio('GOSound', './assets/sounds/GO.mp3');

        game.load.image("mute", "./assets/images/mute.png");
        game.load.image("unmute", "./assets/images/unmute.png");
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
          fill: '#ff0000',
          align: "center",
        });
        highScoreText.anchor.set(0.5, 0.5);

        //actual top scores
        var yPos = 360;
        for (var i = 0; i < topScores.length; i++) {
            boop = game.add.text(150,yPos,topScores[i], {
            fontSize: "20px",
            fill: '#ff0000',
            align: "center",
          });
          boop.anchor.set(0.5, 0.5);
          yPos += 30
        }

        //last score text
        var lastScoreText = game.add.text(150, 290, "Score: " + score, {
            fontSize: "30px",
            fill: '#ff0000',
            align: "center",
        });
        lastScoreText.anchor.set(0.5, 0.5);

        //volume button controls
        if (game.sound.volume==1) {
          mute = this.game.add.sprite(270,4,"mute");
          mute.anchor.set(0, 0);
          mute.fixedToCamera = true;
          mute.inputEnabled = true;
          mute.events.onInputDown.add(soundOFF, this);
        } else if (game.sound.volume==0) {
          unmute = this.game.add.sprite(270,4,"unmute");
          unmute.anchor.set(0, 0);
          unmute.fixedToCamera = true;
          unmute.inputEnabled = true;
          unmute.events.onInputDown.add(soundON, this);
        }

        function soundOFF() {
          game.sound.volume = 0;

          mute.destroy();

          unmute = this.game.add.sprite(270,4,"unmute");
          unmute.anchor.set(0, 0);
          unmute.fixedToCamera = true;
          unmute.inputEnabled = true;
          unmute.events.onInputDown.add(soundON, this);
        }

        function soundON() {
          game.sound.volume = 1;

          unmute.destroy();

          mute = this.game.add.sprite(270,4,"mute");
          mute.anchor.set(0, 0);
          mute.fixedToCamera = true;
          mute.inputEnabled = true;
          mute.events.onInputDown.add(soundOFF, this);
        }

    },

    startGame: function () {

        // Change the state back to Game.
        this.state.start('Menu');

    }

};
