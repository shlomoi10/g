// משפטים לפי קטגוריות
const sentences = {
    family: [
        "הדבר הכי מצחיק שקרה במשפחה שלנו היה כש...",
        "אם היינו יכולים לטייל לכל מקום בעולם, היינו הולכים ל...",
        "המאכל המשפחתי האהוב עלי הוא... כי...",
        "הזיכרון הכי טוב שלי מהמשפחה הוא כש...",
        "הדבר שהכי מיוחד במשפחה שלנו הוא...",
        "אם היינו יכולים להוסיף עוד חדר לבית, הייתי רוצה...",
        "המסורת המשפחתית האהובה עלי היא... כי...",
        "הטיול המשפחתי הבא שהייתי רוצה לעשות הוא ל...",
        "הסיפור המצחיק ביותר על סבא וסבתא הוא...",
        "המתכון הסודי של המשפחה שלנו הוא...",
        "הרגע המרגש ביותר במשפחה היה כש...",
        "המשחק המשפחתי האהוב עלינו הוא... כי...",
        "הדבר שהכי מצחיק אותי אצל אחי או אחותי הוא...",
        "הזיכרון הראשון שלי מהילדות הוא..."
    ],
    funny: [
        "אם הייתי יכול להיות בעל חיים, הייתי בוחר להיות... כי...",
        "הדבר הכי מוזר שאכלתי בחיים שלי היה...",
        "אם הייתי סופרגיבור, הכוח שלי היה...",
        "החלום הכי מצחיק שחלמתי היה על...",
        "אם הייתי יכול להמציא משהו, זה היה...",
        "הדבר הכי מצחיק שראיתי היום היה...",
        "אם הייתי יכול להחליף מקום עם מישהו ליום אחד, הייתי בוחר...",
        "המקצוע הכי מוזר שאני יכול לחשוב עליו הוא...",
        "הבדיחה הכי טובה ששמעתי היא...",
        "אם הייתי יכול לדבר עם חיות, הייתי שואל אותן...",
        "הדבר הכי מצחיק שקרה לי בבית ספר היה...",
        "אם הייתי יכול להיות בלתי נראה ליום אחד, הייתי...",
        "התחפושת הכי מצחיקה שראיתי היא...",
        "המשחק המצחיק ביותר ששיחקתי היה...",
        "הפעם האחרונה שצחקתי עד דמעות הייתה כש..."
    ],
    adventure: [
        "המקום הכי מעניין שהייתי בו היה...",
        "אם הייתי יכול לטוס לכל מקום בעולם עכשיו, הייתי בוחר...",
        "ההרפתקה הכי גדולה שהייתה לי הייתה כש...",
        "אם הייתי יכול לחזור בזמן, הייתי הולך ל...",
        "המסע הכי מרגש שהייתי רוצה לעשות הוא...",
        "אם הייתי יכול לגור בכל מקום בעולם, הייתי בוחר...",
        "ההרפתקה הבאה שאני רוצה לעשות היא...",
        "המקום הכי מסתורי שהייתי רוצה לחקור הוא...",
        "האתגר הכי גדול שהתגברתי עליו היה...",
        "המסע הכי ארוך שעשיתי היה ל...",
        "אם הייתי יכול לצלול בכל מקום בעולם, הייתי בוחר...",
        "ההרפתקה המסוכנת ביותר שהייתי בה הייתה...",
        "המקום החדש שגיליתי לאחרונה הוא...",
        "הטיול הבא שאני מתכנן הוא ל...",
        "החוויה הכי מאתגרת שחוויתי הייתה..."
    ],
    jewish: [
        "המנהג האהוב עלי בחג הפסח הוא... כי...",
        "הסיפור האהוב עלי מהתורה הוא... כי...",
        "המאכל המסורתי האהוב עלי בראש השנה הוא...",
        "הזיכרון הכי טוב שלי מחגיגת בר או בת המצווה היה...",
        "הדבר שאני הכי אוהב בשבת הוא...",
        "המתכון המשפחתי המסורתי שלנו לחנוכה הוא...",
        "הרגע המרגש ביותר בבית הכנסת היה כש...",
        "המנהג המשפחתי המיוחד שלנו בסוכות הוא...",
        "הסיפור המעניין ביותר על סבא וסבתא בחגים הוא...",
        "הדבר שהכי מיוחד במסורת שלנו בפורים הוא...",
        "הזיכרון הכי טוב שלי מלג בעומר הוא...",
        "המאכל המסורתי שאני הכי אוהב להכין הוא...",
        "הדבר שהכי מרגש אותי בטקסי החגים הוא...",
        "המנהג המשפחתי המיוחד שלנו בשבועות הוא...",
        "הסיפור המעניין ביותר על ההיסטוריה של המשפחה שלנו הוא..."
    ],
    holidays: [
        "החג האהוב עלי הוא... כי...",
        "המתנה הכי טובה שקיבלתי בחג היא...",
        "המסורת החגיגית האהובה עלי היא...",
        "הזיכרון הכי שמח שלי מחגיגות החג הוא...",
        "המאכל החגיגי האהוב עלי הוא... כי...",
        "הדבר שאני הכי אוהב לעשות בחופש הוא...",
        "החגיגה המשפחתית הכי מיוחדת הייתה...",
        "המתכון המסורתי שאני הכי אוהב בחגים הוא...",
        "הטיול החגיגי הכי מהנה שהיה לנו היה...",
        "המשחק המשפחתי האהוב עלינו בחגים הוא...",
        "הקישוט החגיגי האהוב עלי הוא...",
        "המסורת המשפחתית המיוחדת שלנו בחגים היא...",
        "השיר החגיגי האהוב עלי הוא... כי...",
        "הפעילות המשפחתית האהובה עלינו בחופש היא...",
        "הזיכרון הכי מצחיק שלי מחגיגות החג הוא..."
    ]
};

