// Typing test logic
(function () {
    // Predefined texts for each difficulty
    const texts = {
        easy: [
            "The quick brown fox jumps over the lazy dog.",
            "A small cat sat on a mat and purred softly.",
            "She sells seashells by the seashore today.",
        ],
        medium: [
            "Learning to type quickly requires practice and concentration over time.",
            "The weather forecast predicted rain, so she carried an umbrella just in case.",
            "He walked along the winding path and enjoyed the quiet afternoon.",
        ],
        hard: [
            "Despite the turbulent conditions, the expedition continued with unshakable determination.",
            "Under the incandescent glow of the city, patterns of life unfurled unpredictably at midnight.",
            "Complex algorithms require both rigorous testing and careful optimization to perform.",
        ],
    };

    // Helper: choose a random item from an array
    function randomFrom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // DOM elements
    const difficultySelect = document.getElementById("difficulty");
    const sampleTextEl = document.getElementById("sample-text");
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const retryBtn = document.getElementById("retry-btn");
    const userInput = document.getElementById("user-input");
    const timeDisplay = document.getElementById("time");

    if (!difficultySelect || !sampleTextEl || !startBtn || !userInput) {
        // If the expected elements aren't present, silently exit
        return;
    }

    // --- Timing state and helpers ---
    let startTimestamp = null;

    function formatMsToSeconds(ms) {
        return (ms / 1000).toFixed(2);
    }

    // Helper: normalize text (trim, collapse spaces, remove common punctuation, lowercase)
    function normalizeTextToWords(s) {
        if (!s) return [];
        return s
            .trim()
            .replace(/[.,!?;:\/\(\)\[\]"']/g, "") // remove common punctuation
            .replace(/\s+/g, " ")
            .toLowerCase()
            .split(" ")
            .filter(Boolean);
    }

    // Count correctly typed words positionally (case-insensitive, punctuation ignored)
    function countCorrectWords(sample, typed) {
        const sampleWords = normalizeTextToWords(sample);
        const typedWords = normalizeTextToWords(typed);
        let correct = 0;
        const limit = Math.min(sampleWords.length, typedWords.length);
        for (let i = 0; i < limit; i++) {
            if (typedWords[i] === sampleWords[i]) correct++;
        }
        return correct;
    }

    // Calculate WPM (words per minute) from correctly typed words and elapsed milliseconds
    function calculateWPM(correctWords, elapsedMs) {
        if (!elapsedMs || elapsedMs <= 0) return 0;
        const minutes = elapsedMs / 1000 / 60;
        const wpm = correctWords / minutes;
        return Math.round(wpm);
    }

    // Choose and display text for the currently selected difficulty
    function chooseAndDisplayText() {
        const level = difficultySelect.value || "easy";
        const pool = texts[level] || texts.easy;
        const chosen = randomFrom(pool);
        sampleTextEl.textContent = chosen;
        return chosen;
    }

    // When difficulty changes, update the sample text
    difficultySelect.addEventListener("change", () => {
        chooseAndDisplayText();
    });

    // Named handler: start the test
    function handleStartClick(e) {
        e.preventDefault();
        chooseAndDisplayText();
        userInput.value = "";
        userInput.focus();

        // record start time
        startTimestamp = performance.now();

        // disable start, enable stop, disable retry while running
        startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        if (retryBtn) retryBtn.disabled = true;

        // clear previous time shown
        if (timeDisplay) timeDisplay.textContent = "0.00";
    }

    // Named handler: stop the test
    function handleStopClick(e) {
        e.preventDefault();

        if (!startTimestamp) {
            // nothing to stop
            return;
        }

        const endTimestamp = performance.now();
        const elapsedMs = endTimestamp - startTimestamp;

        if (timeDisplay) timeDisplay.textContent = formatMsToSeconds(elapsedMs);

        // Calculate correct words and WPM, display in results if elements exist
        const wpmEl = document.getElementById("wpm");
        const levelEl = document.getElementById("level");
        const sample = sampleTextEl ? sampleTextEl.textContent || "" : "";
        const typed = userInput ? userInput.value || "" : "";
        const correctWords = countCorrectWords(sample, typed);
        const wpm = calculateWPM(correctWords, elapsedMs);
        if (wpmEl) wpmEl.textContent = String(wpm);
        if (levelEl && difficultySelect)
            levelEl.textContent = (difficultySelect.value || "").toLowerCase();

        // reset start timestamp to indicate test ended
        startTimestamp = null;

        // re-enable start, disable stop, enable retry
        startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (retryBtn) retryBtn.disabled = false;
    }

    // Named handler: retry / reset
    function handleRetryClick(e) {
        e && e.preventDefault();
        startTimestamp = null;
        if (timeDisplay) timeDisplay.textContent = "0.00";
        userInput.value = "";
        startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
    }

    // initialize button states
    if (stopBtn) stopBtn.disabled = true;
    if (retryBtn) retryBtn.disabled = false;

    // attach listeners
    startBtn.addEventListener("click", handleStartClick);
    if (stopBtn) stopBtn.addEventListener("click", handleStopClick);
    if (retryBtn) retryBtn.addEventListener("click", handleRetryClick);

    // Initialize with a text
    document.addEventListener("DOMContentLoaded", () => {
        chooseAndDisplayText();
    });
})();
