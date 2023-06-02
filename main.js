const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");
const key = '2642cf82c935847d536d202f05ad9369';

// Function to get user's current location
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherByLocation, handleLocationError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Function to handle location error
function handleLocationError(error) {
  alert("Error getting location: " + error.message);
}

// Function to get weather data by location
function getWeatherByLocation(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(data => {
      // Update the weather information in the UI
      updateWeatherUI(data);
    })
    .catch(error => {
      alert(`Error: ${error}`);
    });
}

// Function to update the weather information in the UI
function updateWeatherUI(data) {
  windOutput.innerHTML = data.wind.speed + " meter/sec";
  cloudOutput.innerHTML = data.clouds.all + "%";
  humidityOutput.innerHTML = data.main.humidity + "%";
  nameOutput.innerHTML = data.name;
  temp.innerHTML = Math.round(data.main.temp - 275.15) + "&#176;";
  conditionOutput.innerHTML = data.weather[0].main;

  const localDate = new Date((data.sys.sunrise + data.timezone) * 1000);
  const localYear = localDate.getFullYear();
  const localMonth = localDate.getMonth() + 1;
  const localDay = localDate.getDate();
  const weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const w = weekDay[localDate.getDay()];

  dateOutput.innerHTML = `${w} ${localDay}-${localMonth}-${localYear}`;

  const localHours = localDate.getHours();
  const localMinutes = localDate.getMinutes();

  const hoursString = String(localHours).padStart(2, '0');
  const minutesString = String(localMinutes).padStart(2, '0');

  timeOutput.innerHTML = `${hoursString}:${minutesString}`;

  let timing = undefined;
  if (localHours >= 19 || localHours < 6) {
    timing = 'night';
  } else if (localHours >= 6 || localHours < 19) {
    timing = 'day';
  }
  icon.src = `./icons/${timing}/${data.weather[0].main}.png`;
  app.style.backgroundImage = `url("./images/${timing}/${data.weather[0].main}.jpg")`;
}

// Event listener for city selection
cities.forEach((city) => {
  city.addEventListener('click', (e) => {
    getWeatherData(e.target.innerHTML);
  });
});

// Event listener for form submission
form.addEventListener('submit', (e) => {
  if (search.value.trim() === '') {
    alert("Please enter a value");
  } else {
    getWeatherData(search.value);
    search.value = "";
  }
  e.preventDefault();
});

// Function to get weather data by city name
function getWeatherData(cityName) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${key}`;
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Error: ' + response.status);
      }
    })
    .then(data => {
      // Update the weather information in the UI
      updateWeatherUI(data);
    })
    .catch(error => {
      alert(`Error: ${error}`);
    });
}

// Ask for location permission when the page loads
window.addEventListener('load', () => {
  getCurrentLocation();
});
