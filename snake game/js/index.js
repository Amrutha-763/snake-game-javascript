const board = document.getElementById("board");
let direction = { x: 0, y: 0 };
let speed = 7;
let lastPaintTime = 0;

let snakeArr = [{ x: 9, y: 9 }];
let food = { x: 5, y: 5 };
let foodSound, moveSound, gameOverSound, bgSound;
let soundsReady = false;
let audioContext;
function initSounds() {
    if (soundsReady) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    foodSound = new Audio("../nahtt-eat-323883.mp3");
    moveSound = new Audio("../turn.mp3");
    gameOverSound = new Audio("../gameover.mp3");
    bgSound = new Audio("../background.mp3");

    bgSound.loop = true;
    bgSound.volume = 0.4;

    audioContext.resume().then(() => {
        bgSound.play().catch(() => {});
    });

    soundsReady = true;
}

// 🔥 REQUIRED: USER CLICK TO ENABLE AUDIO
window.addEventListener("click", () => {
    initSounds();
}, { once: true });
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}
function isCollide(snake) {
    // Wall collision
    if (
        snake[0].x <= 0 ||
        snake[0].x > 18 ||
        snake[0].y <= 0 ||
        snake[0].y > 18
    ) return true;

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (
            snake[i].x === snake[0].x &&
            snake[i].y === snake[0].y
        ) return true;
    }
    return false;
}
function gameEngine() {

    // GAME OVER
    if (isCollide(snakeArr)) {
        if (gameOverSound) gameOverSound.play();
        if (bgSound) bgSound.pause();

        direction = { x: 0, y: 0 };
        alert("Game Over! Press OK to restart");

        snakeArr = [{ x: 9, y: 9 }];
        food = {
            x: Math.floor(Math.random() * 18) + 1,
            y: Math.floor(Math.random() * 18) + 1
        };

        if (bgSound) bgSound.play();
        return;
    }

    // FOOD EAT
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        if (foodSound) foodSound.play();

        snakeArr.unshift({
            x: snakeArr[0].x + direction.x,
            y: snakeArr[0].y + direction.y
        });

        food = {
            x: Math.floor(Math.random() * 18) + 1,
            y: Math.floor(Math.random() * 18) + 1
        };
    }

    // MOVE SNAKE
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += direction.x;
    snakeArr[0].y += direction.y;

    // DRAW
    board.innerHTML = "";

    // DRAW SNAKE
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });

    // DRAW FOOD
    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}
window.addEventListener("keydown", e => {
    if (moveSound) moveSound.play();

    switch (e.key) {
        case "ArrowUp":
            direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            direction = { x: 1, y: 0 };
            break;
    }
});
window.requestAnimationFrame(main);
