/********************* CONTENTS *********************/
/****************************************************/

/*
  1. Global Variables

  2. Value Variables

  3. Preload
      a) Sprites and Sounds

  4. Create
      a) World Setup
          I.    Platforms
          II.   Stones
          III.  Springs
          IV.   Player
          V.    Fire
      b) Play and Pause
      c) Controls
      d) Scoring
      e) Volume Controls

  5.  Update
        a) Move Springs
        b) Set Worldbounds
        b) Move Camera
            I. Raise Score
        c) Generate Fireballs
        d) Collisions
            I. Fireball
            II. Stone
            III. Platform
            IV. Spring
        e) Move Ledges
        f) Move Player
        g) Kill Player in Flames
        h) Update Score

  6.   preRender
        a) Move locked Springs

  7.  Render
        a) Debug

  8. Functions
        a) makeFire
        b) createPlayer
        c) generatePLatforms
        d) generateSpring
        e) lockIt
        f) generateStones
        g) collectStone
        h) updateScore
        i) gameOverScore
*/
/****************************************************/
/****************************************************/





//global variables

var player,cursors, ledge,MaxCameraY,platformPool,yStorage,base,background,
 spring, stonesPool, flames, jump, collect, bgMusic, score, scoreText, fpsCounter, topScores,
 fireBall, raSpawn, hitSpring, initialWorldHeight, mute, unmute, pause_label,timerBall;

//variables that holds value
var hitSpring = false;
var initialWorldHeight = 500;
var goLeft = false;

