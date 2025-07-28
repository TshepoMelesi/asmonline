const questionEl = document.querySelector(".question")
const answerEl = document.querySelector(".answer")
const nextQuestionBtn = document.querySelector(".next-btn")
const answerBtn = document.querySelector(".answer-btn")
const operations = document.querySelectorAll(".operation")
const difficulty = document.querySelectorAll(".difficulty")

const diffLevels = ["beginner", "intermediate", "master"]
const signMap = {addition:"+", subtraction:"-",multiplication:"x",division:"/"}
const signs = ["+", "/", "-", "x"]

function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function simplify([num, den]) {
  const sign = Math.sign(den);
  
  if(den === 0) den = 1
  
  const factor = gcd(num, den);
  return [sign * num / factor, sign * den / factor];
}

function addFrac([n1, d1], [n2, d2]) {
  return simplify([n1 * d2 + n2 * d1, d1 * d2]);
}

function subFrac([n1, d1], [n2, d2]) {
  return simplify([n1 * d2 - n2 * d1, d1 * d2]);
}

function mulFrac([n1, d1], [n2, d2]) {
  return simplify([n1 * n2, d1 * d2]);
}

function divFrac([n1, d1], [n2, d2]) {
  if (n2 === 0) throw new Error("Division by zero.");
  return simplify([n1 * d2, d1 * n2]);
}

function evaluate(expr) {
  // Step 1: Copy the array to avoid mutation
  const tokens = expr.map(x => Array.isArray(x) ? [...x] : x);

  // Step 2: Handle Multiplication and Division (left to right)
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "x" || token === "/") {
      const left = tokens[i - 1];
      const right = tokens[i + 1];
      const result = token === "x" ? mulFrac(left, right) : divFrac(left, right);
      tokens.splice(i - 1, 3, result); // replace left op right with result
      i = i - 1;
    } else {
      i++;
    }
  }

  // Step 3: Handle Addition and Subtraction (left to right)
  i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    if (token === "+" || token === "-") {
      const left = tokens[i - 1];
      const right = tokens[i + 1];
      const result = token === "+" ? addFrac(left, right) : subFrac(left, right);
      tokens.splice(i - 1, 3, result); // replace left op right with result
      i = i - 1;
    } else {
      i++;
    }
  }

  // Final result
  return simplify(tokens[0]);
}


const generateFraction = () => {
	return [random(10, 1), random(10, 1)]
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
	
	return {sign : op, elem}
}

const emptyBoard = () => {
	questionEl.innerHTML = ""
}

const generateQuestion = (termsArr, sign) => {
	emptyBoard()
	const expression = createElem("div", "expression")
	let op, fullQuestion = []
	
	for(let i = 0; i < termsArr.length; i++){
		 appendElem(createFraction(termsArr[i]), questionEl)
		 
		 fullQuestion.push(termsArr[i])
		 
		 if(i < termsArr.length - 1){
			op = createOperator(sign)
			
			appendElem(op.elem, questionEl)
			fullQuestion.push(op.sign)
		 }
	}
	
	// add question to session storage
	addSessionItem("currentQuestion", fullQuestion)	
	addSessionItem("currentAnswer", calculate(getSessionItem("currentQuestion")))	
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

const addSessionItem = (itemName, itemValue) => {
	sessionStorage.setItem(itemName, JSON.stringify(itemValue))
}

const getSessionItem = (itemName) => {
	return JSON.parse(sessionStorage.getItem(itemName) || "null")
}

const writeToBoard = (operator, level) => {
	const termsTotal = level === 0 ? random(2, 1) : level === 1 ? random(4, 2) : random(6, 4)
	const question = fractions(operator, termsTotal)
}

const handleNextQuestion = () => {
	answerEl.style.right = "-100%";
	const operator = [...operations].filter(op => op.checked === true)
	const difLevel = [...difficulty].filter(diff => diff.checked === true)
	
	writeToBoard(operator[0].id, diffLevels.indexOf(difLevel[0].id))
}

const calculate = (question) => {
	// following BODMAS operation.

	const answer = evaluate(question)
	return answer
}

const tryAnswerQuestion = () => {
	const question = getSessionItem("currentQuestion")
	
	if(!question) return alert("No question to mark! Try again.")

	// slide the answer board
	answerEl.style.right = 0;
	
	// get and write answer
	 const answer = calculate(question)
	
	// display answer
	answerEl.innerHTML = ""
	const answerExp= createElem("div", "expression")
	const equal = createElem("p", "operator-answer")
	equal.innerText = "="
	
	appendElem(equal, answerEl)
	appendElem(createFraction(answer), answerEl)
}

nextQuestionBtn.onclick = () => handleNextQuestion()
answerBtn.onclick = () => tryAnswerQuestion()
handleNextQuestion()
