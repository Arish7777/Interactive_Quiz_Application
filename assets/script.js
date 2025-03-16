document.addEventListener('DOMContentLoaded', function() {
    const allQuestions = [
        {
            question: "What does 'Never Eat Shredded Wheat' help you remember?",
            options: ["Compass directions", "Ancient grains", "Allied powers in World War II", "Presidents represented on Mount Rushmore"],
            correct: "Compass directions"
        },
        {
            question: "What does 'Every Good Boy Does Fine' help you remember?",
            options: ["Lines on the treble clef", "Piano keys", "Primary colors", "Multiplication tables"],
            correct: "Lines on the treble clef"
        },
        {
            question: "What does 'HOMES' help you remember?",
            options: ["Great Lakes", "Types of clouds", "Bones in the hand", "Parts of a plant"],
            correct: "Great Lakes"
        },
        {
            question: "What does 'My Very Educated Mother Just Served Us Nine Pizzas' help you remember?",
            options: ["Planets in order", "Elements on periodic table", "Types of rocks", "Parts of speech"],
            correct: "Planets in order"
        },
        {
            question: "What does 'ROY G. BIV' help you remember?",
            options: ["Colors of the rainbow", "Musical notes", "Chemical elements", "Mathematical operations"],
            correct: "Colors of the rainbow"
        },
        {
            question: "What does 'Please Excuse My Dear Aunt Sally' help you remember?",
            options: ["Order of operations", "Grammar rules", "States and capitals", "Scientific method steps"],
            correct: "Order of operations"
        },
        // Added new questions
        {
            question: "What does 'FACE' help you remember?",
            options: ["Spaces on the treble clef", "Bones in the skull", "Chemical compounds", "Parts of an atom"],
            correct: "Spaces on the treble clef"
        },
        {
            question: "What does 'King Philip Came Over For Good Soup' help you remember?",
            options: ["Taxonomy classification", "Geological time periods", "States of matter", "Types of energy"],
            correct: "Taxonomy classification"
        },
        {
            question: "What does 'All Cows Eat Grass' help you remember?",
            options: ["Spaces on the bass clef", "Ruminant digestive process", "Types of ecosystems", "Agricultural zones"],
            correct: "Spaces on the bass clef"
        },
        {
            question: "What does 'The Mother Of Sharks Has Big Teeth' help you remember?",
            options: ["Medical cranial nerves", "Layers of the ocean", "Fish classification", "Digestive system"],
            correct: "Medical cranial nerves"
        },
        {
            question: "What does 'SohCahToa' help you remember?",
            options: ["Trigonometric ratios", "Chemical equations", "Grammar rules", "Computer programming syntax"],
            correct: "Trigonometric ratios"
        },
        {
            question: "What does 'Richard Of York Gave Battle In Vain' help you remember?",
            options: ["Colors of the rainbow", "English monarchs", "Medieval battles", "Geological layers"],
            correct: "Colors of the rainbow"
        },
        {
            question: "What does 'Big Elephants Can Always Understand Small Elephants' help you remember?",
            options: ["Spelling 'because'", "Elephant social hierarchy", "African geography", "Conservation categories"],
            correct: "Spelling 'because'"
        },
        {
            question: "What does 'Every Amateur Does Get Better Eventually' help you remember?",
            options: ["Guitar string notes", "Learning stages", "Athletic training", "Language acquisition"],
            correct: "Guitar string notes"
        },
        {
            question: "What does 'Old People From Texas Eat Spiders' help you remember?",
            options: ["Cranial bones", "Southern folklore", "Entomology classification", "Agricultural practices"],
            correct: "Cranial bones"
        }
    ];
    
    let questions = []; 
    
    const usernameSection = document.getElementById('usernameSection');
    const usernameInput = document.getElementById('username');
    const submitUsernameBtn = document.getElementById('submitUsername');
    const startSection = document.querySelector('.cd');
    const questionSection = document.querySelector('.questions');
    const resultSection = document.getElementById('resultSection');
    const leaderboardSection = document.querySelector('.card:last-child');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options');
    const nextBtn = document.querySelector('.next-btn');
    const scoreElement = document.querySelector('.score');
    const backBtn = leaderboardSection.querySelector('.btn1');
    const startBtn = startSection.querySelector('.btn1');

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = null;
    let timer = null;
    let timeLeft = 90;
    let currentUsername = '';
    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    let userAnswers = [];

    function shuffleArray(array) {
        const newArray = [...array]; 
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; 
        }
        return newArray;
    }

    function getRandomQuestions() {
        const questionsCopy = [...allQuestions];
        const selectedQuestions = [];
        const numQuestions = 6;
        
        for (let i = 0; i < numQuestions && questionsCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * questionsCopy.length);
            const selectedQuestion = questionsCopy.splice(randomIndex, 1)[0];
            
            const shuffledOptions = shuffleArray(selectedQuestion.options);
            
            selectedQuestions.push({
                question: selectedQuestion.question,
                options: shuffledOptions,
                correct: selectedQuestion.correct
            });
        }
        
        return selectedQuestions;
    }

    usernameInput.addEventListener('input', function() {
        submitUsernameBtn.disabled = !this.value.trim();
    });

    submitUsernameBtn.addEventListener('click', function() {
        currentUsername = usernameInput.value.trim();
        if (currentUsername) {
            usernameSection.style.display = 'none';
            startSection.style.display = 'block';
        }
    });

    startBtn.addEventListener('click', function() {
        startSection.style.display = 'none';
        questionSection.style.display = 'block';
        resetQuiz(); 
        questions = getRandomQuestions(); 
        displayQuestion(); 
        startTimer();
    });

    function updateLeaderboard() {
        const quizAttempt = {
            username: currentUsername,
            score: score,
            timestamp: new Date().toLocaleString(),
            answers: userAnswers
        };
        leaderboard.push(quizAttempt);
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
    }

    function displayTabContent() {
        document.getElementById('pills-home').innerHTML = `
            <div class="text-center">
                <h4>Your Score</h4>
                <p class="display-4">${score} / ${questions.length * 100}</p>
                <p>${getScoreMessage(score)}</p>
            </div>
        `;

        document.getElementById('pills-profile').innerHTML = `
            <div class="answers-review">
                ${userAnswers.map((answer, index) => `
                    <div class="answer-item mb-3 p-3 ${answer.isCorrect ? 'bg-success' : 'bg-danger'} bg-opacity-10">
                        <p><strong>Question ${index + 1}:</strong> ${answer.question}</p>
                        <p><strong>Your Answer:</strong> ${answer.selected}</p>
                        <p><strong>Correct Answer:</strong> ${answer.correct}</p>
                    </div>
                `).join('')}
            </div>
        `;

        document.getElementById('pills-contact').innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${leaderboard.slice(0, 10).map((entry, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${entry.username}</td>
                                <td>${entry.score}</td>
                                <td>${entry.timestamp}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function getScoreMessage(score) {
        const percentage = (score / (questions.length * 100)) * 100;
        if (percentage >= 80) return "Excellent! You're a quiz master! 🏆";
        if (percentage >= 60) return "Good job! Keep practicing! 👍";
        return "Keep trying, you can do better! 💪";
    }

    function startTimer() {
        if (timer) clearInterval(timer);
        
        const existingTimers = questionSection.querySelectorAll('.timer');
        existingTimers.forEach(timerElem => timerElem.remove());
        
        const timerElement = document.createElement('div');
        timerElement.className = 'timer';
        questionSection.querySelector('.card-body').insertBefore(timerElement, questionText);
    
        timer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `Time Left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
            if (timeLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }

    function displayQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        
        const questionCounter = document.querySelector('.question-counter');
        questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        
        optionsContainer.innerHTML = '<div class="row"></div>';
        const optionsRow = optionsContainer.querySelector('.row');

        question.options.forEach(option => {
            const optionCol = document.createElement('div');
            optionCol.className = 'col-md-6 mb-3';
            
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => selectOption(button, option));
            
            optionCol.appendChild(button);
            optionsRow.appendChild(optionCol);
        });
    }

    function selectOption(button, option) {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = true;
        });
    
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = option === currentQuestion.correct;
        button.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        if (!isCorrect) {
            buttons.forEach(btn => {
                if (btn.textContent === currentQuestion.correct) {
                    btn.classList.add('correct');
                }
            });
        }
    
        userAnswers.push({
            question: currentQuestion.question,
            selected: option,
            correct: currentQuestion.correct,
            isCorrect: isCorrect
        });
    
        selectedAnswer = option;
        if (isCorrect) score += 100;
        scoreElement.textContent = `Score: ${score}`;
    }

    function endQuiz() {
        clearInterval(timer);
        questionSection.style.display = 'none';
        resultSection.style.display = 'none';
        leaderboardSection.style.display = 'block';
        updateLeaderboard();
        displayTabContent();
    }

    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        selectedAnswer = null;
        timeLeft = 90;
        userAnswers = [];
        
        const questionCounter = document.querySelector('.question-counter');
        if (questionCounter) {
            questionCounter.textContent = `Question 1/6`;
        }
        
        if (timer) clearInterval(timer);
    }

    nextBtn.addEventListener('click', function() {
        if (!selectedAnswer) {
            alert('Please select an answer before proceeding!');
            return;
        }

        selectedAnswer = null;
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    });

    backBtn.addEventListener('click', function() {
        leaderboardSection.style.display = 'none';
        usernameSection.style.display = 'block';
        usernameInput.value = '';
        submitUsernameBtn.disabled = true;
    });

    submitUsernameBtn.disabled = true;
    startSection.style.display = 'none';
    questionSection.style.display = 'none';
    resultSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
});