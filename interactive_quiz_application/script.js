// Enhanced Quiz Questions
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and most populous city of France."
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is often called the 'Red Planet' because of its reddish appearance."
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
        correctAnswer: 1,
        explanation: "The Blue Whale is the largest animal ever known to have existed."
    },
    {
        question: "Which language runs in a web browser?",
        options: ["Java", "C", "Python", "JavaScript"],
        correctAnswer: 3,
        explanation: "JavaScript is the programming language that runs in web browsers."
    },
    {
        question: "What year was JavaScript launched?",
        options: ["1996", "1995", "1994", "None of the above"],
        correctAnswer: 1,
        explanation: "JavaScript was created by Brendan Eich in 1995 while he was at Netscape."
    },
    {
        question: "Which of these is not a JavaScript framework?",
        options: ["React", "Angular", "Laravel", "Vue"],
        correctAnswer: 2,
        explanation: "Laravel is a PHP framework, not a JavaScript framework."
    },
    {
        question: "What does CSS stand for?",
        options: [
            "Creative Style Sheets",
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Colorful Style Sheets"
        ],
        correctAnswer: 2,
        explanation: "CSS stands for Cascading Style Sheets."
    },
    {
        question: "Which HTML tag is used for creating a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<hyperlink>"],
        correctAnswer: 1,
        explanation: "The <a> tag defines a hyperlink, which is used to link from one page to another."
    },
    {
        question: "Which symbol is used for single line comments in JavaScript?",
        options: ["//", "/*", "#", "--"],
        correctAnswer: 0,
        explanation: "// is used for single-line comments in JavaScript."
    },
    {
        question: "What does the 'DOM' stand for in web development?",
        options: [
            "Document Object Model",
            "Data Object Management",
            "Digital Output Module",
            "Display Object Method"
        ],
        correctAnswer: 0,
        explanation: "DOM stands for Document Object Model, which represents the page so programs can change the document structure, style, and content."
    }
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const questionCount = document.getElementById('question-count');
const timerElement = document.getElementById('timer');
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const pointsElement = document.getElementById('points');
const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const resultElement = document.getElementById('result');
const resultTitle = document.getElementById('result-title');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.getElementById('progress-bar');
const resultGraphic = document.getElementById('result-graphic');
const circle = document.querySelector('.circle');
const percentageText = document.querySelector('.percentage');

// Quiz variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedOption = null;
let quizCompleted = false;

// Initialize the app
function init() {
    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextQuestion);
    restartBtn.addEventListener('click', restartQuiz);
    shareBtn.addEventListener('click', shareResults);
}

// Start quiz
function startQuiz() {
    // Switch screens with animation
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');

    // Change background when quiz starts
    document.body.classList.add('quiz-bg');

    // Reset quiz variables
    currentQuestionIndex = 0;
    score = 0;
    quizCompleted = false;
    updateScore();

    // Show first question
    showQuestion();
}

