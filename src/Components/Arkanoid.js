const React = require('react');
const Paper = require('material-ui/Paper');
const RaisedButton = require('material-ui/RaisedButton');

const Invaders = React.createClass({

    displayName: 'Invaders',

    propTypes: {
        onFinishGame: React.PropTypes.func.isRequired
    },

    getInitialState: function () {
        return {
            endGame: false,
            won: false,
            lost: false
        };
    },

    componentDidMount: function () {
        this.drawTheGame();
    },

    componentWillUnmount: function () {
        document.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("keyup", keyUpHandler);
    },

    componentWillUpdate: function (nextProps, nextState) {
        if(!nextState.endGame) {
            const self = this;
            setTimeout(function () {
                self.drawTheGame();
            }, 1);
        }
    },

    drawTheGame: function () {
        const self = this;
        var canvas = this.refs.myCanvas;
        var ctx = canvas.getContext("2d");
        var ballRadius = 10;
        var x = canvas.width / 2;
        var y = canvas.height - 30;
        var dx = 2;
        var dy = -2;
        var paddleHeight = 10;
        var paddleWidth = 75;
        var paddleX = (canvas.width - paddleWidth) / 2;
        var rightPressed = false;
        var leftPressed = false;
        var brickRowCount = 5;
        var brickColumnCount = 3;
        var brickWidth = 75;
        var brickHeight = 20;
        var brickPadding = 10;
        var brickOffsetTop = 30;
        var brickOffsetLeft = 30;
        var score = 0;
        var lives = 3;
        var bricks = [];
        for(var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for(var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }

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

        function collisionDetection() {
            for(c = 0; c < brickColumnCount; c++) {
                for(r = 0; r < brickRowCount; r++) {
                    var b = bricks[c][r];
                    if(b.status == 1) {
                        if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                            dy = -dy;
                            b.status = 0;
                            score++;
                            if(score == brickRowCount * brickColumnCount) {
                                self.setState({
                                    won: true,
                                    lost: false,
                                    endGame: true
                                });
                            }
                        }
                    }
                }
            }
        }
        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
        function drawPaddle() {
            ctx.beginPath();
            ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
        function drawBricks() {
            for(c = 0; c < brickColumnCount; c++) {
                for(r = 0; r < brickRowCount; r++) {
                    if(bricks[c][r].status == 1) {
                        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
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
        function drawScore() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Score: " + score, 8, 20);
        }
        function drawLives() {
            ctx.font = "16px Arial";
            ctx.fillStyle = "#0095DD";
            ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBricks();
            drawBall();
            drawPaddle();
            drawScore();
            drawLives();
            collisionDetection();
            if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
            }
            if(y + dy < ballRadius) {
                dy = -dy;
            }
            else if(y + dy > canvas.height - ballRadius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    dy = -dy;
                }
                else {
                    lives--;
                    if(!lives) {
                        self.setState({
                            won: false,
                            lost: true,
                            endGame: true
                        });
                    }
                    else {
                        x = canvas.width / 2;
                        y = canvas.height - 30;
                        dx = 3;
                        dy = -3;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                }
            }
            if(rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            }
            else if(leftPressed && paddleX > 0) {
                paddleX -= 7;
            }
            x += dx;
            y += dy;

            if(!self.state.endGame) {
                requestAnimationFrame(draw);
            }
        }
        draw();

    },

    render: function () {
        var containerStyles = {
            padding: "5px",
            boxShadow: "rgba(0, 0, 0, 0.117647) 0 1px 6px, rgba(0, 0, 0, 0.117647) 0 1px 4px"
        };

        return (
            <div>
                {!this.state.endGame && <canvas ref="myCanvas" width="480" height="320" style={containerStyles} />}
                {this.state.endGame && this.drawConfirmation()}
            </div>
        );
    },

    drawConfirmation: function () {
        var label = this.state.lost ? ":( Not a good result at all" : "You won! Congratulations!";
        const style = {
            height: 200,
            width: 350,
            margin: 10,
            textAlign: 'center',
            display: 'inline-block'
        };

        const style2 = {
            margin: 12
        };

        return (
            <Paper style={style} zDepth={3} >
                <p>{label}</p><br/>
                <RaisedButton label="Play again" style={style2} onClick={this.playAgain} primary/>
                <RaisedButton label="End game" style={style2} onClick={this.props.onFinishGame}/>
            </Paper>
        );
    },

    playAgain: function () {
        this.setState({
            endGame: false,
            won: false,
            lost: false
        });
    }

});

module.exports = Invaders;
