const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highscore");

const gridSize = 15;
const tileCount = canvas.width / gridSize;

let snake = [{x: 10, y: 10}];
let apple = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem("snakeHighScore")) || 0;
let speed = 150;
let gameInterval;

highScoreDisplay.textContent = highScore;

function setDirection(x, y) {
  if ((dx === -x && dy === -y) || (dx === x && dy === y)) return;
  dx = x;
  dy = y;
}

function gameLoop() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    alert("Game Over! Skor: " + score);
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    score++;
    placeApple();
    updateScore();
    if (score % 5 === 0) {
      speedUp();
    }
  } else {
    snake.pop();
  }

  draw();
}

function resetGame() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
  score = 0;
  speed = 150;
  snake = [{x: 10, y: 10}];
  dx = dy = 0;
  placeApple();
  updateScore();
  gameInterval = setInterval(gameLoop, speed);
}

function placeApple() {
  let newApple;
  do {
    newApple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
  apple = newApple;
}

function updateScore() {
  scoreDisplay.textContent = score;
}

function speedUp() {
  clearInterval(gameInterval);
  speed = Math.max(50, speed - 10);
  gameInterval = setInterval(gameLoop, speed);
}

function draw() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
}

placeApple();
gameInterval = setInterval(gameLoop, speed);
