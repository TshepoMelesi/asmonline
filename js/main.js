body.classList.add("dark")

const toggleTheme = () => {
    if(body.classList[0] === "dark"){
        body.classList = "light"
    } else{
        body.classList = "dark"
    }
}

toggleBtn.onclick = () => {
    toggleTheme()
}

const handlePayment = () => {
    window.location.href = '/api/payfast'
}

console.log("test")
