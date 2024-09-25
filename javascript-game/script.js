// Get game elements
const character = document.getElementById('character');
const gameArea = document.getElementById('gameArea');
const goal = document.getElementById('goal');
const obstacle1 = document.getElementById('obstacle1');
const obstacle2 = document.getElementById('obstacle2');
const message = document.getElementById('message');
const restartButton = document.getElementById('restartButton');

// Define character's initial position and speed
let characterX = 230; // Starting on the middle
let characterY = 360; // Starting from the bottom
let speed = 10;

// Obstacle movement settings
let obstacle1X = 100; // Positioned ahead
let obstacle2X = 200;
let obstacleSpeed1 = 2;  // Faster speed for obstacle 1
let obstacleSpeed2 = 2.5;  // Faster speed for obstacle 2

// Function to reset the game state
function resetGame() {
    characterX = 230; // Reset to the starting position
    characterY = 360;
    obstacle1X = 100;
    obstacle2X = 450;
    obstacleSpeed1 = 2;
    obstacleSpeed2 = 2.5;
    message.textContent = '';
    restartButton.style.display = 'none';
    gameLoop();
}

// Function to detect collision between two elements
function isColliding(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Game over function
function gameOver() {
    message.textContent = 'Game Over! You hit an obstacle.';
    restartButton.style.display = 'inline';
    restartButton.onclick = resetGame;
    cancelAnimationFrame(animationFrameId);  // Stop the game loop
}

// Function to update the game state
function updateGame() {
    // Move obstacles back and forth
    obstacle1X += obstacleSpeed1;
    obstacle2X -= obstacleSpeed2;

    // Reverse direction when obstacles hit the walls
    if (obstacle1X <= 0 || obstacle1X >= gameArea.offsetWidth - obstacle1.offsetWidth) {
        obstacleSpeed1 *= -1;
    }
    if (obstacle2X <= 0 || obstacle2X >= gameArea.offsetWidth - obstacle2.offsetWidth) {
        obstacleSpeed2 *= -1;
    }

    // Update obstacle positions
    obstacle1.style.left = obstacle1X + 'px';
    obstacle2.style.left = obstacle2X + 'px';

    // Check for collision with obstacles
    if (isColliding(character, obstacle1) || isColliding(character, obstacle2)) {
        gameOver();
    }

    // Check if player reached the goal
    if (isColliding(character, goal)) {
        message.textContent = 'You Win! You reached the goal.';
        restartButton.style.display = 'inline';
        restartButton.onclick = resetGame;
        cancelAnimationFrame(animationFrameId);  // Stop the game loop
    }

    // Update character's position
    character.style.left = characterX + 'px';
    character.style.top = characterY + 'px';
}

// Handle character movement with arrow keys
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        characterY -= speed;
    }
    if (event.key === 'ArrowDown') {
        characterY += speed;
    }
    if (event.key === 'ArrowLeft') {
        characterX -= speed;
    }
    if (event.key === 'ArrowRight') {
        characterX += speed;
    }

    // Ensure the character stays within game area bounds
    if (characterX < 0) characterX = 0;
    if (characterX > gameArea.offsetWidth - character.offsetWidth) {
        characterX = gameArea.offsetWidth - character.offsetWidth;
    }
    if (characterY < 0) characterY = 0;
    if (characterY > gameArea.offsetHeight - character.offsetHeight) {
        characterY = gameArea.offsetHeight - character.offsetHeight;
    }
});

// Game loop for continuous updates
let animationFrameId;
function gameLoop() {
    updateGame();
    animationFrameId = requestAnimationFrame(gameLoop);  // Continue the game loop
}

// Start the game
resetGame();