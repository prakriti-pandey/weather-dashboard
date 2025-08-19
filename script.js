const apiKey = 'a976d439f3275b500f233700c4af47fe';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const errorMsg = document.getElementById('errorMsg');

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (!city) {
    errorMsg.textContent = 'Please enter a city name.';
    return;
  }
  errorMsg.textContent = '';
  getWeather(city);
  getForecast(city);
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherResult.innerHTML = '';
    forecastResult.innerHTML = '';
    errorMsg.textContent = error.message;
  }
}

function displayWeather(data) {
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  weatherResult.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Weather icon" />
    <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity} %</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
}

async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Forecast not found');
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    forecastResult.innerHTML = '';
    errorMsg.textContent = error.message;
  }
}

function displayForecast(data) {
  const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));
  let html = '<h3>5-Day Forecast</h3><div>';
  dailyForecasts.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
    html += `
      <div style="display: inline-block; width: 60px; text-align: center; margin: 5px;">
        <p>${dayName}</p>
        <img src="${iconUrl}" alt="Weather icon" />
        <p>${Math.round(day.main.temp)}°C</p>
      </div>
    `;
  });
  html += '</div>';
  forecastResult.innerHTML = html;
}
