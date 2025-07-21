const random = (max = 1, min = 0) => {
  return Math.round(Math.random() * (max - min) + min)
}

export default function generateQuizz(req, res){
  const operators = ["+", "-", "*", "/"]
  const terms = []
  const defaultTotal = 2
  const random = random(5)
  const termsTotal = random <= 1 ? 2 : random
  
  for(let i = 0; i < termsTotal; i++){
    terms.push(random(20, 2))

    if(i < termsTotal - 1) terms.push(operators[random(operators.length-1)])
  }
  res.status(200).json({question : terms})
}
