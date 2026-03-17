const apiKey = "YOUR_API_KEY";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const loading = document.getElementById("loading");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {

    const city = cityInput.value.trim();

    if(city === ""){
        weatherResult.innerHTML = "⚠️ Please enter a city name";
        return;
    }

    loading.style.display = "block";
    weatherResult.innerHTML = "";

    try{

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();

        const temperature = data.main.temp;
        const description = data.weather[0].description;

        weatherResult.innerHTML = `
        <h2>${city}</h2>
        <p>Temperature: ${temperature}°C</p>
        <p>Weather: ${description}</p>
        `;

    }
    catch(error){
        weatherResult.innerHTML = "❌ City not found. Please try again.";
    }

    loading.style.display = "none";
}
cityInput.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        getWeather();
    }
});