// מצב המשחק
const gameState = {
    players: [],
    currentCategory: 'family',
    currentRound: 1,
    currentPlayerIndex: 0,
    completedSentences: [],
    isVoting: false,
    votes: {}
};

// אלמנטים מה-DOM
const elements = {
    playersList: document.getElementById('playersList'),
    playerName: document.getElementById('playerName'),
    addPlayer: document.getElementById('addPlayer'),
    startGame: document.getElementById('startGame'),
    gameSection: document.querySelector('.game-section'),
    setupSection: document.querySelector('.setup-section'),
    sentenceStart: document.getElementById('sentenceStart'),
    sentenceEnd: document.getElementById('sentenceEnd'),
    submitSentence: document.getElementById('submitSentence'),
    currentPlayer: document.getElementById('currentPlayer'),
    roundNumber: document.getElementById('roundNumber'),
    sentencesList: document.getElementById('sentencesList'),
    votingSection: document.querySelector('.voting-section'),
    votingList: document.getElementById('votingList'),
    finishVoting: document.getElementById('finishVoting'),
    resultsSection: document.querySelector('.results-section'),
    winnersList: document.getElementById('winnersList'),
    newGame: document.getElementById('newGame')
};

// אתחול המשחק כשהדף נטען
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing game...');
    
    // הוספת מאזיני אירועים בסיסיים
    elements.addPlayer.addEventListener('click', addPlayer);
    elements.playerName.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    elements.startGame.addEventListener('click', startGame);
    elements.submitSentence.addEventListener('click', submitSentence);
    elements.finishVoting.addEventListener('click', showResults);
    elements.newGame.addEventListener('click', resetGame);
    
    // הוספת מאזיני אירועים לכפתורי הקטגוריות
    const categoryButtons = document.querySelectorAll('.category-btn');
    console.log('Found category buttons:', categoryButtons.length);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('Category clicked:', button.dataset.category);
            
            // הסרת הקלאס active מכל הכפתורים
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // הוספת הקלאס active לכפתור הנוכחי
            button.classList.add('active');
            
            // עדכון הקטגוריה הנוכחית
            gameState.currentCategory = button.dataset.category;
            console.log('Current category:', gameState.currentCategory);
        });
    });
    
    // אתחול ראשוני של המשחק
    resetGame();
});

// פונקציות המשחק
function addPlayer() {
    const name = elements.playerName.value.trim();
    if (name && !gameState.players.includes(name)) {
        gameState.players.push(name);
        updatePlayersList();
        elements.playerName.value = '';
        updateStartButton();
    }
}

function updatePlayersList() {
    elements.playersList.innerHTML = gameState.players.map(player => `
        <div class="player-tag">
            <i class="fas fa-user"></i>
            ${player}
            <i class="fas fa-times remove-player" onclick="removePlayer('${player}')"></i>
        </div>
    `).join('');
}