// Show current question
function showQuestion() {
    resetState();
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    // Update progress
    const progress = ((currentQuestionIndex) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Update question count
    questionCount.textContent = `Question ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    
    // Set question text with animation
    questionElement.textContent = currentQuestion.question;
    questionElement.classList.add('animate__animated', 'animate__fadeIn');
    
    // Create options with delay animation
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-btn', 'animate-option');
        button.style.animationDelay = `${index * 0.1}s`;
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
    
    // Start timer
    startTimer();
    
    // Remove animation class after it completes
    setTimeout(() => {
        questionElement.classList.remove('animate__animated', 'animate__fadeIn');
    }, 1000);
}

// Reset quiz state for new question
function resetState() {
    // Reset timer
    clearInterval(timer);
    timeLeft = 30;
    timeElement.textContent = timeLeft;
    
    // Hide next button
    nextBtn.classList.add('hide');
    
    // Clear options
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
    
    selectedOption = null;
}

// Select answer
function selectAnswer(selectedIndex) {
    if (selectedOption !== null) return;
    
    selectedOption = selectedIndex;
    clearInterval(timer);
    
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const options = optionsContainer.children;
    const correctIndex = currentQuestion.correctAnswer;
    
    // Disable all options
    for (let i = 0; i < options.length; i++) {
        options[i].classList.add('disabled');
    }
    
    // Mark correct and incorrect answers
    options[correctIndex].classList.add('correct');
    if (selectedIndex !== correctIndex) {
        options[selectedIndex].classList.add('incorrect');
    }
    
    // Update score if correct
    if (selectedIndex === correctIndex) {
        score++;
        updateScore();
        
        // Add celebration effect
        options[selectedIndex].insertAdjacentHTML('beforeend', ' 🎉');
    } else {
        // Show correct answer explanation
        options[correctIndex].insertAdjacentHTML('beforeend', `<div class="explanation">${currentQuestion.explanation}</div>`);
    }
    
    // Show next button with animation
    setTimeout(() => {
        nextBtn.classList.remove('hide');
        nextBtn.classList.add('animate__animated', 'animate__fadeInUp');
    }, 500);
}

// Update score display
function updateScore() {
    pointsElement.textContent = score;
    scoreElement.classList.add('animate__animated', 'animate__pulse');
    setTimeout(() => {
        scoreElement.classList.remove('animate__animated', 'animate__pulse');
    }, 1000);
}

// Start timer for current question
function startTimer() {
    timeLeft = 30;
    timeElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        // Add warning when time is running low
        if (timeLeft <= 5) {
            timerElement.style.color = 'var(--danger)';
            timeElement.classList.add('animate__animated', 'animate__pulse');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

// Handle time up
function timeUp() {
    if (selectedOption !== null) return;
    
    const options = optionsContainer.children;
    const correctIndex = quizQuestions[currentQuestionIndex].correctAnswer;
    
    // Disable all options
    for (let i = 0; i < options.length; i++) {
        options[i].classList.add('disabled');
    }
    
    // Mark correct answer
    options[correctIndex].classList.add('correct');
    options[correctIndex].insertAdjacentHTML('beforeend', `<div class="explanation">${quizQuestions[currentQuestionIndex].explanation}</div>`);
    
    // Show next button with animation
    setTimeout(() => {
        nextBtn.classList.remove('hide');
        nextBtn.classList.add('animate__animated', 'animate__fadeInUp');
    }, 500);
}

// Move to next question
function nextQuestion() {
    // Remove animation from next button
    nextBtn.classList.remove('animate__animated', 'animate__fadeInUp');
    
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

// Show results
function showResults() {
    quizCompleted = true;
    
    // Switch screens with animation
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    // Calculate results
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // Update result text
    resultElement.textContent = `You scored ${score} out of ${totalQuestions}`;
    percentageText.textContent = `${percentage}%`;
    
    // Animate the circular progress
    circle.style.setProperty('--percentage', percentage);
    
    // Set feedback based on score
    let feedback = '';
    let title = '';
    
    if (percentage >= 90) {
        title = "Perfect! 🎯";
        feedback = "Outstanding performance! You're a true expert!";
    } else if (percentage >= 75) {
        title = "Excellent! 🌟";
        feedback = "Great job! You have an impressive knowledge!";
    } else if (percentage >= 50) {
        title = "Good Job! 👍";
        feedback = "Well done! You have a solid understanding!";
    } else if (percentage >= 25) {
        title = "Keep Learning! 📚";
        feedback = "You're on the right track! Keep practicing to improve!";
    } else {
        title = "Try Again! 🔄";
        feedback = "Don't worry! Every expert was once a beginner. Keep learning!";
    }
    
    resultTitle.textContent = title;
    feedbackElement.textContent = feedback;
    
    // Add confetti for good scores
    if (percentage >= 75) {
        createConfetti();
    }
}

// Create confetti effect
function createConfetti() {
    const confettiCount = 100;
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-10px';
        confetti.style.opacity = '0.8';
        confetti.style.transform = 'rotate(0deg)';
        
        const animationDuration = Math.random() * 3 + 2;
        confetti.style.animation = `fall ${animationDuration}s linear forwards`;
        
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, animationDuration * 1000);
    }
    
    // Remove container after all confetti is gone
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Get random color for confetti
function getRandomColor() {
    const colors = [
        '#4361ee', '#3f37c9', '#4cc9f0', '#4895ef', 
        '#f72585', '#b5179e', '#7209b7', '#560bad',
        '#f8961e', '#f3722c', '#f94144', '#43aa8b',
        '#4d908e', '#577590', '#277da1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Restart quiz
function restartQuiz() {
    // Switch screens with animation
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
    
    // Reset progress bar
    progressBar.style.width = '0%';
    
    // Remove quiz background on restart
    document.body.classList.remove('quiz-bg');
}

// Share results
function shareResults() {
    const totalQuestions = quizQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Results',
            text: `I scored ${score}/${totalQuestions} (${percentage}%) on this awesome quiz! Can you beat my score?`,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Fallback for browsers that don't support Web Share API
function fallbackShare() {
    const text = `I scored ${score}/${quizQuestions.length} on this quiz!`;
    prompt('Copy to clipboard: Ctrl+C, Enter', text);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    .explanation {
        font-size: 0.8rem;
        margin-top: 0.5rem;
        color: var(--gray);
        font-style: italic;
    }

    /* Removed body background gradient */

    body.quiz-bg::after {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 99999;
        pointer-events: none;
        background: rgba(223, 24, 24, 0.2);
    }

    .screen {
        display: none;
    }
    .screen.active {
        display: block;
    }
`;
document.head.appendChild(style);