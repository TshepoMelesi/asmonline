const requestBtn = document.querySelector(".request-btn")
let nextBtn, loadedQuizz = false, questions = [], questionsDone = []
let currentQuestion

const random = (max, min) => {
    return Math.round(Math.random() * (max - min) + min)
}
const randomizeOptions = (options) => {
    let optionsTotal = options.length
    let randomOptions = []

    for(let i = 0; i < optionsTotal; i++){
        randomOptions.push(options.splice(random(options.length - 1, 0), 1))
    }

    return randomOptions
}
const getNamingFractions = () => {
    const numbers = [
        ["one", "one"],
        ["two", "halves"],
        ["three", "thirds"],
        ["four", "fourths"],
        ["five", "fifths"],
        ["six", "sixths"],
        ["seven", "sevenths"],
        ["eight", "eighths"],
        ["nine", "nineths"],
        ["ten", "tenths"]
    ]
    const fraction = [random(10, 1), random(10, 2)]

    const options = [
            "none",
            numbers[fraction[1]-1][0] + " in " + numbers[fraction[0]-1][1],
            numbers[fraction[1]-1][1] + " " + numbers[fraction[0]-1][0],
            fraction[0] === fraction[1] ? "1" : numbers[fraction[0]-1][0] + " " + numbers[fraction[1]-1][1]
        ]
    
    let  answer

    if(fraction[1] === fraction[0]){
        answer = "1"
    } else {
        answer = numbers[fraction[0]-1][0] + " " + numbers[fraction[1]-1][1]
    }

    return {
        id : 111111,
        type : "MCQ",
        title : "Naming fractions.",
        question : fraction[0] + "/" + fraction[1],
        options : randomizeOptions(options),
        answer
    }
}
const getFractionAddNumber = () => {
    const fraction = [random(10, 1), random(10, 2), random(10, 2)]

    const question = `
    <div class="expression">
        <p class="big"> ${fraction[2]} + </p>
        <div class="fraction big illu-item">
            <div class="numerator">
                <p>${fraction[0]}</p>
            </div>
            <div class="line"></div>
            <div class="denomerator">
                <p>${fraction[1]}</p>
            </div>
        </div>
    </div>
    `

    return {
        id : 111111,
        title : "Naming fractions.",
        question,
        type : "fill-in"
    }
}
const getAddFractions = () => {
    const fraction = [random(10, 1), random(10, 2), random(10, 2), random(10, 2)]

    const question = `
    <div class="expression">
        <div class="fraction big illu-item">
            <div class="numerator">
                <p>${fraction[0]}</p>
            </div>
            <div class="line"></div>
            <div class="denomerator">
                <p>${fraction[1]}</p>
            </div>
        </div>

        <p class="big"> + </p>

        <div class="fraction big illu-item">
            <div class="numerator">
                <p>${fraction[2]}</p>
            </div>
            <div class="line"></div>
            <div class="denomerator">
                <p>${fraction[3]}</p>
            </div>
        </div>
    </div>
    `

    return {
        id : 111111,
        title : "Naming fractions.",
        question,
        type : "fill-in"
    }
}
const getQuestion = (topic) => {
    let question
    switch(topic){
        case "naming-fractions" : 
            question = getNamingFractions()
            break
        case "fraction+number" :
            question = getFractionAddNumber()
            break
        case "fraction+fraction" :
            question = getAddFractions()
            break
        default : 
            question = {
                title : "cannot understand the topic!", 
                question : "try again."
            }
    }

    return question
}
// should return html format
const loadQuizz = (topic, num) => {
    if(loadedQuizz) return alert("A quizz is on going.")

    const questions = []

    for(let i = 0; i < num; i++){
        questions.push(getQuestion(topic))
    }

    loadedQuizz = true
    return questions
}
const formatChoice = (id, choice) => {
    return `
    <div class="choice">
        <p>${choice}</p>
        <input type="radio" class="option-choice" name="id-${id}" data-value="${choice}">
    </div>
    `
}
const formatQuizz = (quizz) => {
    if(quizz.type === "MCQ"){
        return `
            <div>
                <div class="question-container">
                    <h2 class="question">${quizz.question}</h2>
                </div>

                <div class="options">
                    ${quizz.options.map(o => formatChoice(quizz.id, o)).join("")}
                </div>
                <button class="next-btn" onclick="displayQuizz(this, true)">
                    next quizz
                </button>
            </div>
            `
    }else if(quizz.type === "fill-in"){
        return `
            <div>
                <div class="question-container">
                    <h2 class="question">${quizz.question}</h2>
                </div>

                <div class="fill-in">
                    <button class="next-btn" data-type="fill-in" data-topic="fraction+number" onclick="displayQuizz(this, true)">
                        next quizz
                    </button>
                </div>
            `
    }
    
}
const markAttempts = (attempts) => {
    let correct = 0
    attempts.forEach(attempt => {
        if(attempt.answer === attempt.currentQuestion.answer) correct++
    })
    return Math.round((correct/attempts.length) * 100)
}
const loadResults = (e, attempts) => {
    const parent = e.parentNode
    const marks = markAttempts(attempts)
    const message = marks < 50 ? "You didn't do well." : marks < 75 ? "Well done! You are getting there." : "You got perfect! Excellent!"
    parent.innerHTML = ""
    parent.innerHTML = `
    <div class="results-container">
        <h2>${message}</h2>
        <h3>You got</h3>
        <p class="percent">${marks}%</p>
    </div>
    <button 
        onclick="tryLoadingQuizz(this)" 
        data-topic="naming-fractions" class="request-btn"
        >
        WANNA TRY AGAIN?
    </button>
    `
}
const getAnswer = () => {
    const options = [...document.querySelectorAll(".option-choice")]
    const selected = options.filter(option => option.checked === true)[0]

    if (!selected) return alert("No answer selected")
    
    return selected.getAttribute("data-value")
}

