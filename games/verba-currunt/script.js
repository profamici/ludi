const persons = ["ego", "tu", "ille", "nos", "vos", "illi"];

let verbs = [];
let currentVerb = null;
let currentPerson = null;

const verbEl = document.getElementById("verb");
const personEl = document.getElementById("person");
const answerEl = document.getElementById("answer");

async function loadVerbs() {
    try {
        const response = await fetch("../../data/verbs-present.json");
        if (!response.ok) {
            throw new Error("Errore nel caricamento del file JSON");
        }

        verbs = await response.json();
        newQuestion();
    } catch (error) {
        verbEl.textContent = "Errore";
        personEl.textContent = "—";
        answerEl.textContent = "Impossibile caricare il dataset dei verbi.";
        console.error(error);
    }
}

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
    if (!verbs.length) return;

    currentVerb = randomItem(verbs);
    currentPerson = randomItem(persons);

    verbEl.textContent = currentVerb.infinitive;
    personEl.textContent = currentPerson;
    answerEl.textContent = "";
}

function showAnswer() {
    if (!currentVerb || !currentPerson) return;

    answerEl.textContent = currentVerb.forms[currentPerson];
}


document.addEventListener("keydown", (event) => {
    if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        showAnswer();
    }

    if (event.key === "ArrowRight" || event.key === "n" || event.key === "N") {
        event.preventDefault();
        newQuestion();
    }
});

loadVerbs();