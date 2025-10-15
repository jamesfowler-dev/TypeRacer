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
    const userInput = document.getElementById("user-input");

    if (!difficultySelect || !sampleTextEl || !startBtn || !userInput) {
        // If the expected elements aren't present, silently exit
        return;
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

    // When Start is clicked, choose a text (if not chosen) and focus the input
    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        chooseAndDisplayText();
        userInput.value = "";
        userInput.focus();
        // Future: start timer and enable typing measurement
    });

    // Initialize with a text
    document.addEventListener("DOMContentLoaded", () => {
        chooseAndDisplayText();
    });
})();
