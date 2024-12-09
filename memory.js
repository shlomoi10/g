class GameManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.resetGame();
        this.uploadedImages = [];
        this.updateRequiredImagesCount();
        
        // מצב המשחק
        this.isGameStarted = false;
        this.timer = 0;
        this.moves = 0;
        this.matches = 0;
        this.flippedCards = [];
        this.matchedPairs = 0;
    }

    initializeElements() {
        this.imageUpload = document.getElementById('image-upload');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        this.gridSizeSelect = document.getElementById('grid-size');
        this.gameBoard = document.getElementById('game-board');
        this.timerDisplay = document.getElementById('timer');
        this.movesDisplay = document.getElementById('moves');
        this.matchesDisplay = document.getElementById('matches');
        this.imagePreviewContainer = document.getElementById('image-preview-container');
        this.requiredImagesCount = document.getElementById('required-images-count');
        this.colorPanel = document.getElementById('color-panel');
    }

    setupEventListeners() {
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.gridSizeSelect.addEventListener('change', () => this.updateRequiredImagesCount());

        // מאזיני אירועים לבחירת צבע
        const colorOptions = document.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                document.documentElement.style.setProperty('--card-back-color', option.dataset.color);
            });
        });
    }

    updateRequiredImagesCount() {
        const gridSize = parseInt(this.gridSizeSelect.value);
        const requiredImages = gridSize / 2;
        this.requiredImagesCount.textContent = requiredImages;
        this.checkStartButton();
    }

    handleImageUpload(event) {
        const files = Array.from(event.target.files);
        const gridSize = parseInt(this.gridSizeSelect.value);
        const maxImages = gridSize / 2;
        
        if (this.uploadedImages.length + files.length > maxImages) {
            this.showModal('שגיאה', `ניתן להעלות מקסימום ${maxImages} תמונות למשחק זה`);
            return;
        }

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = e.target.result;
                    this.addImagePreview(imageData, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addImagePreview(imageData, imageName) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-preview';
        
        const img = document.createElement('img');
        img.src = imageData;
        img.alt = imageName;
        
        const removeButton = document.createElement('button');
        removeButton.className = 'remove-image';
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.onclick = () => this.removeImage(imageWrapper, imageData);
        
        imageWrapper.appendChild(img);
        imageWrapper.appendChild(removeButton);
        this.imagePreviewContainer.appendChild(imageWrapper);
        
        this.uploadedImages.push(imageData);
        this.checkStartButton();
    }

    removeImage(imageWrapper, imageData) {
        imageWrapper.remove();
        const index = this.uploadedImages.indexOf(imageData);
        if (index > -1) {
            this.uploadedImages.splice(index, 1);
        }
        this.checkStartButton();
    }

    checkStartButton() {
        const gridSize = parseInt(this.gridSizeSelect.value);
        const requiredImages = gridSize / 2;
        this.startButton.disabled = this.uploadedImages.length !== requiredImages;
    }

    startGame() {
        if (this.uploadedImages.length < parseInt(this.gridSizeSelect.value) / 2) {
            this.showModal('שגיאה', 'נא להעלות את כל התמונות הנדרשות לפני תחילת המשחק');
            return;
        }
        
        this.isGameStarted = true;
        this.resetStats();
        this.createBoard();
        this.startTimer();

        // הסתרת אלמנטים לא נחוצים
        document.querySelector('.upload-section').style.display = 'none';
        document.querySelector('.control-group').style.display = 'none';
        document.querySelector('#start-game').style.display = 'none';
        document.querySelector('h1').style.display = 'none';

        // הצגת כפתור איפוס
        const resetButton = document.querySelector('#reset-game');
        resetButton.style.display = 'inline-flex';

        // הזזת הסטטיסטיקות והכפתור למעלה
        const gameStats = document.querySelector('.game-stats');
        const gameHeader = document.querySelector('.game-header');
        
        gameHeader.innerHTML = '';
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'game-controls-minimal';
        controlsContainer.appendChild(gameStats);
        controlsContainer.appendChild(resetButton);
        gameHeader.appendChild(controlsContainer);
    }

    resetGame() {
        this.isGameStarted = false;
        clearInterval(this.timerInterval);
        
        // איפוס המשחק בלי רענון הדף
        this.uploadedImages = [];
        this.imagePreviewContainer.innerHTML = '';
        this.gameBoard.innerHTML = '';
        this.flippedCards = [];
        this.matchedPairs = 0;
        
        // החזרת המבנה המקורי של הדף
        const gameHeader = document.querySelector('.game-header');
        gameHeader.innerHTML = `
            <h1>משחק זיכרון משפחתי</h1>
            <div class="game-controls">
                <div class="control-group upload-section">
                    <div class="upload-info">
                        <p id="required-images-text">נדרשות <span id="required-images-count">0</span> תמונות למשחק</p>
                        <input type="file" id="image-upload" accept="image/*" class="btn" multiple>
                        <label for="image-upload" class="btn btn-primary">
                            <i class="fas fa-upload"></i>
                            העלאת תמונות
                        </label>
                    </div>
                    <div class="uploaded-images" id="uploaded-images">
                        <div class="image-preview-container" id="image-preview-container"></div>
                    </div>
                </div>
                
                <div class="control-group">
                    <select id="grid-size" class="btn">
                        <option value="4">2x2 (קל)</option>
                        <option value="8">4x4 (בינוני)</option>
                        <option value="12">6x6 (קשה)</option>
                        <option value="16">8x8 (אתגר)</option>
                    </select>
                </div>

                <button id="start-game" class="btn btn-success" disabled>
                    <i class="fas fa-play"></i>
                    התחל משחק
                </button>
                
                <button id="reset-game" class="btn btn-warning">
                    <i class="fas fa-redo"></i>
                    משחק חדש
                </button>
            </div>

            <div class="game-stats">
                <div class="stat-item">
                    <i class="fas fa-star"></i>
                    <span id="matches">0</span> זוגות
                </div>
                <div class="stat-item">
                    <i class="fas fa-sync"></i>
                    <span id="moves">0</span> ניסיונות
                </div>
                <div class="stat-item">
                    <i class="fas fa-clock"></i>
                    <span id="timer">00:00</span>
                </div>
            </div>`;

        // איפוס והתחלה מחדש
        this.initializeElements();
        this.setupEventListeners();
        this.resetStats();
        this.updateRequiredImagesCount();
        this.checkStartButton();
    }

    resetStats() {
        this.timer = 0;
        this.moves = 0;
        this.matches = 0;
        this.updateStats();
    }

    updateStats() {
        this.timerDisplay.textContent = this.formatTime(this.timer);
        this.movesDisplay.textContent = this.moves;
        this.matchesDisplay.textContent = this.matches;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateStats();
        }, 1000);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    createBoard() {
        const gridSize = parseInt(this.gridSizeSelect.value);
        const images = [...this.uploadedImages, ...this.uploadedImages];
        this.shuffleArray(images);
        
        this.gameBoard.innerHTML = '';
        this.gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(gridSize)}, 1fr)`;
        
        images.forEach((image, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            
            const front = document.createElement('div');
            front.className = 'card-front';
            const frontImg = document.createElement('img');
            frontImg.src = image;
            front.appendChild(frontImg);
            
            const back = document.createElement('div');
            back.className = 'card-back';
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', () => this.flipCard(card));
            this.gameBoard.appendChild(card);
        });
    }

    flipCard(card) {
        if (!this.isGameStarted || 
            card.classList.contains('flipped') || 
            this.flippedCards.length >= 2 || 
            this.flippedCards.includes(card) ||
            card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        this.flippedCards.push(card);

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const img1 = card1.querySelector('.card-front img').src;
        const img2 = card2.querySelector('.card-front img').src;

        if (img1 === img2) {
            this.matches++;
            this.matchedPairs++;
            this.updateStats();
            
            card1.classList.add('matched');
            card2.classList.add('matched');
            
            if (this.matchedPairs === this.uploadedImages.length) {
                this.gameWon();
            }
            this.flippedCards = [];
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    gameWon() {
        clearInterval(this.timerInterval);
        this.isGameStarted = false;
        
        setTimeout(() => {
            this.showModal('כל הכבוד!', 
                `סיימת את המשחק!\nזמן: ${this.formatTime(this.timer)}\nמהלכים: ${this.moves}`);
        }, 500);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showModal(title, message) {
        const modal = document.getElementById('modal');
        const modalHeader = document.getElementById('modal-header');
        const modalContent = document.getElementById('modal-content');
        
        modalHeader.textContent = title;
        modalContent.textContent = message;
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// יצירת מופע גלובלי של מנהל המשחק
window.gameManager = new GameManager();
