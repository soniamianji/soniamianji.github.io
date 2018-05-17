
var gameover = {

    preload : function() {
        // Load the needed image for this game screen.
        game.load.image('gameover', './assets/images/gameover.png');
        game.load.audio('GOSound', './assets/sounds/GO.mp3');
        game.load.spritesheet('skull', './assets/images/skull_sprite.png', 134, 118, 2)
        game.load.image("mute", "./assets/images/mute.png");
        game.load.image("unmute", "./assets/images/unmute.png");
    },

    create : function() {

      // Create button to start game like in Menu
      var goImage = this.add.button(0, 0, 'gameover', this.startGame, this);

      // add the skull animation
      var skull = game.add.sprite(83, 40, 'skull');
      skull.animations.add('talk', [0,1], 2, true);
      skull.animations.play('talk');

      var sound = this.add.audio('GOSound');
      sound.play();

       //parse the saved scores
       if (localStorage.topScores !== undefined) {
           topScores = JSON.parse(localStorage.topScores);
           //console.log(localStorage);
        }

        //top scores title
        var highScoreText = game.add.text(155, 300, "\nTop Scores:", {
          fontSize: "14px",
          fill: '#ea302b',
          align: "center",
          font: 'Press Start 2P'
        });
        highScoreText.anchor.set(0.5, 0.5);

        //actual top scores
        var yPos = 340;
        for (var i = 0; i < topScores.length; i++) {
            boop = game.add.text(150,yPos,i+1+"."+topScores[i], {
            fontSize: "16px",
            fill: '#ea302b',
            align: "center",
            font: 'Press Start 2P'
          });
          boop.anchor.set(0.5, 0.5);
          yPos += 30
        }

        //last score text
        var lastScoreText = game.add.text(150, 270, "Score:" + score, {
            fontSize: "18px",
            fill: '#ea302b',
            align: "center",
            font: 'Press Start 2P'
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
