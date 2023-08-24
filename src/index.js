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
let hours = currentDate.getHours();
let minutes = currentDate.getMinutes();
if (hours < 10) {
  hours = `0${hours}`;
}
if (minutes < 10) {
  minutes = `0${minutes}`;
}
time.innerHTML = `${hours}:${minutes}`;

function displayCity(event) {
  event.preventDefault();
  let cityinput = document.querySelector("#cityInput");
  axios
    .get(`${apiUrl}q=${cityinput.value}&units=metric&appid=${apiKey}`)
    .then(show);
  cityinput.value = "";
}

let form = document.querySelector(".btn-info");
form.addEventListener("click", displayCity);

function covertF(event) {
  event.preventDefault();
  let temp = document.querySelector("span#temp");
  let text = temp.textContent.trim();
  let tempC = parseInt(text.slice(2));
  let tempF = (tempC * 9) / 5 + 32;
  if (hours < 20) {
    temp.textContent = `☀️${Math.round(tempF)}`;
  } else {
    temp.textContent = `🌑${Math.round(tempF)}`;
  }
}

let fah = document.querySelector("#fahrenheit");
fah.addEventListener("click", covertF);

function covertC(event) {
  event.preventDefault();
  let temp = document.querySelector("span#temp");
  let text = temp.textContent.trim();
  let tempF = parseInt(text.slice(2));
  let tempC = ((tempF - 32) * 5) / 9;
  if (hours < 20) {
    temp.textContent = `☀️${Math.round(tempC)}`;
  } else {
    temp.textContent = `🌑${Math.round(tempC)}`;
  }
}

let celcius = document.querySelector("#celcius");
celcius.addEventListener("click", covertC);

let apiKey = "73ebf414d866b627835ae28b67acbca8";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

function show(response) {
  let curCity = document.querySelector("#city");
  curCity.innerHTML = `${response.data.name}`;
  let temp = Math.round(response.data.main.temp);
  let curTemp = document.querySelector("#temp");
  if (hours < 20) {
    curTemp.innerHTML = `☀️${temp}`;
  } else {
    curTemp.innerHTML = `🌑${temp}`;
  }
  let humidity = document.querySelector("#humid");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
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