function removePlayer(name) {
    gameState.players = gameState.players.filter(player => player !== name);
    updatePlayersList();
    updateStartButton();
}

function updateStartButton() {
    elements.startGame.disabled = gameState.players.length < 2;
}

function startGame() {
    gameState.currentRound = 1;
    gameState.currentPlayerIndex = 0;
    gameState.completedSentences = [];
    gameState.isVoting = false;
    
    elements.setupSection.style.display = 'none';
    elements.gameSection.style.display = 'block';
    elements.resultsSection.style.display = 'none';
    elements.votingSection.style.display = 'none';
    
    nextTurn();
}

function nextTurn() {
    if (gameState.currentPlayerIndex >= gameState.players.length) {
        gameState.currentPlayerIndex = 0;
        gameState.currentRound++;
    }
    
    if (gameState.currentRound > 3) {
        startVoting();
        return;
    }
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    elements.currentPlayer.textContent = currentPlayer;
    elements.roundNumber.textContent = gameState.currentRound;
    
    let availableSentences;
    if (gameState.currentCategory === 'mixed') {
        // בחירת משפט רנדומלי מכל הקטגוריות
        const allCategories = Object.keys(sentences).filter(cat => cat !== 'mixed');
        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        availableSentences = sentences[randomCategory].filter(
            sentence => !gameState.completedSentences.some(
                completed => completed.start === sentence
            )
        );
    } else {
        availableSentences = sentences[gameState.currentCategory].filter(
            sentence => !gameState.completedSentences.some(
                completed => completed.start === sentence
            )
        );
    }
    
    if (availableSentences.length === 0) {
        startVoting();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    elements.sentenceStart.textContent = availableSentences[randomIndex];
    elements.sentenceEnd.value = '';
}

function submitSentence() {
    const end = elements.sentenceEnd.value.trim();
    if (!end) return;
    
    const sentence = {
        player: gameState.players[gameState.currentPlayerIndex],
        start: elements.sentenceStart.textContent,
        end: end,
        votes: 0
    };
    
    gameState.completedSentences.push(sentence);
    updateSentencesList();
    
    gameState.currentPlayerIndex++;
    nextTurn();
}

function updateSentencesList() {
    elements.sentencesList.innerHTML = gameState.completedSentences.map(sentence => `
        <div class="sentence-item">
            <div class="sentence-player">${sentence.player}</div>
            <div class="sentence-text">${sentence.start} ${sentence.end}</div>
        </div>
    `).join('');
}

function startVoting() {
    gameState.isVoting = true;
    elements.votingSection.style.display = 'block';
    elements.currentPlayer.parentElement.style.display = 'none';
    elements.sentenceEnd.parentElement.style.display = 'none';
    
    updateVotingList();
}

function updateVotingList() {
    elements.votingList.innerHTML = gameState.completedSentences.map(sentence => `
        <div class="voting-item" onclick="vote('${sentence.player}')">
            <div class="sentence-text">${sentence.start} ${sentence.end}</div>
            <div class="vote-count">${sentence.votes} הצבעות</div>
        </div>
    `).join('');
}

function vote(player) {
    const sentence = gameState.completedSentences.find(s => s.player === player);
    if (sentence) {
        sentence.votes++;
        updateVotingList();
    }
}

function showResults() {
    elements.gameSection.style.display = 'none';
    elements.resultsSection.style.display = 'block';
    
    const sortedSentences = [...gameState.completedSentences]
        .sort((a, b) => b.votes - a.votes);
    
    elements.winnersList.innerHTML = sortedSentences.slice(0, 3).map((sentence, index) => `
        <div class="winner-item ${['gold', 'silver', 'bronze'][index]}">
            <div>
                <div class="winner-player">${sentence.player}</div>
                <div class="winner-sentence">${sentence.start} ${sentence.end}</div>
            </div>
            <div class="winner-votes">${sentence.votes} הצבעות</div>
        </div>
    `).join('');
}

function resetGame() {
    gameState.players = [];
    gameState.currentCategory = 'family';
    gameState.currentRound = 1;
    gameState.currentPlayerIndex = 0;
    gameState.completedSentences = [];
    gameState.isVoting = false;
    gameState.votes = {};
    
    elements.setupSection.style.display = 'block';
    elements.gameSection.style.display = 'none';
    elements.resultsSection.style.display = 'none';
    elements.playersList.innerHTML = '';
    elements.playerName.value = '';
    elements.startGame.disabled = true;
}
