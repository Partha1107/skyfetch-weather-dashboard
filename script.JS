const API_KEY = "9f8c6a3d2b1e4f7a8c9d0e123456abcd";

// 🔍 Handle Search
function handleSearch() {
  const input = document.getElementById("city-input");
  const city = input.value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  fetchWeather(city);
  saveCity(city);
  saveLastCity(city);
  displayRecentCities();

  input.value = "";
}

// 🌦 Fetch Weather Data
async function fetchWeather(city) {
  const resultDiv = document.getElementById("weather-result");

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) {
      resultDiv.innerHTML = `<p>City not found</p>`;
      return;
    }

    resultDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p>🌡 Temperature: ${data.main.temp}°C</p>
      <p>🌥 Condition: ${data.weather[0].main}</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (error) {
    resultDiv.innerHTML = `<p>Error fetching data</p>`;
    console.error(error);
  }
}

// 💾 Save Recent Cities
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  if (!cities.includes(city)) {
    cities.unshift(city);
  }

  cities = cities.slice(0, 5);

  localStorage.setItem("recentCities", JSON.stringify(cities));
}

// 💾 Save Last City
function saveLastCity(city) {
  localStorage.setItem("lastCity", city);
}

// 📌 Display Recent Cities
function displayRecentCities() {
  const container = document.getElementById("recent-container");
  container.innerHTML = "";

  const cities = JSON.parse(localStorage.getItem("recentCities")) || [];

  cities.forEach(city => {
    const btn = document.createElement("button");
    btn.innerText = city;

    btn.onclick = () => {
      fetchWeather(city);
      saveLastCity(city);
    };

    container.appendChild(btn);
  });
}

// 🔄 Auto Load Last City
window.onload = function () {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    fetchWeather(lastCity);
  }

  displayRecentCities();
};