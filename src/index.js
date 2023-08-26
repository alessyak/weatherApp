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

let apiKey = "73ebf414d866b627835ae28b67acbca8";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

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
