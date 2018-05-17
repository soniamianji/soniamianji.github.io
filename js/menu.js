//only displays the start image. When it is clicked, the game transitions to the Game state.

var Menu = {

    preload : function() {
        //center
        this.game.scale.pageAlignHorizontally = true;this.game.scale.pageAlignVertically = true;this.game.scale.refresh();
        //load background image
        game.load.image('menu', './assets/images/menu.png');
        //load flame sprite sheet
        game.load.spritesheet('flames', './assets/images/flames_sprite.png', 600, 221, 3);
        //load menu audio
        game.load.audio('laughter', './assets/sounds/devils_laugh.mp3');

        game.load.image("mute", "./assets/images/mute.png");
        game.load.image("unmute", "./assets/images/unmute.png");

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

        //parse the saved scores
        if (localStorage.topScores !== undefined) {
            topScores = JSON.parse(localStorage.topScores);
        }

        //display highest score
        var highestScoreText = game.add.text(165, 160, ":"+topScores[0], {
          fontSize: "14px",
          fill: '#ff0000',
          align: "center",
          font: 'Press Start 2P',
          lineHeight: 400
        });
        console.log(highestScoreText.lineSpacing);
        highestScoreText.anchor.set(0.5, 0.5);

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

        // Change the state to the actual game.
        this.state.start('Game');
        game.sound.stopAll();

    }

};
