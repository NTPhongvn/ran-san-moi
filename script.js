const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 20;

// Lấy high score từ bộ nhớ
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("score").innerText = 0;

let score = 0;
let speed = 150;
let game;
let paused = false;

// Rắn
let snake = [{ x: 9 * box, y: 10 * box }];
let direction = "RIGHT";

// Mồi
let food = randomFood();

// Điều khiển
document.addEventListener("keydown", control);

function control(e) {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";

    // Pause
    if (e.key === " ") {
        paused = !paused;
    }
}

// Game loop
function draw() {
    if (paused) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ rắn
    snake.forEach((part, i) => {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(part.x, part.y, box, box);
    });

    // Vẽ mồi
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    // Ăn mồi
    if (headX === food.x && headY === food.y) {
        score++;
        document.getElementById("score").innerText = score;

        // Tăng tốc
        speed = Math.max(60, speed - 5);
        resetGameLoop();

        food = randomFood();
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // Game Over
    if (
        headX < 0 || headY < 0 ||
        headX >= canvas.width || headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        if (score > highScore) {
            localStorage.setItem("highScore", score);
            alert("🎉 Kỷ lục mới: " + score);
        } else {
            alert("💀 Game Over!");
        }
        clearInterval(game);
    }

    snake.unshift(newHead);
}

// Kiểm tra va chạm
function collision(head, body) {
    return body.some(part => part.x === head.x && part.y === head.y);
}

// Random mồi
function randomFood() {
    return {
        x: Math.floor(Math.random() * 19) * box,
        y: Math.floor(Math.random() * 19) * box
    };
}

// Restart game
function restart() {
    location.reload();
}

// Reset vòng lặp khi tăng tốc
function resetGameLoop() {
    clearInterval(game);
    game = setInterval(draw, speed);
}

// Start game
game = setInterval(draw, speed);
let startX, startY;

canvas.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;

    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "LEFT") direction = "RIGHT";
        else if (dx < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (dy > 0 && direction !== "UP") direction = "DOWN";
        else if (dy < 0 && direction !== "DOWN") direction = "UP";
    }
});
