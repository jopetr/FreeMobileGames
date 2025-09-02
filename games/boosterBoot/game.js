const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let boot = {
  x: 80,
  y: canvas.height / 2,
  width: 40,
  height: 40,
  velocity: 0,
  gravity: 0.5,
  thrust: -8
};

let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Handle input (tap/click/space)
function boost() {
  if (!gameOver) {
    boot.velocity = boot.thrust;
  } else {
    resetGame();
  }
}
document.addEventListener("touchstart", boost);
document.addEventListener("mousedown", boost);
document.addEventListener("keydown", e => {
  if (e.code === "Space") boost();
});

function resetGame() {
  boot.y = canvas.height / 2;
  boot.velocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
}

function drawBoot() {
  ctx.fillStyle = "orange";
  ctx.fillRect(boot.x, boot.y, boot.width, boot.height);

  // Flame effect
  if (boot.velocity < 0) {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(boot.x + boot.width / 2 - 5, boot.y + boot.height);
    ctx.lineTo(boot.x + boot.width / 2 + 5, boot.y + boot.height);
    ctx.lineTo(boot.x + boot.width / 2, boot.y + boot.height + 20);
    ctx.fill();
  }
}

function drawPipes() {
  ctx.fillStyle = "#0f0";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  });
}

function update() {
  if (gameOver) return;

  frame++;

  // Boot physics
  boot.velocity += boot.gravity;
  boot.y += boot.velocity;

  // Add pipes
  if (frame % 90 === 0) {
    let gap = 180;
    let top = Math.random() * (canvas.height - gap - 100) + 50;
    pipes.push({
      x: canvas.width,
      width: 60,
      top: top,
      bottom: canvas.height - top - gap
    });
  }

  // Move pipes
  pipes.forEach(p => (p.x -= 3));

  // Remove old pipes
  pipes = pipes.filter(p => p.x + p.width > 0);

  // Collision detection
  for (let p of pipes) {
    if (
      boot.x < p.x + p.width &&
      boot.x + boot.width > p.x &&
      (boot.y < p.top || boot.y + boot.height > canvas.height - p.bottom)
    ) {
      gameOver = true;
    }
  }

  // Check ground/ceiling
  if (boot.y + boot.height > canvas.height || boot.y < 0) {
    gameOver = true;
  }

  // Score
  pipes.forEach(p => {
    if (!p.passed && p.x + p.width < boot.x) {
      score++;
      p.passed = true;
    }
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBoot();
  drawPipes();
  drawScore();

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Tap to Restart", canvas.width / 2 - 60, canvas.height / 2 + 40);
  } else {
    update();
  }

  requestAnimationFrame(loop);
}
loop();
