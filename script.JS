function WeatherApp(apiKey) {
  this.apiKey = apiKey;
  this.baseUrl = "https://api.openweathermap.org/data/2.5";
  this.currentContainer = document.getElementById("current-weather");
  this.forecastContainer = document.getElementById("forecast");
}

// Fetch both APIs
WeatherApp.prototype.getWeatherData = function (city) {
  const currentWeather = fetch(
    `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
  ).then(res => res.json());

  const forecast = fetch(
    `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
  ).then(res => res.json());

  return Promise.all([currentWeather, forecast]);
};

// Display current weather
WeatherApp.prototype.displayCurrentWeather = function (data) {
  this.currentContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>${data.main.temp}°C</strong></p>
    <p>${data.weather[0].description}</p>
  `;
};

// Process forecast (1 per day)
WeatherApp.prototype.processForecastData = function (data) {
  const dailyData = {};

  data.list.forEach(item => {
    const date = item.dt_txt.split(" ")[0];

    if (!dailyData[date] && item.dt_txt.includes("12:00:00")) {
      dailyData[date] = item;
    }
  });

  return Object.values(dailyData).slice(0, 5);
};

// Display forecast cards
WeatherApp.prototype.displayForecast = function (forecastList) {
  this.forecastContainer.innerHTML = "";

  forecastList.forEach(item => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <h4>${new Date(item.dt_txt).toDateString()}</h4>
      <p>${item.main.temp}°C</p>
      <p>${item.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" />
    `;

    this.forecastContainer.appendChild(card);
  });
};

// Main search method
WeatherApp.prototype.searchCity = function (city) {
  this.getWeatherData(city)
    .then(([current, forecast]) => {
      this.displayCurrentWeather(current);

      const processed = this.processForecastData(forecast);
      this.displayForecast(processed);
    })
    .catch(err => {
      console.error(err);
      alert("City not found!");
    });
};

// Initialize app
WeatherApp.prototype.init = function () {
  const button = document.getElementById("search-btn");
  const input = document.getElementById("city-input");

  button.addEventListener(
    "click",
    function () {
      const city = input.value.trim();
      if (city) {
        this.searchCity(city);
      }
    }.bind(this)
  );
};

// Start app
const app = new WeatherApp("9f8c6a3d2b1e4f7a8c9d0e123456abcd");
app.init();