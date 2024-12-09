document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const whoInput = document.getElementById('whoInput');
    const whereInput = document.getElementById('whereInput');
    const whatInput = document.getElementById('whatInput');
    const addSentenceBtn = document.getElementById('addSentence');
    const startGameBtn = document.getElementById('startGame');
    const setupSection = document.getElementById('setupSection');
    const gameSection = document.getElementById('gameSection');
    const endScreen = document.getElementById('endScreen');
    const sentenceCountSpan = document.getElementById('sentenceCount');
    const currentWhoSpan = document.getElementById('currentWho');
    const currentWhereSpan = document.getElementById('currentWhere');
    const currentWhatSpan = document.getElementById('currentWhat');
    const nextSentenceBtn = document.getElementById('nextSentence');
    const endGameBtn = document.getElementById('endGame');
    const playAgainBtn = document.getElementById('playAgain');

    // Game State
    let whoSentences = [];
    let whereSentences = [];
    let whatSentences = [];
    let currentIndex = 0;
    let shuffledWhos = [];
    let shuffledWheres = [];
    let shuffledWhats = [];

    // Add new sentence trio
    function addSentence() {
        const whoText = whoInput.value.trim();
        const whereText = whereInput.value.trim();
        const whatText = whatInput.value.trim();

        if (whoText && whereText && whatText) {
            whoSentences.push(whoText);
            whereSentences.push(whereText);
            whatSentences.push(whatText);
            updateSentenceCount();
            clearInputs();
            checkStartButton();
        }
    }

    // Update the sentence counter
    function updateSentenceCount() {
        sentenceCountSpan.textContent = whoSentences.length;
    }

    // Clear input fields
    function clearInputs() {
        whoInput.value = '';
        whereInput.value = '';
        whatInput.value = '';
        whoInput.focus();
    }

    // Check if we can start the game
    function checkStartButton() {
        startGameBtn.disabled = whoSentences.length < 3;
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
        shuffledWhos = shuffleArray(whoSentences);
        shuffledWheres = shuffleArray(whereSentences);
        shuffledWhats = shuffleArray(whatSentences);
        currentIndex = 0;
        
        setupSection.style.display = 'none';
        gameSection.style.display = 'block';
        endScreen.style.display = 'none';
        
        displayCurrentSentence();
    }

    // Display current sentence combination
    function displayCurrentSentence() {
        currentWhoSpan.textContent = shuffledWhos[currentIndex];
        currentWhereSpan.textContent = shuffledWheres[currentIndex];
        currentWhatSpan.textContent = shuffledWhats[currentIndex];
        
        nextSentenceBtn.style.display = currentIndex < shuffledWhos.length - 1 ? 'inline-flex' : 'none';
        endGameBtn.style.display = currentIndex === shuffledWhos.length - 1 ? 'inline-flex' : 'none';
    }

    // Move to next sentence
    function nextSentence() {
        if (currentIndex < shuffledWhos.length - 1) {
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
        whoSentences = [];
        whereSentences = [];
        whatSentences = [];
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
    whoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && whoInput.value.trim()) {
            whereInput.focus();
        }
    });

    whereInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && whereInput.value.trim()) {
            whatInput.focus();
        }
    });

    whatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && whatInput.value.trim() && whoInput.value.trim() && whereInput.value.trim()) {
            addSentence();
        }
    });
});
