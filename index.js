var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var xCoordinateOfArc = canvas.width/2;
var yCoordinateOfArc = canvas.height - 20;
var radiusOfArc = 10;
var startAngle = 0;
var endAngle = Math.PI*2;
var changeXCoordinateOfArc = 2;
var changeYCoordinateOfArc = -2;

var paddleHeight = 10;
var paddleWidth = 75;
var xCoordinateOfPaddle = (canvas.width - paddleWidth) / 2;
var yCoordinateOfPaddle = canvas.height - paddleHeight

var rightArrowKeyPressed = false;
var leftArrowKeyPressed = false;

var brickRowCount = 4;
var brickColumnCount = 9;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var bricks = [];
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

var everyTenMilliSeconds = 10;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightArrowKeyPressed = true;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftArrowKeyPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight"){
        rightArrowKeyPressed = false;
    }else if(e.key == "Left" || e.key == "ArrowLeft"){
        leftArrowKeyPressed = false;
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "##f70a0a";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "##f70a0a";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function collisionDetection(){
    for(var c = 0; c < brickColumnCount; c++){
        for(var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1){
                if(xCoordinateOfArc > b.x && xCoordinateOfArc < b.x + brickWidth && yCoordinateOfArc > b.y && yCoordinateOfArc < b.y + brickHeight){
                    changeYCoordinateOfArc = -changeYCoordinateOfArc;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(xCoordinateOfPaddle, yCoordinateOfPaddle, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBall(){
    ctx.beginPath();
    // by default, the arc will be drawn in clockwise direction
    ctx.arc(xCoordinateOfArc, yCoordinateOfArc, radiusOfArc, startAngle, endAngle);
    ctx.fillStyle = "#0095DD"; 
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawScore();
    drawLives();

    // collision detection 
    if(xCoordinateOfArc + changeXCoordinateOfArc > canvas.width - radiusOfArc || xCoordinateOfArc + changeXCoordinateOfArc < radiusOfArc){
        changeXCoordinateOfArc = -changeXCoordinateOfArc;
    }

    if(yCoordinateOfArc + changeYCoordinateOfArc < radiusOfArc){
        changeYCoordinateOfArc = -changeYCoordinateOfArc;
    }else if(yCoordinateOfArc + changeYCoordinateOfArc > canvas.height - radiusOfArc){
        if(xCoordinateOfArc > xCoordinateOfPaddle && xCoordinateOfArc < xCoordinateOfPaddle + paddleWidth){
            changeYCoordinateOfArc = -changeYCoordinateOfArc;
        }else{
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                xCoordinateOfArc = canvas.width/2;
                yCoordinateOfArc = canvas.height-30;
                changeXCoordinateOfArc = 2;
                changeYCoordinateOfArc = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    // logic for paddle, it should not move from the canvas width
    if(rightArrowKeyPressed) {
        xCoordinateOfPaddle += 7;
        if (xCoordinateOfPaddle + paddleWidth > canvas.width){
            xCoordinateOfPaddle = canvas.width - paddleWidth;
        }
    }
    else if(leftArrowKeyPressed) {
        xCoordinateOfPaddle -= 7;
        if (xCoordinateOfPaddle < 0){
            xCoordinateOfPaddle = 0;
        }
    }

    // every frame, update x,y coordinates of the ball so that it moves
    xCoordinateOfArc += changeXCoordinateOfArc;
    yCoordinateOfArc += changeYCoordinateOfArc;

    requestAnimationFrame(draw);
}

// call draw() every 10 milliseconds, this creates an illusion that the ball is moving
draw();
