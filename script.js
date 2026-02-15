const jokeDisplay = document.getElementById("joke");
const jokeBtn = document.getElementById("btn");
const card = document.querySelector(".glass-card");
const API_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

let jokeHistory = [];
let isProcessing = false;

const updateInterface = (loading) => {
    isProcessing = loading;
    jokeBtn.disabled = loading;
    jokeBtn.style.filter = loading ? "grayscale(1)" : "none";
    jokeBtn.style.cursor = loading ? "not-allowed" : "pointer";
    jokeBtn.innerText = loading ? "Fetching..." : "Next Joke";
    
    if (loading) {
        card.style.border = "1px solid rgba(99, 102, 241, 0.5)";
        jokeDisplay.style.filter = "blur(4px)";
    } else {
        card.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        jokeDisplay.style.filter = "none";
    }
};

async function getJoke() {
    if (isProcessing) return;
    
    updateInterface(true);

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        let finalJoke = "";
        if (data.type === "single") {
            finalJoke = data.joke;
        } else {
            finalJoke = `${data.setup} <br><br> <span style="color: #a855f7; font-weight: 600;">${data.delivery}</span>`;
        }

        setTimeout(() => {
            jokeDisplay.innerHTML = finalJoke;
            jokeHistory.push({
                text: finalJoke,
                timestamp: new Date().toLocaleTimeString()
            });
            
            if (jokeHistory.length > 10) jokeHistory.shift();
            
            console.log("Session History:", jokeHistory);
            updateInterface(false);
        }, 400);

    } catch (err) {
        jokeDisplay.innerText = "Error: Comedian is offline.";
        updateInterface(false);
    }
}

const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key.toLowerCase() === "j") {
        getJoke();
    }
};

const initializeApp = () => {
    getJoke();
    jokeBtn.addEventListener("click", getJoke);
    window.addEventListener("keydown", handleKeyPress);
    
    setInterval(() => {
        console.log("App active for: " + performance.now() + "ms");
    }, 60000);
};

document.addEventListener("DOMContentLoaded", initializeApp);
