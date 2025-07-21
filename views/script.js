const inputs = [...document.querySelectorAll(".input")]
const dragBox = document.querySelector(".drag-options")
let tempAnswer, currInput

dragBox.addEventListener("dragstart", (e) => {
    tempAnswer = e.target.innerText
})

dragBox.addEventListener("dragend", (e)=>{
    if(currInput){
        currInput.value = tempAnswer
        e.target.style.opacity = 0.7
        e.target.setAttribute("draggable", "false")
    }
})

inputs.forEach(input => {
    input.addEventListener("dragenter", (e) =>{
        currInput = e.target
    })

    input.addEventListener("dragleave", (e) =>{
        setTimeout(() => {currInput = null}, 300)
    })
})