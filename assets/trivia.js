const triviaStartButton = document.getElementById("trivia-start-button");
const triviaContentEl = document.getElementById("trivia-content");
const correctAnswerText = document.getElementById('correct-answer-text');
const wrongAnswerText = document.getElementById('wrong-answer-text');

let triviaQuestions = [];

function getTrivia() {

    var triviaURL = "https://opentdb.com/api.php?amount=10&type=multiple"
    fetch(triviaURL)
        .then(function (response) {
            return response.json().then(function (data) {
                const newQuestions = [];
                data.results.map(item => {
                    // console.log(item);
                    questionObj = {
                        category: item.category,
                        type: item.type,
                        difficulty: item.difficulty,
                        question: item.question,
                        answers: [
                            {
                                text: item.correct_answer,
                                isCorrect: true
                            },
                            {
                                text: item.incorrect_answers[0],
                                isCorrect: false
                            },
                            {
                                text: item.incorrect_answers[1],
                                isCorrect: false
                            },
                            {
                                text: item.incorrect_answers[2],
                                isCorrect: false
                            }
                        ]
                    };
                    newQuestions.push(questionObj);
                });

                triviaQuestions = newQuestions;
                // console.log(triviaQuestions);
            });
        })
        .then(function () {
            if (triviaQuestions.length) {
                return playTrivia();
            }
            else return;
        })
        .catch(function (err) {
            console.log("Error", err);
        });
};

function playTrivia() {

    triviaStartButton.classList.add('hide');
    showNextQuestion();
};

function showNextQuestion() {
    // console.log(triviaQuestions);
    resetState();

    if (triviaQuestions.length) {
        showQuestion(triviaQuestions[0]);

        triviaQuestions.shift();
    } else {
        endTrivia();
    }

    // console.log(triviaQuestions);
};

function showQuestion(triviaObj) {
    // console.log(triviaObj);

    const difficulty = document.createElement('h3');
    // difficulty.classList.add('');
    difficulty.innerHTML = `Difficulty: ${triviaObj.difficulty}`;

    const category = document.createElement('h3');
    // category.classList.add('');
    category.innerHTML = `Category: ${triviaObj.category}`;

    const question = document.createElement('h2');
    // question.classList.add('');
    question.innerHTML = triviaObj.question;

    const answerContainerEl = document.createElement('ul');
    // answerContainerEl.classList.add('');
    triviaObj.answers.sort(() => Math.random() - .5);
    triviaObj.answers.map(answer => {
        const answerButtonEl = document.createElement('button');
        // answerButtonEl.classList.add('');
        answerButtonEl.innerHTML = answer.text;
        if (answer.isCorrect) answerButtonEl.dataset.isCorrect = answer.isCorrect        
        answerButtonEl.addEventListener('click', answerChoice);

        answerContainerEl.appendChild(answerButtonEl);
    });

    triviaContentEl.appendChild(category);
    triviaContentEl.appendChild(difficulty);
    triviaContentEl.appendChild(question);
    triviaContentEl.appendChild(answerContainerEl);
};

function answerChoice(e) {
    const selectedAnswer = e.target;
    if (selectedAnswer.dataset.isCorrect) correctAnswer(selectedAnswer);
    if (!selectedAnswer.dataset.isCorrect) wrongAnswer(selectedAnswer);
};

function correctAnswer(element) {
    element.classList.add('correct-answer');

    wrongAnswerText.classList.add('hide');
    correctAnswerText.classList.remove('hide');

    setTimeout(function() {
        showNextQuestion();
    }, 3000);

};

function wrongAnswer(element) {
    element.classList.add('wrong-answer');
    wrongAnswerText.classList.remove('hide');   
};

function resetState() {
    while (triviaContentEl.firstChild) triviaContentEl.removeChild(triviaContentEl.firstChild);

    correctAnswerText.classList.add('hide');
    wrongAnswerText.classList.add('hide');
};

function endTrivia() {
    console.log("Thanks for playing!")
};

triviaStartButton.addEventListener("click", getTrivia);


