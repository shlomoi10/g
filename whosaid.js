let quotes = [];
let currentQuoteIndex = 0;
let score = 0;

// אלמנטים מה-DOM
const setupSection = document.getElementById('setupSection');
const gameSection = document.getElementById('gameSection');
const endScreen = document.getElementById('endScreen');
const quoteInput = document.getElementById('quoteInput');
const authorInput = document.getElementById('authorInput');
const quotesList = document.getElementById('quotes');
const startGameBtn = document.getElementById('startGame');
const currentQuoteElement = document.getElementById('currentQuote');
const optionsContainer = document.getElementById('options');
const scoreElement = document.getElementById('score');
const remainingQuotesElement = document.getElementById('remainingQuotes');
const resultMessage = document.getElementById('resultMessage');
const nextQuoteBtn = document.getElementById('nextQuote');
const endGameBtn = document.getElementById('endGame');
const finalScoreElement = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgain');

// הוספת ציטוט
document.getElementById('addQuote').addEventListener('click', () => {
    const quote = quoteInput.value.trim();
    const author = authorInput.value.trim();
    
    if (quote && author) {
        quotes.push({ quote, author });
        updateQuotesList();
        quoteInput.value = '';
        authorInput.value = '';
        startGameBtn.disabled = quotes.length < 3;
    }
});

// עדכון רשימת הציטוטים
function updateQuotesList() {
    quotesList.innerHTML = quotes.map((q, i) => `
        <li>
            <span>"${q.quote}" - ${q.author}</span>
            <button onclick="removeQuote(${i})">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
}

// הסרת ציטוט
function removeQuote(index) {
    quotes.splice(index, 1);
    updateQuotesList();
    startGameBtn.disabled = quotes.length < 3;
}

// התחלת המשחק
startGameBtn.addEventListener('click', () => {
    if (quotes.length >= 3) {
        setupSection.style.display = 'none';
        gameSection.style.display = 'block';
        score = 0;
        currentQuoteIndex = 0;
        shuffleQuotes();
        showNextQuote();
    }
});

// ערבוב הציטוטים
function shuffleQuotes() {
    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
    }
}

// הצגת הציטוט הבא
function showNextQuote() {
    if (currentQuoteIndex >= quotes.length) {
        endGame();
        return;
    }

    const currentQuote = quotes[currentQuoteIndex];
    currentQuoteElement.textContent = `"${currentQuote.quote}"`;
    
    // יצירת אפשרויות
    const options = generateOptions(currentQuote.author);
    optionsContainer.innerHTML = options
        .map(author => `<button class="option-button" onclick="checkAnswer('${author}')">${author}</button>`)
        .join('');
    
    // עדכון סטטיסטיקות
    scoreElement.textContent = score;
    remainingQuotesElement.textContent = quotes.length - currentQuoteIndex;
    
    // איפוס הודעת תוצאה
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    
    // הסתרת כפתורים
    nextQuoteBtn.style.display = 'none';
    endGameBtn.style.display = 'none';
}

// יצירת אפשרויות בחירה
function generateOptions(correctAuthor) {
    const options = [correctAuthor];
    const otherAuthors = quotes
        .map(q => q.author)
        .filter(author => author !== correctAuthor);
    
    while (options.length < Math.min(4, quotes.length)) {
        const randomAuthor = otherAuthors[Math.floor(Math.random() * otherAuthors.length)];
        if (!options.includes(randomAuthor)) {
            options.push(randomAuthor);
        }
    }
    
    return shuffleArray(options);
}

// ערבוב מערך
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// בדיקת תשובה
function checkAnswer(selectedAuthor) {
    const correctAuthor = quotes[currentQuoteIndex].author;
    const isCorrect = selectedAuthor === correctAuthor;
    
    // עדכון ניקוד
    if (isCorrect) {
        score += 100;
        resultMessage.textContent = 'נכון מאוד! 🎉';
        resultMessage.className = 'result-message correct';
    } else {
        resultMessage.textContent = `לא נכון... התשובה הנכונה היא: ${correctAuthor}`;
        resultMessage.className = 'result-message wrong';
    }
    
    // עדכון כפתורי האפשרויות
    const buttons = optionsContainer.getElementsByClassName('option-button');
    Array.from(buttons).forEach(button => {
        if (button.textContent === correctAuthor) {
            button.classList.add('correct');
        } else if (button.textContent === selectedAuthor && !isCorrect) {
            button.classList.add('wrong');
        }
        button.disabled = true;
    });
    
    // הצגת כפתורי המשך
    nextQuoteBtn.style.display = 'inline-block';
    if (currentQuoteIndex === quotes.length - 1) {
        endGameBtn.style.display = 'inline-block';
        nextQuoteBtn.style.display = 'none';
    }
}

// מעבר לציטוט הבא
nextQuoteBtn.addEventListener('click', () => {
    currentQuoteIndex++;
    showNextQuote();
});

// סיום המשחק
function endGame() {
    gameSection.style.display = 'none';
    endScreen.style.display = 'block';
    finalScoreElement.textContent = score;
}

// סיום מיידי של המשחק
endGameBtn.addEventListener('click', endGame);

// משחק חדש
playAgainBtn.addEventListener('click', () => {
    endScreen.style.display = 'none';
    setupSection.style.display = 'block';
    quotes = [];
    updateQuotesList();
    startGameBtn.disabled = true;
});
