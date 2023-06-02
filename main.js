const app=document.querySelector(".weather-app");
const temp=document.querySelector(".temp");
const dateOutput=document.querySelector(".date");
const timeOutput=document.querySelector(".time");
const conditionOutput=document.querySelector(".condition");
const nameOutput=document.querySelector(".name");
const icon=document.querySelector(".icon");
const cloudOutput=document.querySelector(".cloud");
const humidityOutput=document.querySelector(".humidity");
const windOutput=document.querySelector(".wind");
const form=document.getElementById("locationInput");
const search=document.querySelector(".search");
const btn=document.querySelector(".submit");
const cities=document.querySelectorAll(".city");
const key='2642cf82c935847d536d202f05ad9369';

cities.forEach((city)=>{
    city.addEventListener('click',(e)=>{
        get_data(e.target.innerHTML);
    })
});

form.addEventListener('submit',(e)=>{
    if(search.value.trim===''){
        alert("Please enter a value");
    }
    else{
        get_data(search.value);
        search.value=" ";
    }
    e.preventDefault();
});

function dayOfTheWeek(day,month,year){
    const weekDay=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return weekDay[new Date().getDay(day,month,year)] ;
};

function get_data(input_city){
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${input_city}&appid=${key}`;
    fetch(url)
    .then(response=>{
        if(response.ok){
            return response.json();
        }
        else{
            throw new Error('Error: ' + response.status);
        }
    })
    .then(data=>{
        windOutput.innerHTML=data.wind.speed+" meter/sec";
        cloudOutput.innerHTML=data.clouds.all+"%";
        humidityOutput.innerHTML=data.main.humidity+"%";
        nameOutput.innerHTML=input_city;
        temp.innerHTML=Math.round(data.main.temp-275.15)+"&#176;";
        conditionOutput.innerHTML=data.weather[0].main;

        // unix timestamp
        // const timestamp = Math.floor(Date.now()/1000);
        // const offset = data.timezone;
        const localDate = new Date((data.sys.sunrise + data.timezone) * 1000);
        // Extract the date and time components from the local date
        const localYear = localDate.getFullYear();
        const localMonth = localDate.getMonth() + 1; // Months are zero-based, so add 1
        const localDay = localDate.getDate();

        const w=dayOfTheWeek(localDay,localMonth,localYear);

        dateOutput.innerHTML=`${w} ${localDay}-${localMonth}-${localYear}`;

        const localHours = localDate.getHours();
        const localMinutes = localDate.getMinutes();
        
        // Convert hours and minutes to strings with leading zeros
        const hoursString = String(localHours).padStart(2, '0');
        const minutesString = String(localMinutes).padStart(2, '0');

        timeOutput.innerHTML=`${hoursString}:${minutesString}`;

        let timing=undefined;
        if(localHours>=19 || localHours<6){
            timing='night';
        }
        else if(localHours>=6 || localHours<19){
            timing='day';
        }
        icon.src=`./icons/${timing}/${data.weather[0].main}.png`;
        app.style.backgroundImage=`url("./images/${timing}/${data.weather[0].main}.jpg")`;
        return;
    })
    .catch(error=>{
        alert(`Error:${error}`);
        return;
    })
};






  