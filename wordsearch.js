class WordSearchGame {
    constructor() {
        this.words = [];
        this.grid = [];
        this.gridSize = 10;
        this.foundWords = new Set();
        this.selectedCells = [];
        this.seconds = 0;
        this.timerInterval = null;
        
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        // Setup elements
        this.setupSection = document.getElementById('setupSection');
        this.gameSection = document.getElementById('gameSection');
        this.wordInput = document.getElementById('wordInput');
        this.addWordButton = document.getElementById('addWord');
        this.wordsList = document.getElementById('words');
        this.gridSizeSelect = document.getElementById('gridSize');
        this.startButton = document.getElementById('startGame');

        // Game elements
        this.boardElement = document.getElementById('wordSearchBoard');
        this.remainingWordsList = document.getElementById('remainingWordsList');
        this.foundWordsElement = document.getElementById('foundWords');
        this.totalWordsElement = document.getElementById('totalWords');
        this.timerElement = document.getElementById('timer');
        this.newGameButton = document.getElementById('newGame');
        this.hintButton = document.getElementById('showHint');
    }

    addEventListeners() {
        this.wordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addWord();
        });
        this.addWordButton.addEventListener('click', () => this.addWord());
        this.startButton.addEventListener('click', () => this.startGame());
        this.newGameButton.addEventListener('click', () => this.resetGame());
        this.hintButton.addEventListener('click', () => this.showHint());
        this.gridSizeSelect.addEventListener('change', () => {
            this.gridSize = parseInt(this.gridSizeSelect.value);
        });
    }

    addWord() {
        const word = this.wordInput.value.trim().replace(/[^א-ת]/g, '');
        if (word.length < 2) {
            alert('אנא הכנס שם באורך של לפחות 2 אותיות');
            return;
        }
        
        if (this.words.includes(word)) {
            alert('השם כבר קיים ברשימה');
            return;
        }
        
        this.words.push(word);
        this.updateWordsList();
        this.wordInput.value = '';
        this.startButton.disabled = this.words.length < 3;
    }

    updateWordsList() {
        this.wordsList.innerHTML = '';
        this.words.forEach((word, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${word}
                <button onclick="game.removeWord(${index})">×</button>
            `;
            this.wordsList.appendChild(li);
        });
    }

    removeWord(index) {
        this.words.splice(index, 1);
        this.updateWordsList();
        this.startButton.disabled = this.words.length < 3;
    }

    startGame() {
        if (this.words.length < 3) {
            alert('נדרשים לפחות 3 שמות כדי להתחיל');
            return;
        }

        this.setupSection.style.display = 'none';
        this.gameSection.style.display = 'block';
        this.foundWords.clear();
        this.generateGrid();
        this.updateRemainingWords();
        this.updateStats();
        this.startTimer();
    }

    generateGrid() {
        this.grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill(''));
        
        // Try to place each word
        this.words.forEach(word => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;

            while (!placed && attempts < maxAttempts) {
                const direction = Math.floor(Math.random() * 8);
                const [dx, dy] = this.getDirection(direction);
                const [startX, startY] = this.getRandomStart(word, dx, dy);

                if (this.canPlaceWord(word, startX, startY, dx, dy)) {
                    this.placeWord(word, startX, startY, dx, dy);
                    placed = true;
                }
                attempts++;
            }
        });

        // Fill empty cells with random letters
        const hebrewLetters = 'אבגדהוזחטיכלמנסעפצקרשת';
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (!this.grid[i][j]) {
                    const randomIndex = Math.floor(Math.random() * hebrewLetters.length);
                    this.grid[i][j] = hebrewLetters[randomIndex];
                }
            }
        }

        this.renderGrid();
    }

    getDirection(direction) {
        const directions = [
            [0, 1],   // right
            [1, 0],   // down
            [1, 1],   // diagonal down-right
            [-1, 1],  // diagonal up-right
            [0, -1],  // left
            [-1, 0],  // up
            [-1, -1], // diagonal up-left
            [1, -1]   // diagonal down-left
        ];
        return directions[direction];
    }

    getRandomStart(word, dx, dy) {
        const length = word.length - 1;
        let startX, startY;
        
        if (dx < 0) startX = this.gridSize - 1;
        else if (dx > 0) startX = 0;
        else startX = Math.floor(Math.random() * this.gridSize);

        if (dy < 0) startY = this.gridSize - 1;
        else if (dy > 0) startY = 0;
        else startY = Math.floor(Math.random() * this.gridSize);

        if (dx < 0) startX = Math.min(this.gridSize - 1, startX + length * Math.abs(dx));
        if (dy < 0) startY = Math.min(this.gridSize - 1, startY + length * Math.abs(dy));

        return [startX, startY];
    }

    canPlaceWord(word, startX, startY, dx, dy) {
        let x = startX;
        let y = startY;

        for (let i = 0; i < word.length; i++) {
            if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
                return false;
            }
            if (this.grid[x][y] && this.grid[x][y] !== word[i]) {
                return false;
            }
            x += dx;
            y += dy;
        }
        return true;
    }

    placeWord(word, startX, startY, dx, dy) {
        let x = startX;
        let y = startY;

        for (let i = 0; i < word.length; i++) {
            this.grid[x][y] = word[i];
            x += dx;
            y += dy;
        }
    }

    renderGrid() {
        this.boardElement.innerHTML = '';
        this.boardElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                cell.textContent = this.grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                cell.addEventListener('mousedown', () => this.startSelection(i, j));
                cell.addEventListener('mouseover', () => this.continueSelection(i, j));
                cell.addEventListener('mouseup', () => this.endSelection());
                
                this.boardElement.appendChild(cell);
            }
        }

        // Prevent text selection while dragging
        this.boardElement.addEventListener('mousedown', (e) => e.preventDefault());
    }

    startSelection(row, col) {
        this.selecting = true;
        this.selectedCells = [{row, col}];
        this.updateSelectedCells();
    }

    continueSelection(row, col) {
        if (!this.selecting) return;
        
        // Check if the new cell forms a straight line with the first cell
        const firstCell = this.selectedCells[0];
        const dx = Math.sign(row - firstCell.row);
        const dy = Math.sign(col - firstCell.col);
        
        // Calculate all cells in the line
        this.selectedCells = [];
        let currentRow = firstCell.row;
        let currentCol = firstCell.col;
        
        while (
            currentRow >= 0 && currentRow < this.gridSize &&
            currentCol >= 0 && currentCol < this.gridSize &&
            (currentRow !== row + dx || currentCol !== col + dy)
        ) {
            this.selectedCells.push({row: currentRow, col: currentCol});
            currentRow += dx;
            currentCol += dy;
        }
        
        this.updateSelectedCells();
    }

    endSelection() {
        if (!this.selecting) return;
        this.selecting = false;
        
        const word = this.selectedCells
            .map(cell => this.grid[cell.row][cell.col])
            .join('');
        
        const reversedWord = word.split('').reverse().join('');
        
        if (this.words.includes(word)) {
            this.foundWords.add(word);
            this.markFoundWord(word);
        } else if (this.words.includes(reversedWord)) {
            this.foundWords.add(reversedWord);
            this.markFoundWord(reversedWord);
        }
        
        this.updateRemainingWords();
        this.updateStats();
        this.checkWin();
        
        // Clear selection
        this.selectedCells = [];
        this.updateSelectedCells();
    }

    updateSelectedCells() {
        // Remove all selections
        const cells = this.boardElement.getElementsByClassName('letter-cell');
        Array.from(cells).forEach(cell => cell.classList.remove('selected'));
        
        // Add selection to current cells
        this.selectedCells.forEach(({row, col}) => {
            const index = row * this.gridSize + col;
            cells[index].classList.add('selected');
        });
    }

    markFoundWord(word) {
        // Mark all cells of the found word
        const cells = this.boardElement.getElementsByClassName('letter-cell');
        this.selectedCells.forEach(({row, col}) => {
            const index = row * this.gridSize + col;
            cells[index].classList.add('found');
        });
    }

    updateRemainingWords() {
        this.remainingWordsList.innerHTML = '';
        this.words.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            if (this.foundWords.has(word)) {
                li.classList.add('found');
            }
            this.remainingWordsList.appendChild(li);
        });
    }

    updateStats() {
        this.foundWordsElement.textContent = this.foundWords.size;
        this.totalWordsElement.textContent = this.words.length;
    }

    checkWin() {
        if (this.foundWords.size === this.words.length) {
            clearInterval(this.timerInterval);
            setTimeout(() => {
                alert(`כל הכבוד! מצאת את כל השמות!\nזמן: ${this.formatTime(this.seconds)}`);
            }, 300);
        }
    }

    showHint() {
        // Find a random unfound word
        const unfoundWords = this.words.filter(word => !this.foundWords.has(word));
        if (unfoundWords.length === 0) return;
        
        const randomWord = unfoundWords[Math.floor(Math.random() * unfoundWords.length)];
        
        // Find the word's position in the grid
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                for (let direction = 0; direction < 8; direction++) {
                    const [dx, dy] = this.getDirection(direction);
                    if (this.checkWordAtPosition(randomWord, i, j, dx, dy)) {
                        this.highlightHint(randomWord, i, j, dx, dy);
                        return;
                    }
                }
            }
        }
    }

    checkWordAtPosition(word, startX, startY, dx, dy) {
        let x = startX;
        let y = startY;
        
        for (let i = 0; i < word.length; i++) {
            if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
                return false;
            }
            if (this.grid[x][y] !== word[i]) {
                return false;
            }
            x += dx;
            y += dy;
        }
        return true;
    }

    highlightHint(word, startX, startY, dx, dy) {
        const cells = this.boardElement.getElementsByClassName('letter-cell');
        let x = startX;
        let y = startY;
        
        // Remove previous hints
        Array.from(cells).forEach(cell => cell.classList.remove('hint'));
        
        // Add new hints
        for (let i = 0; i < word.length; i++) {
            const index = x * this.gridSize + y;
            cells[index].classList.add('hint');
            x += dx;
            y += dy;
        }
        
        // Remove hint after 2 seconds
        setTimeout(() => {
            Array.from(cells).forEach(cell => cell.classList.remove('hint'));
        }, 2000);
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.seconds = 0;
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        this.timerElement.textContent = this.formatTime(this.seconds);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    resetGame() {
        this.setupSection.style.display = 'block';
        this.gameSection.style.display = 'none';
        clearInterval(this.timerInterval);
        this.seconds = 0;
        this.updateTimer();
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new WordSearchGame();
});
