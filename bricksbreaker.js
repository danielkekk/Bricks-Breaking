var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var dx = -1;
var dy = -2;
var ballRadius = 10;
var colorOfBall = "#0095DD";
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
var score = 0;
    
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function randomHexColor() {
    var n = 6, s = '#';
    while(n--){
        s += (Math.random() * 16 | 0).toString(16);
    }
    return s;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = colorOfBall;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
			/*Csak akkor rajzoljuk ki a téglát ha még nem lett kilőve*/
            if(bricks[c][r].status == 1) { 
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
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

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
			/*Ha a tégla még nem lett eltalálva (status==1) akkor minden téglánál megvizsgáljuk, hogy éppen ütközik-e*/
            if(b.status == 1) {
				/*A labda közepét vizsgáljuk, hogy beleesik-e a tégla által elfoglalt területbe*/
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;	
					score++; //pontszám
                    if(score == brickRowCount*brickColumnCount) { //ha a pontszám egyenlő a a téglák számával vége a játéknak
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

/*Game loop*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
	drawScore();
	collisionDetection(); //TODO: csak akkor érdemes ellenőrizni ha a labda y értéke egy szint alá megy...
    
    /*Ütközés detektálás: ha elér a canvas széleihez ellentétes irányra váltunk*/
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
        colorOfBall = randomHexColor();
    }
    
    if(y + dy < ballRadius) {
        dy = -dy;
        colorOfBall = randomHexColor();
    }
    else if(y + dy > canvas.height-ballRadius) {
        /*Ha ütközik a paddle-val visszapattan ha a talajjal ütközik game over*/
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            alert("GAME OVER");
            document.location.reload();
        }
    }
    
    /*Ha jobb/bal nyíl le van nyomva és nem ért el a széléhez a paddle akkor mozgatjuk*/
    if(rightPressed === true && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed === true && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
}

setInterval(draw, 10);