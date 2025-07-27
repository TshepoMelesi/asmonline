const questionEl = document.querySelector(".question")
const nextQuestionBtn = document.querySelector(".next-btn")
const answerBtn = document.querySelector(".answer-btn")
const operations = document.querySelectorAll(".operation")
const difficulty = document.querySelectorAll(".difficulty")

const diffLevels = ["beginner", "intermediate", "master"]
const signMap = {addition:"+", subtraction:"-",multiplication:"x",division:"/"}
const signs = ["+", "/", "-", "x"]

const generateFraction = () => {
	return [random(10, 1), random(10, 0)]
}

const createElem = (type, className) => {
	const elem = document.createElement(type)
	elem.setAttribute("class", className)
	
	return elem
}

const appendElem = (child, parent) => {
	return parent.appendChild(child)
}

const createFraction = (terms = [5, 6]) => {
	const expression = createElem("div", "fraction big illu-item")
	
	if(terms.length == 1 || terms[1] <= 1){
		const term = createElem("p", "term level1")
		term.innerText = terms[0]
		appendElem(term, expression)

		return expression
	}
	const numerator = createElem("div", "numerator")
	numerator.innerHTML = `<p class="level1">${terms[0]}</p>`
	const line = createElem("div", "line")
	const denominator = createElem("div", "denominator")
	denominator.innerHTML = `<p class="level1">${terms[1]}</p>`

	appendElem(numerator, expression)
	appendElem(line, expression)
	appendElem(denominator, expression)

	return expression
}

const createOperator = (sign = "#") => {
	const op = sign == "all" ? signs[random(3, 0)]: signMap[sign]
	const elem = createElem("p", "operator level1")
	elem.innerText = op
	
	return elem
}

const emptyBoard = () => {
	questionEl.innerHTML = ""
}

const generateQuestion = (termsArr, sign) => {
	emptyBoard()
	const expression = createElem("div", "expression")
	let cFraction

	for(let i = 0; i < termsArr.length; i++){
		 appendElem(createFraction(termsArr[i]), questionEl)
		 if(i < termsArr.length - 1) appendElem(createOperator(sign), questionEl)
	}
		
}
const fractions = (sign = "addition", totalTerms = 2) => {
	const fraction = []

	for(let i = 0; i <=  totalTerms; i++){
		fraction.push(generateFraction())
	}
	
	const question = generateQuestion(fraction, sign)

    return {
        id : 111111,
        title : "Naming fractions.",
        question,
        type : "fill-in"
    }
}

const writeToBoard = (operator, level) => {
	const termsTotal = level === 0 ? random(2, 1) : level === 1 ? random(4, 2) : random(6, 4)
	const question = fractions(operator, termsTotal)
	// const html = `<p>${question}</p>`

	// questionEl.innerHTML = html
}

const handleNextQuestion = () => {
	const operator = [...operations].filter(op => op.checked === true)
	const difLevel = [...difficulty].filter(diff => diff.checked === true)
	
	writeToBoard(operator[0].id, diffLevels.indexOf(difLevel[0].id))
}

nextQuestionBtn.onclick = () => handleNextQuestion()
handleNextQuestion()
