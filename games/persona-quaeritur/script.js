

const persons = ["ego", "tu", "ille", "nos", "vos", "illi"];

const personLabels = {
    ego: "ego — 1ª persona singolare",
    tu: "tu — 2ª persona singolare",
    ille: "ille / illa — 3ª persona singolare",
    nos: "nos — 1ª persona plurale",
    vos: "vos — 2ª persona plurale",
    illi: "illi / illae — 3ª persona plurale"
};

let verbs = [];
let currentVerb = null;
let currentPerson = null;

const formEl = document.getElementById("form");
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
        formEl.textContent = "Errore";
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

    formEl.textContent = currentVerb.forms[currentPerson];
    answerEl.textContent = "";
}

function showAnswer() {
    if (!currentPerson) return;

    answerEl.textContent = personLabels[currentPerson];
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