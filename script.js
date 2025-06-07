const url = "https://api.openweathermap.org/data/2.5/weather";
const apiKey = "c032b9942b555c38c0db3036fe29efe2";

$(document).ready(function () {
  weatherFn("Noida"); // Default city
});

async function weatherFn(cName) {
  const tempUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(tempUrl);
    const data = await res.json();
    if (res.ok) {
      weatherShowFn(data);
      forecastFn(cName);
    } else {
      alert("City not found. Please try again.");
      $("#weather-info").hide();
      $("#forecast").hide();
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function weatherShowFn(data) {
  $("#city-name").text(data.name);
  $("#date").text(moment().format("MMMM Do YYYY, h:mm:ss a"));
  $("#temperature").html(`${Math.round(data.main.temp)}°C`);
  $("#description").text(data.weather[0].description);
  $("#wind-speed").html(`Wind Speed: ${data.wind.speed} m/s`);
  $("#weather-icon").attr(
    "src",
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  );
  $("#weather-info").fadeIn();
}

// 5-Day Forecast
async function forecastFn(city) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const res = await fetch(forecastUrl);
  const data = await res.json();
  if (res.ok) {
    showForecast(data);
  } else {
    $("#forecast").html("<p>Forecast not available.</p>");
  }
}

function showForecast(data) {
  let forecastHTML = '<h3>5-Day Forecast</h3><div class="forecast-container">';

  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );
  dailyData.forEach((item) => {
    forecastHTML += `
      <div class="forecast-day">
        <p><strong>${moment(item.dt_txt).format("ddd")}</strong></p>
        <img src="https://openweathermap.org/img/wn/${
          item.weather[0].icon
        }.png" alt="Icon">
        <p>${Math.round(item.main.temp)}°C</p>
        <p>${item.weather[0].description}</p>
      </div>
    `;
  });

  forecastHTML += "</div>";
  $("#forecast").html(forecastHTML).fadeIn();
}

// Geolocation
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const geoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const res = await fetch(geoUrl);
        const data = await res.json();
        if (res.ok) {
          weatherShowFn(data);
          forecastByCoords(lat, lon);
        }
      },
      () => alert("Geolocation permission denied.")
    );
  } else {
    alert("Geolocation is not supported.");
  }
}

async function forecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if (res.ok) {
    showForecast(data);
  }
}
