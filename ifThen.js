document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const ifInput = document.getElementById('ifInput');
    const thenInput = document.getElementById('thenInput');
    const addSentenceBtn = document.getElementById('addSentence');
    const startGameBtn = document.getElementById('startGame');
    const setupSection = document.getElementById('setupSection');
    const gameSection = document.getElementById('gameSection');
    const endScreen = document.getElementById('endScreen');
    const sentenceCountSpan = document.getElementById('sentenceCount');
    const currentIfSpan = document.getElementById('currentIf');
    const currentThenSpan = document.getElementById('currentThen');
    const nextSentenceBtn = document.getElementById('nextSentence');
    const endGameBtn = document.getElementById('endGame');
    const playAgainBtn = document.getElementById('playAgain');

    // Game State
    let ifSentences = [];
    let thenSentences = [];
    let currentIndex = 0;
    let shuffledIfs = [];
    let shuffledThens = [];

    // Add new sentence pair
    function addSentence() {
        const ifText = ifInput.value.trim();
        const thenText = thenInput.value.trim();

        if (ifText && thenText) {
            ifSentences.push(ifText);
            thenSentences.push(thenText);
            updateSentenceCount();
            clearInputs();
            checkStartButton();
        }
    }

    // Update the sentence counter
    function updateSentenceCount() {
        sentenceCountSpan.textContent = ifSentences.length;
    }

    // Clear input fields
    function clearInputs() {
        ifInput.value = '';
        thenInput.value = '';
        ifInput.focus();
    }

    // Check if we can start the game
    function checkStartButton() {
        startGameBtn.disabled = ifSentences.length < 3;
    }

    // Shuffle arrays using Fisher-Yates algorithm
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    // Start the game
    function startGame() {
        shuffledIfs = shuffleArray(ifSentences);
        shuffledThens = shuffleArray(thenSentences);
        currentIndex = 0;
        
        setupSection.style.display = 'none';
        gameSection.style.display = 'block';
        endScreen.style.display = 'none';
        
        displayCurrentSentence();
    }

    // Display current sentence pair
    function displayCurrentSentence() {
        currentIfSpan.textContent = shuffledIfs[currentIndex];
        currentThenSpan.textContent = shuffledThens[currentIndex];
        
        nextSentenceBtn.style.display = currentIndex < shuffledIfs.length - 1 ? 'inline-flex' : 'none';
        endGameBtn.style.display = currentIndex === shuffledIfs.length - 1 ? 'inline-flex' : 'none';
    }

    // Move to next sentence
    function nextSentence() {
        if (currentIndex < shuffledIfs.length - 1) {
            currentIndex++;
            displayCurrentSentence();
        }
    }

    // End the game
    function endGame() {
        gameSection.style.display = 'none';
        endScreen.style.display = 'block';
    }

    // Reset the game
    function resetGame() {
        ifSentences = [];
        thenSentences = [];
        currentIndex = 0;
        updateSentenceCount();
        checkStartButton();
        
        setupSection.style.display = 'block';
        gameSection.style.display = 'none';
        endScreen.style.display = 'none';
        
        clearInputs();
    }

    // Event Listeners
    addSentenceBtn.addEventListener('click', addSentence);
    startGameBtn.addEventListener('click', startGame);
    nextSentenceBtn.addEventListener('click', nextSentence);
    endGameBtn.addEventListener('click', endGame);
    playAgainBtn.addEventListener('click', resetGame);

    // Handle Enter key in input fields
    ifInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && ifInput.value.trim()) {
            thenInput.focus();
        }
    });

    thenInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && thenInput.value.trim() && ifInput.value.trim()) {
            addSentence();
        }
    });
});
