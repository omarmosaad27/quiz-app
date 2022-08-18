// 0-  select elemnts 
const count = document.querySelector(".count span")
const bullets = document.querySelector(".bullets .spans")
const quiz_area = document.querySelector(".quiz-area")
const answers_area = document.querySelector(".answers-area")
const submit = document.querySelector(".submit-button")
const results = document.querySelector(".results")
const countdownEle = document.querySelector(".countdown")
let currentIndex = 0;
let rightAnswers = 0;
// 1-  fetch questions from json file

function getQuestions (){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText)
            let qCount = questions.length;
            console.log(questions);

            // create bullets and set count
            createBullets(qCount)

            // add question data
            addQuestionData(questions[currentIndex], qCount)
            countdown(5, qCount);
            // submit
            submit.addEventListener("click", () => {
                let rightAnswer = questions[currentIndex].right_answer;
                // increase index 
                currentIndex++;
                // check answer function 
                checkAnswer(rightAnswer, qCount);
                
                // remove previous question
                quiz_area.innerHTML = ""
                answers_area.innerHTML = ""
                 // add question data
                addQuestionData(questions[currentIndex], qCount);

                // handle bullets class
                handleBullets();
                clearInterval(countdownInterval)
                countdown(5, qCount);
                // show Results
                showResults(qCount);
            })
        }
    }
    myRequest.open("GET", 'question.json', true)
    myRequest.send()
}

getQuestions()


// get dynmaically questions count 

function createBullets(nums) {
    count.innerHTML = nums;
    // create bullets
    for (let i = 0; i < nums; i++){
        // create bullet
        let span = document.createElement("span")
        // check if it's first
        if (i === 0) {
            span.className = "on";
        }
        // append bullets
        bullets.append(span)
    }
}

// handleBullets
function handleBullets() {
    let bulletsspan = Array.from(document.querySelectorAll(".bullets .spans span"))
    for (let i = 0; i < bulletsspan.length; i++){
        if (i === currentIndex) {
            bulletsspan[i].classList.add("on")
        }
    }
}


// add questions to page
function addQuestionData(object, count) {
    if (currentIndex < count) {
        let questionTitle = document.createElement("h2")
        let questiontext = document.createTextNode(object.title)
        questionTitle.append(questiontext)
        quiz_area.append(questionTitle)
        for (let i = 1; i <= 4; i++){
            // main div
            let answer = document.createElement("div")
            answer.className = "answer"
            // input radio
            let inputRadio = document.createElement("input")
            inputRadio.setAttribute("type", "radio")
            inputRadio.setAttribute("id", `answer_${i}`)
            inputRadio.setAttribute("name", "question")
            inputRadio.setAttribute("data-answer", object[`answer_${i}`])
            if (i === 1) {
                inputRadio.checked = true
            }
            answer.append(inputRadio)
            // label
            let label = document.createElement("label")
            label.setAttribute("for",`answer_${i}`)
            let labelText = document.createTextNode(object[`answer_${i}`])
            label.append(labelText)
            answer.append(label)
            // append answer
            answers_area.append(answer)
        }
    }
}


// check answer function 
function checkAnswer(rightAnswer,count) {
    let answers = document.getElementsByName("question")
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++){
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer
        }
    }
    
    if (rightAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log("good answer");
    }
} 


//showResults
function showResults(count) {
    let result;

    if (currentIndex === count) {
        quiz_area.remove()
        answers_area.remove()
        submit.remove()
        bullets.remove()
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            result = `<span class="good">Good</span> ${rightAnswers} from ${count} Is Good`
        } else if (rightAnswers === count) {
            result = `<span class="perfect">Perfect</span> all answers were right`
        } else {
            result = `<span class="bad">Bad</span> ${rightAnswers} from ${count} Is Bad`
        }
        results.innerHTML = result;
        results.style.padding = "1rem"
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);

        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        countdownEle.innerHTML = `${minutes}:${seconds}`;

        if (--duration < 0) {
            clearInterval(countdownInterval);
            submit.click();
        }
        }, 1000);
    }
}