const getInputs = () => {
    const inputs = [...document.querySelectorAll(".step-field")].map(i => i.value)

    for(i of inputs){
        if(i == ""){
            return alert("Fill in all fields")
        }
    }
}
const displayQuizz = (e, gettingNextQuestion = false) => {
    if(questions.length < 1) {
        loadedQuizz = false

        return loadResults(e, questionsDone)
    }

    let quizzContainer = e.parentNode

    if(gettingNextQuestion){
        let answer

        if(e.getAttribute("data-type") === "fill-in"){
            answer = getInputs()
        }else{
            answer = getAnswer()
        }
        if(!answer) return

        questionsDone.push({answer, currentQuestion})
    }

    // empty the container
    quizzContainer.innerHTML = ""

    currentQuestion = questions.shift()
    // display quizz
    quizzContainer.innerHTML = formatQuizz(currentQuestion)
}
const tryLoadingQuizz = (btn) => {
    currentQuestion = null
    questionsDone = []

    const num = 10
    questions = loadQuizz(btn.getAttribute("data-topic"), num)
    
    // display quizz
    displayQuizz(btn)
}

const convertTo = (item, to) => {
    return `<p class="${to}">${item}</p>`
}

const toFraction = (fraction) => {
    return `
        <div class="fraction">
            <div class="numerator">${convertTo(fraction[0], "term")}</div>
            <div class="line"></div>
            <div class="denominator">${convertTo(fraction[1], "term")}</div>
        </div>
    `
}

class Expression{
    constructor(expression = [["1", "3"], "+", "2"]){
        this.operators = ["/", "*", "+", "-"]
        this.expression = expression
    }

    addToExp(item){
        this.expression.push(...item) // ["+", "6", "3x"] => [["1", "3"], "+", "2", ["+", "6", "3x"]]
    }
    getExpression(){
        return this.expression
    }
    htmlFormat(){
        let expression = ``

        this.expression.forEach(e => {
            if(typeof e === "object"){
                expression += toFraction(e)
            } else {
                if(this.operators.includes(e)) {
                    expression += convertTo(e, "operator")
                }else{
                    expression += convertTo(e, "term")
                }
            }
        })

        return `<div class="expression">${expression}</div>`
    }
}

// const myExp = new Expression([["6xy", "x+4"], "+", "5"])

const getFactors = (number) => {
    if(typeof number !== "number") return alert("Cannot get factors...")
    if(number <= 0) return null

    const factors = []

    for(let i = 1; i <= Math.round(number); i++){
        if(number % i === 0) factors.push(i)
    }

    return factors
}

const HCF = (num1, num2) => {
    const factors1 = getFactors(num1)
    const factors2 = getFactors(num2)
    const common = []

    factors1.forEach(fac => {
        if(factors2.includes(fac)){
            common.push(fac)
        }
    })

    return common[common.length - 1]
}

const simplifyFraction = (fraction) => {
    return fraction.map(i => (i / HCF(...fraction)))
}
