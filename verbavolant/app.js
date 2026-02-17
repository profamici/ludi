// Verba volant — Ludi
// Estrazione parole senza ripetizioni + gestione elenco + fullscreen

let words = [];
let remaining = [];

const elWord = document.getElementById("word");
const elSub = document.getElementById("sub");
const elRemaining = document.getElementById("remaining");
const elTotal = document.getElementById("total");
const elInput = document.getElementById("wordsInput");
const elMsg = document.getElementById("msg");

const btnExtract = document.getElementById("btnExtract");
const btnReset = document.getElementById("btnReset");
const btnFullscreen = document.getElementById("btnFullscreen");
const btnApply = document.getElementById("btnApply");
const btnLoadDemo = document.getElementById("btnLoadDemo");

function normalizeList(text) {
  return text
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function syncStats() {
  elRemaining.textContent = remaining.length;
  elTotal.textContent = words.length;
}

function showMessage(text) {
  elMsg.textContent = text;
  window.clearTimeout(showMessage._t);
  showMessage._t = window.setTimeout(() => (elMsg.textContent = ""), 2500);
}

function pick() {
  if (remaining.length === 0) {
    elWord.textContent = "Finite!";
    elSub.textContent = "Premi “Reset” o applica un nuovo elenco.";
    syncStats();
    return;
  }
  const i = Math.floor(Math.random() * remaining.length);
  const chosen = remaining.splice(i, 1)[0];
  elWord.textContent = chosen;
  elSub.textContent = "Leggi bene: accento, quantità, chiarezza.";
  syncStats();
}

function reset() {
  remaining = [...words];
  elWord.textContent = "Pronti.";
  elSub.textContent = "Premi “Estrai”.";
  syncStats();
}

function applyList() {
  const newList = normalizeList(elInput.value);
  if (newList.length < 1) {
    showMessage("Elenco vuoto: incolla almeno una parola.");
    return;
  }
  words = [...newList];
  remaining = [...words];
  elWord.textContent = "Elenco aggiornato.";
  elSub.textContent = "Ora puoi estrarre.";
  syncStats();
  showMessage(`Caricate ${words.length} parole.`);
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      showMessage("Schermo intero attivato.");
    } else {
      await document.exitFullscreen();
      showMessage("Schermo intero disattivato.");
    }
  } catch (e) {
    showMessage("Schermo intero non disponibile qui.");
  }
}

function loadDemo() {
  showMessage("La demo ora coincide con words.txt.");
}

async function loadWordsFromFile() {
  try {
    const response = await fetch("words.txt");
    if (!response.ok) {
      throw new Error("File non trovato");
    }

    const text = await response.text();

    words = text
      .split(/\r?\n/)
      .map(w => w.trim())
      .filter(Boolean);

    remaining = [...words];

    elInput.value = words.join("\n");

    elWord.textContent = "Pronti.";
    elSub.textContent = "Premi “Estrai”.";

    syncStats();
    showMessage(`Caricate ${words.length} parole da words.txt`);
  } catch (error) {
    elWord.textContent = "Errore caricamento parole.";
    elSub.textContent = "Verifica words.txt";
    showMessage("Impossibile leggere words.txt");
  }
}

// Eventi
btnExtract.addEventListener("click", pick);
btnReset.addEventListener("click", reset);
btnFullscreen.addEventListener("click", toggleFullscreen);
btnApply.addEventListener("click", applyList);
btnLoadDemo.addEventListener("click", loadDemo);

// Tastiera: SPAZIO / INVIO = estrai, R = reset, F = fullscreen
window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (k === " " || k === "enter") { e.preventDefault(); pick(); }
  if (k === "r") reset();
  if (k === "f") toggleFullscreen();
});

// Init
loadWordsFromFile();