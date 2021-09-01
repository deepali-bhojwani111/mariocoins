var mario;
var platformGroup, obstacleGroup;
var marioAnimation, obstacleAnimation, wallAnimation, groundAnimation;
var flag;
var LOSE=0;
var PLAY=1;
var WIN=2;
var gameState=PLAY;
var coinGroup, coinImage;
//var obstaclesGroup, obstacle2, obstacle1, obstacle3;
var score = 0;
var life = 3;

var  restart;

localStorage["HighestScore"] = 0;
function preload()
{
  marioAnimation=loadAnimation("images/Capture1.png","images/Capture4.png","images/Capture3.png");
  obstacleAnimation=loadAnimation("images/obstacle1.png");
  wallAnimation=loadAnimation("images/wall.png");
  groundAnimation=loadAnimation("images/ground.png");  
  flagAnimation=loadAnimation("images/Flag.png");
  coinSound = loadSound("images/coin.wav");

  coinImage = loadImage("images/coin.png");
  restartImg = loadImage("images/restart.png");
}

function setup() {
  //Creating canvas equal to width and height of display
  createCanvas(displayWidth,668);
  var countDistanceX = 0;
  var platform;
  var gap;
  
  //creating a player mario
  mario = new Player();
  
  //creating a group
  platformGroup= createGroup();
  obstacleGroup=createGroup();
  //adding platforms to stand for mario
  for (var i=0;i<26;i++)
	 {
     frameRate(30);
      platform = new Platform(countDistanceX);
      platformGroup.add(platform.spt);//Adding each new platform to platformGroup
      gap=random([0,0,0,0,200]);//givin randome value to gap
      countDistanceX = countDistanceX + platform.spt.width + gap; //counting x location of next platform to be build
      //adding wall to the game
      if(i%3===0)
      {
      wall=new Wall(countDistanceX);
      platformGroup.add(wall.spt);
      }
      //adding obstacles to the game
      if(i%4==0)
      {
      obstacle=new Obstacle(countDistanceX);
      obstacleGroup.add(obstacle.spt);
      }
  }
  flag=createSprite(countDistanceX-150,height-320);
  flag.addAnimation("flagimg",flagAnimation);
  flag.scale=0.09;
  flag.setCollider("rectangle",0,0,1100,6520);
  restart = createSprite(100, 150);
  restart.addImage(restartImg);

  restart.scale = 0.5;

  restart.visible = false;

  coinGroup = new Group();
  score = 0;
}

function draw() {
  background('skyblue');
  stroke("red");
  textSize(15);
  fill("blue");
  text("Score: " + score, 500, 40);
  stroke("red");
  textSize(15);
  fill("black");
  
  text("Life: " + life, 500, 60);
  fill("blue")

  //code to move the camera
  translate(  -mario.spt.x + width/2 , 0);
  if(gameState==PLAY)//Play state
  {  
       //changing the game states
       if(obstacleGroup.isTouching(mario.spt) || mario.spt.y>height)
       {  
         gameState=LOSE;
       } 
    
       if(flag.isTouching(mario.spt))
       {
          gameState=WIN;
       }
       //apply gravity to mario and set colliding with platforms
        mario.applyGravity();
        mario.spt.collide(platformGroup);
        
        //Calling various function to controll mario
        if (keyDown("left"))  
        { 
          mario.moveLeft();
        }
        if (keyDown("right")) 
        { 
          mario.moveRight();
        }
        if (keyDown("up") && mario.spt.velocityY===0) 
        {
          mario.jump();
        }


   }

  if(gameState==LOSE)//END State
  {  
    restart.visible = true;
     text("restart", 280,170 );
    stroke("red");
    fill("red");
    textSize(40);
    text("GAME OVER",mario.spt.x,300);
    obstacleGroup.destroyEach();
    mario.spt.setVelocity(0,0);
    mario.spt.pause();
    coinGroup.setVelocityXEach(0);
    coinGroup.setLifetimeEach(-1);

    if (mousePressedOver(restart)) {
      if (life > 0) {
        reset();
      }
    
  }
  }
  if(gameState==WIN)//WIN state
  {  
    stroke("green");
    fill("green");
    textSize(40);
    text("Winner",mario.spt.x,300);
    obstacleGroup.destroyEach();
    mario.spt.setVelocity(0,0);
    mario.spt.pause();

    if (obstaclesGroup.isTouching(mario.spt)) {
      life = life - 1;
      gameState = LOSE;
      
    }
    if (coinGroup.isTouching(mario.spt)) {
      score = score + 1;
      coinSound.play();
      
     coinGroup[0].destroy();
      
    }
  }
  spawnCoin();

   drawSprites();
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600, 120, 40, 10);
    coin.y = Math.round(random(80, 120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;

    //assign lifetime to the variable
    coin.lifetime = 200;

    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;

    //add each cloud to the group
    coinGroup.add(coin);
  }

}
function reset() {

  gameState = PLAY;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();

  //mario.changeAnimation("running", mario_running);
  mario.scale = 0.5;

  if (localStorage["HighestScore"] < score) {
    localStorage["HighestScore"] = score;
  }

  score = 0;
 
}


