let date = document.querySelector("#currentDate");
let currentDate = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(curDate) {
  let formattedDate = `${days[curDate.getDay()]}, ${
    months[curDate.getMonth()]
  } ${curDate.getDate()}, ${curDate.getFullYear()}`;
  return formattedDate;
}
date.innerHTML = formatDate(currentDate);

let time = document.querySelector("#currentTime");
let hours = currentDate.getHours().toString().padStart(2, "0");
let minutes = currentDate.getMinutes().toString().padStart(2, "0");
time.innerHTML = `${hours}:${minutes}`;

function displayCity(city) {
  axios.get(`${apiUrl}q=${city}&units=metric&appid=${apiKey}`).then(show);
}

function handleInput(event) {
  event.preventDefault();
  let cityinput = document.querySelector("#cityInput");
  displayCity(cityinput.value);
  cityinput.value = "";
}

let form = document.querySelector(".btn-info");
form.addEventListener("click", handleInput);

let tempC = null;

function covertF(event) {
  event.preventDefault();
  celcius.classList.remove("selectedUnit");
  fah.classList.add("selectedUnit");
  let temp = document.querySelector("strong#temp");
  let tempF = (tempC * 9) / 5 + 32;
  temp.innerHTML = `${Math.round(tempF)}`;
}

let fah = document.querySelector("#fahrenheit");
fah.addEventListener("click", covertF);

function covertC(event) {
  event.preventDefault();
  fah.classList.remove("selectedUnit");
  celcius.classList.add("selectedUnit");
  let temp = document.querySelector("strong#temp");
  temp.innerHTML = `${Math.round(tempC)}`;
}

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", covertC);

let apiKey = "96771e971243152d6b8948878c26adde";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatHour(timestamp, offset) {
  let time = timestamp * 1000;
  let date = new Date(time + offset * 1000);
  return date.getUTCHours().toString().padStart(2, "0");
}

function displayHourlyForecast(response) {
  let hourlyForecast = response.data.hourly;
  console.log(response.data);
  let forecast = document.querySelector("#hourly");
  let weatherForecast = `<div class="row">`;
  hourlyForecast.forEach(function (hourForecast, index) {
    if (index < 12) {
      weatherForecast =
        weatherForecast +
        `<div class="col">
            <h4>${formatHour(
              hourForecast.dt,
              response.data.timezone_offset
            )}</h4>
            <img src="http://openweathermap.org/img/wn/${
              hourForecast.weather[0].icon
            }@2x.png" alt="http://openweathermap.org/img/wn/${
          hourForecast.weather[0].description
        }" width="32" />
            <h6>${Math.round(hourForecast.temp)}°</h6>
        </div>`;
    }
  });
  weatherForecast = weatherForecast + `</div>`;
  forecast.innerHTML = weatherForecast;
}

function displayWeatherForecast(response) {
  let dailyForecast = response.data.daily;
  let forecast = document.querySelector("#forecast");
  let weatherForecast = `<div class="row">`;
  dailyForecast.forEach(function (dayForecast, index) {
    if (index < 7) {
      weatherForecast =
        weatherForecast +
        `<div class="col">
          <h4>${formatDay(dayForecast.dt)}</h4>
          <img src="http://openweathermap.org/img/wn/${
            dayForecast.weather[0].icon
          }@2x.png" alt="http://openweathermap.org/img/wn/${
          dayForecast.weather[0].description
        }" width="72" />
          <h6>
            <span class="day-maxTemp">${Math.round(
              dayForecast.temp.max
            )}°</span> |
            <span class="day-minTemp">${Math.round(
              dayForecast.temp.min
            )}°</span>
          </h6>
        </div>`;
    }
  });
  weatherForecast = weatherForecast + `</div>`;
  forecast.innerHTML = weatherForecast;
}

function displayTime(response) {
  const currentUnixTime = response.data.current.dt * 1000;
  const timezoneOffset = response.data.timezone_offset;

  let adjustedDate = new Date(currentUnixTime + timezoneOffset * 1000);
  let hours = adjustedDate.getUTCHours().toString().padStart(2, "0");
  let minutes = adjustedDate.getUTCMinutes().toString().padStart(2, "0");

  let currentTime = document.querySelector("#currentTime");
  currentTime.innerHTML = `${hours}:${minutes}`;
}

function getForecast(coords) {
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayHourlyForecast);
  axios.get(url).then(displayWeatherForecast);
  axios.get(url).then(displayTime);
}

function show(response) {
  let curCity = document.querySelector("#city");
  curCity.innerHTML = `${response.data.name}`;
  tempC = Math.round(response.data.main.temp);
  let curTemp = document.querySelector("#temp");
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
  curTemp.innerHTML = `${tempC}`;
  let humidity = document.querySelector("#humid");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${Math.round(response.data.wind.speed * 3.6)} km/h`;

  getForecast(response.data.coord);
}

function display(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  axios
    .get(`${apiUrl}lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(show);
}

function displayCurLoc(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(display);
}

let currentLocation = document.querySelector(".btn-success");
currentLocation.addEventListener("click", displayCurLoc);

displayCity("Toronto");
