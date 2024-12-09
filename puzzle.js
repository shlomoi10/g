// DOM Elements
const imageUpload = document.getElementById('imageUpload');
const dropZone = document.getElementById('dropZone');
const difficultyButtons = document.querySelectorAll('.difficulty-button');
const customSizeDiv = document.querySelector('.custom-size');
const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const startGameBtn = document.getElementById('startGame');
const shuffleButton = document.getElementById('shuffleButton');
const resetButton = document.getElementById('resetButton');
const puzzleBoard = document.getElementById('puzzle');
const previewImage = document.getElementById('previewImage');
const togglePreviewBtn = document.getElementById('togglePreview');
const timerDisplay = document.getElementById('timer');
const moveCountDisplay = document.getElementById('moveCount');
const winMessage = document.getElementById('winMessage');
const finalTimeDisplay = document.getElementById('finalTime');
const finalMovesDisplay = document.getElementById('finalMoves');

// Game State
let gameState = {
    image: null,
    pieces: [],
    rows: 3,
    cols: 3,
    moves: 0,
    startTime: null,
    timerInterval: null,
    isPlaying: false
};

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('drop', handleDrop);
dropZone.addEventListener('dragleave', handleDragLeave);

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        difficultyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.dataset.rows === 'custom') {
            customSizeDiv.style.display = 'block';
        } else {
            customSizeDiv.style.display = 'none';
            gameState.rows = parseInt(button.dataset.rows);
            gameState.cols = parseInt(button.dataset.cols);
        }
        
        updateStartButton();
    });
});

[rowsInput, colsInput].forEach(input => {
    input.addEventListener('change', () => {
        gameState.rows = parseInt(rowsInput.value);
        gameState.cols = parseInt(colsInput.value);
        updateStartButton();
    });
});

startGameBtn.addEventListener('click', startGame);
shuffleButton.addEventListener('click', shufflePieces);
resetButton.addEventListener('click', resetGame);
togglePreviewBtn.addEventListener('click', togglePreview);

// Game Functions
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        loadImage(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        loadImage(file);
    }
}

function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            gameState.image = img;
            previewImage.src = e.target.result;
            updateStartButton();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function updateStartButton() {
    startGameBtn.disabled = !gameState.image || 
                           gameState.rows < 2 || 
                           gameState.cols < 2 ||
                           gameState.rows > 10 || 
                           gameState.cols > 10;
}

function startGame() {
    gameState.isPlaying = true;
    gameState.moves = 0;
    moveCountDisplay.textContent = '0';
    
    document.querySelector('.game-section').classList.add('active');
    dropZone.style.display = 'none';
    document.querySelector('.difficulty-controls').style.display = 'none';
    document.querySelector('.custom-size').style.display = 'none';
    startGameBtn.style.display = 'none';
    previewImage.style.display = 'none';
    
    createPuzzlePieces();
    shufflePieces();
    startTimer();
    
    shuffleButton.disabled = false;
    resetButton.disabled = false;
    
    togglePreviewBtn.innerHTML = `
        <i class="fas fa-eye"></i>
        הצג תמונה מקורית
    `;
}

function createPuzzlePieces() {
    const pieceWidth = gameState.image.width / gameState.cols;
    const pieceHeight = gameState.image.height / gameState.rows;
    
    puzzleBoard.style.gridTemplateColumns = `repeat(${gameState.cols}, 1fr)`;
    puzzleBoard.innerHTML = '';
    gameState.pieces = [];
    
    for (let i = 0; i < gameState.rows * gameState.cols; i++) {
        const piece = document.createElement('canvas');
        piece.classList.add('puzzle-piece');
        piece.width = pieceWidth;
        piece.height = pieceHeight;
        
        const row = Math.floor(i / gameState.cols);
        const col = i % gameState.cols;
        
        const ctx = piece.getContext('2d');
        ctx.drawImage(gameState.image, 
            col * pieceWidth, row * pieceHeight, 
            pieceWidth, pieceHeight,
            0, 0, pieceWidth, pieceHeight);
        
        piece.dataset.originalIndex = i;
        piece.draggable = true;
        
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragend', handleDragEnd);
        piece.addEventListener('dragover', handlePieceDragOver);
        piece.addEventListener('drop', handlePieceDrop);
        
        gameState.pieces.push(piece);
        puzzleBoard.appendChild(piece);
    }
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handlePieceDragOver(e) {
    e.preventDefault();
}

function handlePieceDrop(e) {
    e.preventDefault();
    const draggedPiece = document.querySelector('.dragging');
    const targetPiece = e.target;
    
    if (draggedPiece && targetPiece !== draggedPiece) {
        const allPieces = [...puzzleBoard.children];
        const draggedIndex = allPieces.indexOf(draggedPiece);
        const targetIndex = allPieces.indexOf(targetPiece);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            // Swap pieces
            puzzleBoard.insertBefore(draggedPiece, targetPiece);
            puzzleBoard.insertBefore(targetPiece, allPieces[draggedIndex]);
            
            gameState.moves++;
            moveCountDisplay.textContent = gameState.moves;
            
            checkWin();
        }
    }
}

function shufflePieces() {
    const pieces = [...puzzleBoard.children];
    for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        puzzleBoard.appendChild(pieces[j]);
    }
    gameState.moves = 0;
    moveCountDisplay.textContent = '0';
}

function checkWin() {
    const currentOrder = [...puzzleBoard.children].map(piece => 
        parseInt(piece.dataset.originalIndex));
    
    const isWin = currentOrder.every((num, index) => num === index);
    
    if (isWin) {
        endGame();
    }
}

function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function endGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    
    finalTimeDisplay.textContent = timerDisplay.textContent;
    finalMovesDisplay.textContent = gameState.moves;
    winMessage.classList.add('active');
    
    setTimeout(() => {
        winMessage.classList.remove('active');
    }, 5000);
}

function resetGame() {
    gameState.isPlaying = false;
    clearInterval(gameState.timerInterval);
    timerDisplay.textContent = '00:00';
    moveCountDisplay.textContent = '0';
    document.querySelector('.game-section').classList.remove('active');
    winMessage.classList.remove('active');
    
    dropZone.style.display = 'block';
    document.querySelector('.difficulty-controls').style.display = 'flex';
    customSizeDiv.style.display = customSizeDiv.classList.contains('active') ? 'block' : 'none';
    startGameBtn.style.display = 'block';
    
    shuffleButton.disabled = true;
    resetButton.disabled = true;
}

function togglePreview() {
    const isHidden = previewImage.style.display === 'none';
    previewImage.style.display = isHidden ? 'block' : 'none';
    togglePreviewBtn.innerHTML = `
        <i class="fas fa-eye${isHidden ? '' : '-slash'}"></i>
        ${isHidden ? 'הסתר' : 'הצג'} תמונה מקורית
    `;
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // No need to initialize the game here
});
