const jokeDisplay = document.getElementById("joke");
const jokeBtn = document.getElementById("btn");
const card = document.querySelector(".glass-card");
const API_URL = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

let sessionHistory = JSON.parse(localStorage.getItem("joke_cache")) || [];
let currentJokeState = "";
let isRequesting = false;

const uiController = {
    setLoading: (state) => {
        isRequesting = state;
        jokeBtn.style.pointerEvents = state ? "none" : "auto";
        jokeBtn.style.filter = state ? "brightness(0.7) grayscale(0.5)" : "none";
        jokeBtn.innerHTML = state ? "<span>🔄</span> Syncing..." : "Get New Joke";
        
        if (state) {
            jokeDisplay.style.transform = "scale(0.98)";
            jokeDisplay.style.filter = "blur(2px)";
        } else {
            jokeDisplay.style.transform = "scale(1)";
            jokeDisplay.style.filter = "none";
        }
    },
    updateCardGlow: (type) => {
        const colors = {
            programming: "rgba(99, 102, 241, 0.4)",
            misc: "rgba(168, 85, 247, 0.4)",
            default: "rgba(255, 255, 255, 0.1)"
        };
        card.style.boxShadow = `0 20px 40px ${colors[type] || colors.default}`;
    }
};

const storageManager = {
    save: (content) => {
        const entry = {
            id: Date.now(),
            text: content,
            date: new Date().toISOString()
        };
        sessionHistory.push(entry);
        if (sessionHistory.length > 20) sessionHistory.shift();
        localStorage.setItem("joke_cache", JSON.stringify(sessionHistory));
    },
    clear: () => {
        sessionHistory = [];
        localStorage.removeItem("joke_cache");
    }
};

async function handleJokeRequest() {
    if (isRequesting) return;
    uiController.setLoading(true);

    try {
        const res = await fetch(API_URL);
        const json = await res.json();

        let output = "";
        if (json.type === "single") {
            output = json.joke;
        } else {
            output = `${json.setup} <br><br> <em style="color: #a855f7;">${json.delivery}</em>`;
        }

        setTimeout(() => {
            currentJokeState = output.replace(/<[^>]*>?/gm, '');
            jokeDisplay.innerHTML = output;
            uiController.updateCardGlow(json.category.toLowerCase());
            storageManager.save(currentJokeState);
            uiController.setLoading(false);
            
            console.log(`Successfully cached joke ID: ${json.id}`);
        }, 500);

    } catch (err) {
        console.error("Transmission Error:", err);
        jokeDisplay.innerText = "Connection lost. Please check your internet.";
        uiController.setLoading(false);
    }
}

const copyToClipboard = () => {
    if (!currentJokeState) return;
    navigator.clipboard.writeText(currentJokeState).then(() => {
        const originalText = jokeDisplay.innerHTML;
        jokeDisplay.innerText = "Copied to clipboard!";
        setTimeout(() => jokeDisplay.innerHTML = originalText, 1000);
    });
};

const handleShortcuts = (e) => {
    const key = e.key.toLowerCase();
    if (key === "n" || key === " ") {
        e.preventDefault();
        handleJokeRequest();
    }
    if (key === "c" && (e.ctrlKey || e.metaKey)) {
        copyToClipboard();
    }
};

const applicationBootstrap = () => {
    handleJokeRequest();
    jokeBtn.addEventListener("click", handleJokeRequest);
    window.addEventListener("keydown", handleShortcuts);
    
    console.group("App Debug Info");
    console.log("Memory Cache:", sessionHistory.length);
    console.log("User Agent:", navigator.userAgent);
    console.log("Resolution:", `${window.innerWidth}x${window.innerHeight}`);
    console.groupEnd();
};

document.addEventListener("DOMContentLoaded", applicationBootstrap);
