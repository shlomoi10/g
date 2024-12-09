class MemoryGame {
    constructor() {
        this.images = [];
        this.currentImageIndex = 0;
        this.isPlaying = false;
        this.timer = null;
        this.cropper = null;
        this.croppedArea = null;
        
        this.initializeElements();
        this.addEventListeners();
    }

    initializeElements() {
        // Setup elements
        this.setupSection = document.getElementById('setupSection');
        this.gameSection = document.getElementById('gameSection');
        
        // Upload elements
        this.imageUpload = document.getElementById('imageUpload');
        this.imagePreview = document.getElementById('imagePreview');
        this.questionInput = document.getElementById('questionInput');
        this.answerInput = document.getElementById('answerInput');
        this.viewTimeInput = document.getElementById('viewTime');
        this.addImageButton = document.getElementById('addImage');
        this.uploadedImagesContainer = document.getElementById('uploadedImages');
        this.cropControls = document.querySelector('.crop-controls');
        this.confirmCropButton = document.getElementById('confirmCrop');
        this.resetCropButton = document.getElementById('resetCrop');
        
        // Game elements
        this.startButton = document.getElementById('startGame');
        this.timerElement = document.getElementById('timer');
        this.imageDisplay = document.getElementById('imageDisplay');
        this.questionDisplay = document.getElementById('questionDisplay');
        this.answerDisplay = document.getElementById('answerDisplay');
        this.nextButton = document.getElementById('nextQuestion');
        this.newGameButton = document.getElementById('newGame');
        
        // Save game button
        this.saveGameAsZipButton = document.getElementById('saveGameAsZip');
        this.loadGameFromZipButton = document.getElementById('loadGameFromZip');
        this.loadGameFromZipInput = document.getElementById('loadGameFromZipInput');
    }

    addEventListeners() {
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.addImageButton.addEventListener('click', () => this.addImage());
        this.startButton.addEventListener('click', () => this.startGame());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.newGameButton.addEventListener('click', () => this.resetGame());
        this.confirmCropButton.addEventListener('click', () => this.confirmCrop());
        this.resetCropButton.addEventListener('click', () => this.resetCrop());
        this.saveGameAsZipButton.addEventListener('click', () => this.saveGameAsZip());
        
        // עדכון אירועי טעינת משחק
        this.loadGameFromZipButton.addEventListener('click', () => {
            this.loadGameFromZipInput.click(); // פתיחת חלון בחירת קבצים
        });
        
        this.loadGameFromZipInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadGameFromZip(file);
            }
        });
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // נקה את ה-Cropper הקודם אם קיים
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            // וודא שה-imagePreview קיים
            if (!this.imagePreview) return;
            
            this.imagePreview.innerHTML = `<img src="${e.target.result}" alt="תצוגה מקדימה">`;
            const image = this.imagePreview.querySelector('img');
            
            if (!image) return;
            
            image.onload = () => {
                // הגדרת Cropper רק אחרי שהתמונה נטענה
                this.cropper = new Cropper(image, {
                    aspectRatio: NaN,
                    viewMode: 1,
                    dragMode: 'crop',
                    autoCropArea: 0.3,
                    restore: false,
                    guides: true,
                    center: true,
                    highlight: true,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    toggleDragModeOnDblclick: false,
                });

                if (this.cropControls) {
                    this.cropControls.style.display = 'flex';
                }
            };
        };
        reader.readAsDataURL(file);
    }

    confirmCrop() {
        if (!this.cropper) return;
        
        const canvas = this.cropper.getCroppedCanvas();
        this.croppedArea = {
            dataUrl: canvas.toDataURL(),
            coordinates: this.cropper.getData()
        };
        
        this.displayMessage('האזור נשמר בהצלחה!');
    }

    resetCrop() {
        if (this.cropper) {
            this.cropper.reset();
        }
        this.croppedArea = null;
    }

    addImage() {
        if (!this.cropper || !this.croppedArea) {
            this.displayMessage('נא לסמן ולאשר את האזור לתשובה');
            return;
        }

        const question = this.questionInput.value.trim();
        const answer = this.answerInput.value.trim();
        const viewTime = parseInt(this.viewTimeInput.value);

        if (!question || !answer) {
            this.displayMessage('נא למלא את כל השדות');
            return;
        }

        const imageData = {
            fullImage: this.cropper.element.src,
            croppedImage: this.croppedArea.dataUrl,
            cropData: this.croppedArea.coordinates,
            question: question,
            answer: answer,
            viewTime: viewTime
        };

        this.images.push(imageData);
        this.updateImagesList();
        this.resetUploadForm();
        this.updateStartButtonState();
    }

    updateStartButtonState() {
        this.startButton.disabled = this.images.length < 1;
    }

    updateImagesList() {
        this.uploadedImagesContainer.innerHTML = '';
        this.images.forEach((image, index) => {
            const card = document.createElement('div');
            card.className = 'uploaded-image-card';
            card.innerHTML = `
                <img src="${image.fullImage}" alt="תמונה ${index + 1}">
                <div>שאלה: ${image.question}</div>
                <div>זמן צפייה: ${image.viewTime} שניות</div>
                <button onclick="game.removeImage(${index})" class="button">הסר</button>
            `;
            this.uploadedImagesContainer.appendChild(card);
        });
        this.updateStartButtonState();
    }

    removeImage(index) {
        this.images.splice(index, 1);
        this.updateImagesList();
    }

    resetUploadForm() {
        // נקה את ה-Cropper
        if (this.cropper) {
            try {
                this.cropper.destroy();
            } catch (error) {
                console.error('Error destroying cropper:', error);
            }
            this.cropper = null;
        }

        // נקה את שאר השדות רק אם הם קיימים
        if (this.imageUpload) {
            this.imageUpload.value = '';
        }
        if (this.imagePreview) {
            this.imagePreview.innerHTML = '<p>העלה תמונה והשתמש בכלי הסימון כדי לבחור את האזור לתשובה</p>';
        }
        if (this.questionInput) {
            this.questionInput.value = '';
        }
        if (this.answerInput) {
            this.answerInput.value = '';
        }
        if (this.viewTimeInput) {
            this.viewTimeInput.value = '10';
        }
        if (this.cropControls) {
            this.cropControls.style.display = 'none';
        }
        this.croppedArea = null;
    }

    startGame() {
        if (this.images.length === 0) {
            this.displayMessage('נא להוסיף לפחות תמונה אחת למשחק');
            return;
        }

        // איפוס מצב המשחק
        this.currentImageIndex = 0;
        this.isPlaying = true;
        clearInterval(this.timer);
        
        // הסתרת מסך ההגדרות והצגת מסך המשחק
        this.setupSection.style.display = 'none';
        this.gameSection.style.display = 'block';
        
        // התחלת המשחק עם התמונה הראשונה
        this.showCurrentImage();
    }

    showCurrentImage() {
        if (!this.images[this.currentImageIndex]) {
            console.error('No image found at index:', this.currentImageIndex);
            return;
        }

        const currentImage = this.images[this.currentImageIndex];
        
        // הצגת התמונה המלאה
        this.imageDisplay.innerHTML = `<img src="${currentImage.fullImage}" alt="תמונה">`;
        this.questionDisplay.textContent = '';
        this.answerDisplay.style.display = 'none';
        
        // התחלת ספירה לאחור
        let timeLeft = currentImage.viewTime;
        this.timerElement.textContent = timeLeft;
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            timeLeft--;
            this.timerElement.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.showQuestion();
            }
        }, 1000);
    }

    showQuestion() {
        const currentImage = this.images[this.currentImageIndex];
        this.imageDisplay.innerHTML = '';
        this.questionDisplay.innerHTML = `<h2>${currentImage.question}</h2>`;
        this.questionDisplay.style.display = 'block';
        this.answerDisplay.style.display = 'none';
        this.startTimerBar(currentImage.viewTime);
    }

    startTimerBar(duration) {
        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        const timerFill = document.createElement('div');
        timerFill.className = 'timer-fill';
        timerBar.appendChild(timerFill);
        this.gameSection.appendChild(timerBar);
        let width = 100;
        const interval = setInterval(() => {
            width -= 100 / duration;
            timerFill.style.width = width + '%';
            if (width <= 0) {
                clearInterval(interval);
                this.showAnswer();
                timerBar.remove();
            }
        }, 1000);
    }

    showAnswer() {
        const currentImage = this.images[this.currentImageIndex];
        this.imageDisplay.innerHTML = `<img src="${currentImage.croppedImage}" alt="תמונה">`;
        this.answerDisplay.style.display = 'block';
        this.answerDisplay.innerHTML = `<h2>התשובה: ${currentImage.answer}</h2>`;
    }

    nextQuestion() {
        clearInterval(this.timer);
        
        if (this.currentImageIndex < this.images.length - 1) {
            this.currentImageIndex++;
            this.showCurrentImage();
        } else {
            this.displayMessage('המשחק הסתיים!');
            this.resetGame();
        }
    }

    resetGame() {
        clearInterval(this.timer);
        this.setupSection.style.display = 'block';
        this.gameSection.style.display = 'none';
        this.isPlaying = false;
        this.currentImageIndex = 0;
    }

    displayMessage(message) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        messageContainer.innerHTML = `<p>${message}</p>`;
        document.body.appendChild(messageContainer);
        setTimeout(() => {
            messageContainer.remove();
        }, 3000);
    }

    saveGameAsZip() {
        const zip = new JSZip();
        const gameData = JSON.stringify(this.images);
        zip.file('game-data.json', gameData);

        this.images.forEach((image, index) => {
            const base64Data = image.fullImage.split(',')[1];
            zip.file(`image${index + 1}.png`, base64Data, { base64: true });
        });

        zip.generateAsync({ type: 'blob' }).then((content) => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'memory-game.zip';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    loadGameFromZip(file) {
        const zip = new JSZip();
        const reader = new FileReader();

        reader.onload = (e) => {
            zip.loadAsync(e.target.result).then((zip) => {
                return zip.file('game-data.json').async('string');
            }).then((data) => {
                this.images = JSON.parse(data);
                this.updateImagesList();
                this.displayMessage('המשחק נטען בהצלחה!');
            }).catch((error) => {
                this.displayMessage('שגיאה בטעינת המשחק');
                console.error(error);
            });
        };

        reader.readAsArrayBuffer(file);
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new MemoryGame();
});
