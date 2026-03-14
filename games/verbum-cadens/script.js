const persons = ["ego", "tu", "ille", "nos", "vos", "illi"];
const BASE_SPEED = 0.85;
const SPEED_STEP = 0.18;
const POINTS_PER_LEVEL = 5;
const MAX_SPEED = 2.3;
const FEEDBACK_DURATION = 450;
let feedbackTimeout = null;

let verbs = [];
let currentVerb = null;
let currentPerson = null;
let score = 0;
let lives = 3;
let fallingY = 0;
let gameRunning = false;
let animationId = null;
let currentLevel = 1;

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const fallingWordEl = document.getElementById("falling-word");
const gameAreaEl = document.getElementById("game-area");
const personButtons = document.querySelectorAll(".persons button");

async function loadVerbs() {
    try {
        const response = await fetch("../../data/verbs-present.json");
        if (!response.ok) {
            throw new Error("Errore nel caricamento del file JSON");
        }

        verbs = await response.json();
        resetWord();
    } catch (error) {
        fallingWordEl.textContent = "Errore";
        console.error(error);
    }
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function updateHud() {
    scoreEl.textContent = score;
    livesEl.textContent = lives;
}

function updateLevelDisplay() {
    if (!levelEl) return;
    levelEl.textContent = currentLevel;
}

function showFeedback(type, button = null) {
    if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
    }

    fallingWordEl.style.transition = "color 0.15s ease, transform 0.15s ease";

    if (type === "correct") {
        fallingWordEl.style.color = "#1f7a1f";
        fallingWordEl.style.transform = "translateX(-50%) scale(1.12)";
    } else {
        fallingWordEl.style.color = "#a11d1d";
        fallingWordEl.style.transform = "translateX(-50%) scale(0.92)";
    }

    if (button) {
        button.style.transition = "background-color 0.15s ease, transform 0.15s ease";
        button.style.backgroundColor = type === "correct" ? "#2e8b57" : "#b22222";
        button.style.transform = "scale(1.05)";
    }

    feedbackTimeout = setTimeout(() => {
        fallingWordEl.style.color = "#2d1b0e";
        fallingWordEl.style.transform = "translateX(-50%) scale(1)";

        if (button) {
            button.style.backgroundColor = "#8b5a2b";
            button.style.transform = "scale(1)";
        }
    }, FEEDBACK_DURATION);
}

function resetWord() {
    if (!verbs.length) return;

    currentVerb = randomItem(verbs);
    currentPerson = randomItem(persons);
    fallingY = 0;

    fallingWordEl.textContent = currentVerb.forms[currentPerson];
    fallingWordEl.style.top = "0px";
    fallingWordEl.style.color = "#2d1b0e";
    fallingWordEl.style.transform = "translateX(-50%) scale(1)";
}

function gameLoop() {
    if (!gameRunning) return;

    currentLevel = Math.floor(score / POINTS_PER_LEVEL) + 1;
    const currentSpeed = Math.min(BASE_SPEED + (currentLevel - 1) * SPEED_STEP, MAX_SPEED);
    fallingY += currentSpeed;
    fallingWordEl.style.top = `${fallingY}px`;

    const limit = gameAreaEl.clientHeight - fallingWordEl.offsetHeight - 10;
    updateLevelDisplay();

    if (fallingY >= limit) {
        lives -= 1;
        updateHud();

        if (lives <= 0) {
            endGame();
            return;
        }

        resetWord();
    }

    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    if (!verbs.length) return;
    if (gameRunning) return;

    gameRunning = true;
    animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    fallingWordEl.textContent = "Finis!";
    updateLevelDisplay();
}

function resetGame() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    score = 0;
    lives = 3;
    currentLevel = 1;
    updateHud();
    updateLevelDisplay();
    resetWord();
}

personButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!gameRunning) return;
        gameRunning = false;

        const selectedPerson = button.dataset.person;

        if (selectedPerson === currentPerson) {
            score += 1;
            updateHud();
            showFeedback("correct", button);
            setTimeout(resetWord, FEEDBACK_DURATION);
            setTimeout(() => { gameRunning = true; animationId = requestAnimationFrame(gameLoop); }, FEEDBACK_DURATION);
        } else {
            lives -= 1;
            updateHud();
            showFeedback("wrong", button);

            if (lives <= 0) {
                setTimeout(endGame, FEEDBACK_DURATION);
                return;
            }

            setTimeout(resetWord, FEEDBACK_DURATION);
            setTimeout(() => { gameRunning = true; animationId = requestAnimationFrame(gameLoop); }, FEEDBACK_DURATION);
        }
    });
});

updateHud();
updateLevelDisplay();
loadVerbs();