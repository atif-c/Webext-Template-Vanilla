import { defaultStorageObject } from '../lib/storage/default-object.js';
import { loadState, saveState } from '../lib/storage/manager.js';

let storage = { ...defaultStorageObject };

const countStatus = document.getElementById('count-status');
const clickMeBtn = document.getElementById('click-me');
const inputCount = document.getElementById('input-count');

// Function to update display and input
function updateDisplay() {
    countStatus.textContent = `You have clicked the above button ${
        storage.count
    } time${storage.count === 1 ? '' : 's'}`;
    inputCount.value = storage.count;
}

// Initialize display on page load
window.addEventListener('DOMContentLoaded', async () => {
    storage = await loadState();
    updateDisplay();
});

// Button click increments counter
clickMeBtn.addEventListener('click', () => {
    storage.count++;

    saveState(storage);
    updateDisplay();
});

// Input changes counter value on input
inputCount.addEventListener('input', () => {
    const val = parseInt(inputCount.value, 10);
    if (!isNaN(val)) {
        storage.count = val;
        saveState(storage);
        updateDisplay();
    }
});
