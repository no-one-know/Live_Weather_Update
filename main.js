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
const key = '450846123b0b4f4986c33757230306';

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
  let url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${latitude},${longitude}&aqi=yes`;
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
    windOutput.innerHTML = data.current.wind_kph + " km/hr";
    cloudOutput.innerHTML = data.current.cloud + "%";
    humidityOutput.innerHTML = data.current.humidity + "%";
    nameOutput.innerHTML = data.location.name;
    temp.innerHTML = data.current.temp_c + "&#176;";
    conditionOutput.innerHTML = data.current.condition.text;

    const date=data.location.localtime;
    const y=parseInt(date.substr(0,4));
    const m=parseInt(date.substr(5,2));
    const d=parseInt(date.substr(8,2));
    const time=date.substr(11);
        
    
     const w=dayOfTheWeek(d,m,y);
    
    dateOutput.innerHTML=`${w} ${d}-${m}-${y}`;
    timeOutput.innerHTML=time;

    const iconId=data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64".length);
    icon.src="./icons" + iconId ;

    let timeOfDay="day";
         const code=data.current.condition.code;


         if(!data.current.is_day){
            timeOfDay="Night";
         }

         if(code==1000){
            app.style.backgroundImage=`url("./images/${timeOfDay}/clear.jpg")`;

            btn.style.background="#e5ba92";
            if(timeOfDay=="Night"){
                btn.style.background="#181e27";
            }

         }

        else if(code==1003 || code==1006 || code==1009 || code==1030 || code==1069 || code==1087 
            || code==1135 ||code==1273 ||code==1276 || code== 1279 || code==1282)
            {   
                app.style.backgroundImage=`url("./images/${timeOfDay}/cloudy.jpg")`;
                btn.style.background="#fa6d1b";
                if(timeOfDay=="Night"){
                    btn.style.background="#181e27";
                }
            }

            else if(code==1063 || code==1069 || code==1072 || code==1050 || code==1153 || code==1180 
                || code==1183 ||code==1186 ||code==1189 || code== 1192 || code==1195 || code==1204 
                || code==1207 || code==1240 || code==1243 || code==1246 || code==1249 || code==1252)
                {  
                    app.style.backgroundImage=`url("./images/${timeOfDay}/rainy.jpg")`;
                    btn.style.background="#647d75";
                    if(timeOfDay=="Night"){
                        btn.style.background="#325c80";
                    }
                }

                else{
                
                    app.style.backgroundImage=`url("./images/${timeOfDay}/snony.jpg")`;
                    btn.style.background="#647d75";
                    if(timeOfDay=="Night"){
                        btn.style.background="#1b11b1";
                    }

                }
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


function dayOfTheWeek(day,month,year){
  const weekDay=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  return weekDay[new Date().getDay(day,month,year)] ;
};

// Function to get weather data by city name
function getWeatherData(cityName) {
  let url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${cityName}&aqi=yes`;
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