var Game = {

    preload: function(){
        game.load.spritesheet('hero','./assets/images/hero.png', 125,200,19);
        game.load.spritesheet('flames', './assets/images/flames_sprite.png', 600, 221, 3);
        game.load.spritesheet('pause','./assets/images/pausePlay.png',245,512);
        game.load.image('base', './assets/images/skulls.png');
        game.load.image('spring', './assets/images/spring.png');
        game.load.image('stone_red', './assets/images/whiskey.png');
        game.load.audio('jump', './assets/sounds/jump.mp3');
        game.load.audio('collect', './assets/sounds/collect.mp3');
        game.load.audio('springSound', './assets/sounds/springSound.mp3');
        game.load.audio('bgMusic', './assets/sounds/bgMusic.mp3');
        game.load.image("ball", './assets/images/ball.png');
        game.load.image("mute", "./assets/images/mute.png");
        game.load.image("unmute", "./assets/images/unmute.png");
        game.load.image('background', "./assets/images/background.png");

    },

    create: function(){

     //bg
     background = game.add.tileSprite(0,0,300,500,'background');
     background.scale.setTo(0.5);
     background.fixedToCamera = true;


      //physic enabled
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //creating group for the stones
      stonesPool = game.add.group();
      //enableing physics on them
      game.physics.arcade.enable(stonesPool);
      stonesPool.enableBody = true;

        // should be reset on restart of the game
        MaxCameraY = 0;

        //sounds
        jump = game.add.audio('jump');
        collect = game.add.audio('collect');
        springSound = game.add.audio('springSound');
        bgMusic = game.add.audio('bgMusic');
       bgMusic.play();
        bgMusic.loopFull();

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.maxWidth = this.game.width;
        game.scale.maxHeight = this.game.height;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;


        this.generatePlatforms();
        this.generateStones();
        this.generateSpring();
        this.createPlayer();
        this.makeFire();


        //play and pause
        pause_label = game.add.button(245,0,'pause');
        pause_label.scale.setTo(0.07);
        pause_label.fixedToCamera =true;
        pause_label.inputEnabled = true;
        pause_label.frame = 1;
        // Add a input listener to add the function
        pause_label.events.onInputDown.add(pauseF, this);

        function pauseF(){
          if (game.paused == false) {
            pause_label.frame = 0;
            game.paused = true;

            if (game.sound.volume==1) { mute.kill() } else if (game.sound.volume==0) { unmute.kill() }
          } else {
            pause_label.frame = 1;
            game.paused = false;

            if (game.sound.volume==1) { mute.revive() } else if (game.sound.volume==0) { unmute.revive() }
          }
        }
         //  Our controls.
         cursors = game.input.keyboard.createCursorKeys();

         //scoring
         topScores = [0,0,0,0,0];
         score = 0;
         fpsCounter = 0;
         timerBall = 300;
         scoreText = game.add.text(14, 4, "score: " +score, {
             fontSize: "20px",
             fill: '#ff0000',
             align: "center",
         });
         scoreText.anchor.set(0, 0);
         scoreText.fixedToCamera = true;

         if (localStorage.topScores !== undefined) {
           topScores = JSON.parse(localStorage.topScores);
         }

         //volume button controls
         if (game.sound.volume==1) {
           mute = this.game.add.sprite(270,8,"mute");
           mute.anchor.set(0, 0);
           mute.scale.setTo(0.7);
           mute.fixedToCamera = true;
           mute.inputEnabled = true;
           mute.events.onInputDown.add(soundOFF, this);
         } else if (game.sound.volume==0) {
           unmute = this.game.add.sprite(270,8,"unmute");
           unmute.anchor.set(0, 0);
           unmute.scale.setTo(0.7);
           unmute.fixedToCamera = true;
           unmute.inputEnabled = true;
           unmute.events.onInputDown.add(soundON, this);
         }


         function soundOFF() {
           game.sound.volume = 0;
           mute.destroy();
           unmute = this.game.add.sprite(270,8,"unmute");
           unmute.anchor.set(0, 0);
           unmute.scale.setTo(0.7);
           unmute.fixedToCamera = true;
           unmute.inputEnabled = true;
           unmute.events.onInputDown.add(soundON, this);
         }

         function soundON() {
           game.sound.volume = 1;
           unmute.destroy();
           mute = this.game.add.sprite(270,8,"mute");
           mute.anchor.set(0, 0);
           mute.scale.setTo(0.7);
           mute.fixedToCamera = true;
           mute.inputEnabled = true;
           mute.events.onInputDown.add(soundOFF, this);
         }

        },

    update: function(){
      background.tilePosition.y +=1;


      fpsCounter++;
      if (timerBall > 0) {
        timerBall--;
      }

      //move springs when out of sight
        if (spring.y >= game.camera.y+game.camera.height){
          //place on ledge 6 or 7
          var i = game.rnd.integerInRange(5,6);
          spring.x = platformPool.children[i].x + 30;
          spring.y = platformPool.children[i].y - 17;
        }


         //setBounds(x, y, width, height)
            //Updates the size of this world and sets World.x/y to the given values
    game.world.setBounds(null ,-player.changingYPos, game.world.width  ,initialWorldHeight + player.changingYPos);



    /*********************CAMERA**************/
        //the distance between camera.y and the hero
    game.camera.y = player.y - 200;
        //this is how we store camera.y value to maxcameraY
    if (game.camera.y < MaxCameraY)
    {
        MaxCameraY = game.camera.y;
//        console.log(score);

        /*********************SCORE****************/
           //update score
           //you are going up for 1 sec => it doesn't update 60 times (thus +60 points) but rather only 10 times += 10 points (27:3)
           if (fpsCounter > 10) { // <<< change this this for (+1) faster
             score++; // <<< change this for +(more) on every update
             fpsCounter = 0;
           }
    }
    //if players y coordinate becomes more that the cameraslimit camera wont follow.
    //this is how the camera would always go up
    if(Math.abs(player.y - MaxCameraY) > 0)
    {
        game.camera.y = MaxCameraY;


    }

/********************* FIREBALL ********************/
/****************************************************/

  if (timerBall==0) {
    // generate a random spawn frequency number the fireballs
    raSpawn = Math.floor(Math.random() * 6);
    //spawn a fireball only if there isn't one already
    if (fireBall == undefined) {
      if (5 == raSpawn) {
        raSpawnX = game.rnd.integerInRange(20, game.world.width -20);
        //raSpawnX = Math.floor(Math.random() * 220) + 40;
        fireBall =  game.add.sprite(raSpawnX,game.camera.y-50,'ball');
        fireBall.anchor.setTo(0.5,0.5);
        fireBall.scale.setTo(0.5,0.5);
        game.physics.arcade.enable(fireBall);
      }
    }
    //move the fireball only if there IS one already
    if (fireBall != undefined) {
      fireBall.y += 4 //<< adjust this for the speed of the fireball
      if (fireBall.y > 510) {
        fireBall.destroy();
        fireBall = undefined;
      }
    }
  }

/********************* COLLISIONS ********************/
/****************************************************/

  /********************* FIREBALL COLLISION ********************/

    var hitBall = game.physics.arcade.collide(player, fireBall);

    if (hitBall) {
    this.gameOverScore();
      console.log("death reason : hitBall");
    }

  /********************* STONE COLLISION ********************/

    //stone checkCollision
    game.physics.arcade.overlap(player, stonesPool, this.collectStone, null, this);

     //stones with platform collision
    for (var i = 0; i < stonesPool.children.length; i++) {
      //dont move overlapping platform if ledges start moving
      if (score < 20) {
        //ceck for every stone in the stones pool and move it if it overlaps
         stoneCheck = Game.physics.arcade.overlap(stonesPool.children[i],platformPool);
         if (stoneCheck) stonesPool.children[i].x = game.rnd.integerInRange(20, game.world.width - 20);
      }
    }

    //recreate stones when players y postion is past the last created stone
    if( player.y < stonesPool.children[stonesPool.children.length-3].y){
      this.generateStones();
    }


    /********************* PLATFORM COLLISION ********************/

    //platform Collision
    var hitPlatform = game.physics.arcade.collide(player, platformPool);


    /********************* SPRING COLLISION ********************/

    //spring Collision
    var hitSpring = game.physics.arcade.collide(player,spring);

    //if the player hits the spring
    if (hitSpring && player.body.touching.down) {
      //set the velocity to let the player jump higher
      player.body.velocity.y = -600;
      player.body.gravity.y = 400;
      springSound.play();
      //this.collapseSpring();
    }

    //spring-platform Collision
    var springLock = game.physics.arcade.collide(spring, platformPool, this.lockIt, null, this);


/************ REGENRATING LEDGES ********************/
/**************************************************/


    //foreachalive applies the function for each children of the group

    platformPool.forEachAlive(function(ledge){

        if( ledge.y >= game.camera.y+game.camera.height ){

          ledge.y -=  (600 + 50);

          ledge.x = game.rnd.integerInRange(0,3) * 75;
        }
            if (score > 100){

            ledge.body.velocity.setTo(50,0);
            game.world.wrap(ledge,ledge.width/2,false,true,false);
            ledge.body.collideWorldBounds = false;

            }

              if (score > 300 )
              {
              ledge.body.velocity.setTo(100,0) ;
              ledge.body.collideWorldBounds = false;
              game.world.wrap(ledge,0,false,true,false);

              }
              if (score > 500 )
              {

              ledge.body.velocity.setTo(200,0) ;
              ledge.body.collideWorldBounds = false;
              game.world.wrap(ledge,0,false,true,false);

              }

      },this);





/********************* MOVEMENT ********************/
/**************************************************/

     if (cursors.left.isDown)
     {
         //  Move to the left
        player.body.velocity.x = -250;
        player.animations.play('left');
     }
     else if (cursors.right.isDown)
     {
         //  Move to the right
         player.body.velocity.x = 250;
         player.animations.play('right');
     }
     else
     {
         player.body.velocity.x = 0;

     }
      //Allow the player to jump if they are touching the ground.
     if ( player.body.touching.down && (!hitSpring) && hitPlatform /*|| hitBase*/)
     {
         player.body.velocity.y = -300;
         player.body.gravity.y = 400;
          jump.play();
     }

     // wrap world coordinated so that you can warp from left to right and right to left
     game.world.wrap(player,0,true,true,false);

      // track the maximum amount that the player has travelled
      //math.abs gets the whole number, we deduct the starting y pos from the player .y to see how much it has travelled and later compare that
      //the last stored changinypos, and we set the changing y pos
      player.changingYPos = Math.max( player.changingYPos, Math.abs( player.y - player.startYPos) );

     //if the player falls in the fire game is over
     if (player.y > game.camera.y + game.camera.height || player.y > flames.y)
     {

       this.gameOverScore();
       console.log('death reason: burned ');
     }


     //call function to print updated score
     this.updateScore();


    },

    preRender: function() {

      //lock springs
      if (this.game.paused)
      { //  Because preRender still runs even if your game pauses!
        return;
      }

      if (this.locked) {
        spring.x += this.lockedTo.deltaX;
        spring.y = this.lockedTo.y - 17;
      }
    },

/********************* PLAYER & PLATFROMS & FIRE ********************/
/**************************************************/

    makeFire: function() {
      //flame animation
      flames = game.add.sprite(0, 400, 'flames');
      flames.scale.setTo(0.5);
      flames.animations.add('fire', [0,1,2], 3, true);
      flames.animations.play('fire');
      flames.fixedToCamera = true;
    },

    createPlayer: function(){
        player = game.add.sprite(platformPool.children[3].x +5, platformPool.children[3].y-100, 'hero');
        player.animations.add('right',[0,1,2,3,4,5,6,7,8,9],false);
        player.animations.add('left',[10,11,12,13,14,15,16,17,18,19],false);

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.anchor.setTo(0.5,0,5);
        player.scale.setTo(0.3,0.3);
        player.body.gravity.y = 400;
        player.body.collideWorldBounds = false;
        player.body.checkCollision.up = false;
        player.body.checkCollision.left = false;
        player.body.checkCollision.right = false;
        //starting y position
        player.startYPos = player.y ;
        //to keep track of players Y
        player.changingYPos = 0;
    },

    generatePlatforms: function(){
        //grouping the platforms
       platformPool = game.add.group();
       platformPool.enableBody = true;
       //creating 10

     for (var i= 0; i < 12; i++){
        var randomX =game.rnd.integerInRange(0, game.world.width -70 );
        var randomY = initialWorldHeight - 50 *i;
        ledge =  game.add.sprite(randomX,randomY,'base');
        platformPool.add(ledge);
        ledge.scale.setTo(0.09,0.09);

        ledge.body.immovable = true;
        ledge.width = 70;
     }
    },

/********************* SPRINGS ********************/
/**************************************************/

    //generate a spring on every 5th ledge
    generateSpring: function() {
      if (hitSpring == false) {
        //get platform coordinates
        x = platformPool.children[5].x + (platformPool.children[5].width/2) -10;
        y = platformPool.children[5].y -17;


        //add spring and scale it
        spring = game.add.sprite(x ,y ,'spring');
        spring.scale.setTo(.3);

        //enable body on spring and make them unmovable
        game.physics.arcade.enable(spring);
        spring.enableBody = true;
        spring.body.immovable = true;
      }
    },

    //lock springs function
    lockIt: function(spring, platform) {
      this.locked = true;
      this.lockedTo = platform;
      platform.springLocked = true;
    },


  /********************* STONES ********************/
  /**************************************************/

    //generate the stones to collect
    generateStones: function() {
     //create 20 stones
     stonesDistance = 0;

     for (var i = 0; i < 20; i++){
       //distance between the stones increases stone by stone
       stonesDistance -= 250;
       //generate x coordinates for stones with a margin of 20px to the side
       x = game.rnd.integerInRange(20, game.world.width - 20);
       //generate y coordinates for stones
       y = game.rnd.integerInRange(MaxCameraY, MaxCameraY + game.scale.maxHeight) + stonesDistance;

       //add stones to group and scale them
       redStone =  game.add.sprite(x,y,'stone_red');
       redStone.scale.setTo(0.15,0.15);
        stonesPool.add(redStone);
     }
    },

    //if player overlaps with stone remove the stone
    collectStone: function(player, redStone) {
      collect.play();
      score+=10;
      redStone.destroy();
    },

/********************* SCORE **********************/
/**************************************************/


    //print the score
    updateScore: function() {
        scoreText.destroy();
        scoreText = game.add.text(14, 8, "Score:"+score, {
            fontSize: "12px",
            fill: '#ea302b',
            align: "center",
            font: 'Press Start 2P'
        });
        scoreText.anchor.set(0, 0)
        scoreText.fixedToCamera = true;
    },



    gameOverScore: function(){
      //save the score if it is in top 5 highest
      for (var i = 0; i < topScores.length; i++) {
        if (score > topScores[i]) {
          topScores.splice(i, 0, score);
          topScores.pop();
          break;
        }
      }
      localStorage.topScores = JSON.stringify(topScores);
      this.state.start('gameover');
      bgMusic.stop();
    },




};
