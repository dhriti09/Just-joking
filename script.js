const jokeDisplay = document.getElementById("joke");
const jokeBtn = document.getElementById("btn");

// Using JokeAPI which is reliable and easy to filter
const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

async function fetchJoke() {
    // Add a slight fade effect
    jokeDisplay.style.opacity = 0.5;
    jokeDisplay.innerText = "Finding something funny...";

    try {
        const response = await fetch(url);
        const data = await response.json();

        let jokeString = "";
        if (data.type === "single") {
            jokeString = data.joke;
        } else {
            jokeString = `${data.setup} <br><br> <strong>${data.delivery}</strong>`;
        }

        // Update the text and bring opacity back
        jokeDisplay.innerHTML = jokeString;
        jokeDisplay.style.opacity = 1;

    } catch (error) {
        jokeDisplay.innerText = "Even the API is tired of my jokes. Try again later!";
    }
}

// Initial joke on load
fetchJoke();

// Event listener
jokeBtn.addEventListener("click", fetchJoke);