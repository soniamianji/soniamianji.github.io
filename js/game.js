//global variables

var player, platfroms, ground,background,cursors, ledge,MaxCameraY,platformPool,yStorage,base,
 spring, spring_collapsed, stonesPool,flames,jump, collect, spring,fallInTheFire,bgMusic;
var hitSpring = false;
MaxCameraY = 0;

var Game = {

    preload: function(){
        game.load.spritesheet('trump','./assets/images/finaltrump.png', 290,416,12);
        game.load.spritesheet('flames', './assets/images/flames_sprite.png', 600, 221, 3);
        game.load.image('base', './assets/images/base.png');
        game.load.image('spring', './assets/images/spring.png');
        game.load.image('spring_collapsed', './assets/images/spring_collapsed.png');
        game.load.image('stone_red', './assets/images/stone_red.png');
        game.load.audio('jump', './assets/sounds/jump.mp3');
        game.load.audio('collect', './assets/sounds/collect.mp3');
        game.load.audio('springSound', './assets/sounds/springSound.mp3');
        game.load.audio('bgMusic', './assets/sounds/bgMusic.mp3');


    },

    create: function(){
        //bg color
        game.stage.backgroundColor = "#e8c11c";
        jump = game.add.audio('jump');
        collect = game.add.audio('collect');
        springSound = game.add.audio('springSound');
        bgMusic = game.add.audio('bgMusic');
        bgMusic.play();

        //scaling options
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.maxWidth = this.game.width;
        game.scale.maxHeight = this.game.height;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

          //physic enabled
        game.physics.startSystem(Phaser.Physics.ARCADE);
        this.generatePlatforms();
        this.createPlayer();

        //createStones
        this.generateStones();

        flames = game.add.sprite(0, 400, 'flames');
        flames.scale.setTo(0.5);
        flames.animations.add('fire', [0,1,2], 3, true);
        flames.animations.play('fire');
        flames.fixedToCamera = true;

         //  Our controls.
         cursors = game.input.keyboard.createCursorKeys();
        },



    update: function(){

      //generate Springs
      this.generateSpring();

         //setBounds(x, y, width, height)
            //Updates the size of this world and sets World.x/y to the given values
            // The Camera bounds and Physics bounds (if set) are also updated to match the new World bounds.
            // the y  and the height of the world are adjusted
            // the higher the player goes the height of the world expands
    game.world.setBounds(0 ,-player.changingYPos,game.world.width  , game.world.height + player.changingYpos);

        //the distance between camera.y and the hero
    game.camera.y = player.y - 200;

        //this is how we store camera.y value to maxcameraY
    if (game.camera.y < MaxCameraY)
    {
        MaxCameraY = game.camera.y;
    }

        //if players y coordinate becomes more that the cameraslimit camera wont follow. this is how the camera would always go up
    if(Math.abs(player.y - MaxCameraY) > 0)
    {
        game.camera.y = MaxCameraY;

    }
    //stone checkCollision
    var hitStone = 	game.physics.arcade.overlap(player, stonesPool, this.collectStone, null, this);
    if (hitStone)
    {
        collect.play();
    }

    //platform Collision
    var hitPlatform = game.physics.arcade.collide(player, platformPool);


    //fire collosion
    fallInTheFire = game.physics.arcade.collide(player,flames);

    //spring Collision
    var hitSpring = game.physics.arcade.collide(player,spring);

    //if the player hits the spring
    if (hitSpring) {
      //set the velocity to let the player jump higher
      player.body.velocity.y = -600;
      player.body.gravity.y = 400;
      springSound.play();
      //this.collapseSpring();
    };

    //stones with platform collision
    for (var i = 0; i < stonesPool.children.length; i++) {
      //ceck for every stone in the stones pool and move it if it overlaps
       stoneCheck = Game.physics.arcade.overlap(stonesPool.children[i],platformPool);
       if (stoneCheck) stonesPool.children[i].x = game.rnd.integerInRange(20, game.world.width - 20);
    };

    //foreachalive applies the function for each children of the group
    platformPool.forEachAlive(function(ledge){
        if( ledge.y >= game.camera.y+game.camera.height){

            yStorage = ledge.y - 600;

            ledge.x = game.rnd.integerInRange(0, game.world.width -50);
            ledge.y = yStorage ;

     } },this);

     //recreate stones when players y postion is past the fourth last created stone
    if( player.y < stonesPool.children[stonesPool.children.length-3].y){
      this.generateStones();
    }


     //movement
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
         player.body.gravity.y = 300;
           jump.play();

     }

     // wrap world coordinated so that you can warp from left to right and right to left
     game.world.wrap(player,0,true,true,false);

      // track the maximum amount that the player has travelled
      //math.abs gets the whole number, we deduct the starting y pos from the player .y to see how much it has travelled and later compare that
      //the last stored changinypos, and we set the changing y pos
      player.changingYPos = Math.max( player.changingYPos, Math.abs( player.y - player.startYPos) );

     if (player.y > game.camera.y + game.camera.height || fallInTheFire)
     {
         //gameOver
         this.state.start('gameover');
         bgMusic.stop();

     }
    },

    createPlayer: function(){
        player = game.add.sprite(game.world.centerX, game.world.height - 300, 'trump');
        player.animations.add('right',[2,3],false);
        player.animations.add('left',[9,8],false);

        //  We need to enable physics on the player
        game.physics.arcade.enable(player);
        player.anchor.setTo(0.5,0,5);
        player.scale.setTo(0.2,0.2);
        player.body.gravity.y = 300;
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
     for (var i= 0; i < 10; i++){
        var randomX =game.rnd.integerInRange(0, game.world.width -50);
        var randomY = game.world.height -100 *i;
        ledge =  game.add.sprite(randomX,randomY,'base');
        platformPool.add(ledge);
        ledge.scale.setTo(0.1,0.1);
        ledge.body.immovable = true;
        ledge.width =50;
     }

    },

    //generate a spring on every 5th ledge
    generateSpring: function() {
      if (hitSpring == false) {
        //get platform coordinates
        x = platformPool.children[5].x + 15;
        y = platformPool.children[5].y -22;

        //add spring and scale it
        spring = game.add.sprite(x ,y ,'spring');
        spring.scale.setTo(.4);

        //enable body on spring
        game.physics.arcade.enable(spring);
        spring.enableBody = true;
      }

    },

    //collapse the spring when player hits it
    collapseSpring: function() {
      y = platformPool.children[5].y -13;
      x = platformPool.children[5].x + 15;
      spring.destroy();
      spring = game.add.sprite(x ,y ,'spring_collapsed');
      spring.scale.x = .4;
      spring.scale.y = .4;
    },

    //generate the stones to collect
    generateStones: function() {

    //grouping the stones
     stonesPool = game.add.group();
     //enableing physics on them
     game.physics.arcade.enable(stonesPool);
     stonesPool.enableBody = true;

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
       redStone.scale.setTo(0.3,0.3);
       //add to group
        stonesPool.add(redStone);

     }
    },

    //if player overlaps with stone remove the stone
    collectStone: function(player, redStone) {
      redStone.kill();
    }

  };
