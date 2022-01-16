// DOM selector variables
const navClose = $(".closebtn");
const sidebar = $('.sidebar');
const hamburger = $('#hamburger');
const searchFormEl = $('#searchform');
const searchQueryEl = $('#search-query');
const cardBodyEl = $('#weather-wrapper');
const historyEl = $('#history');


// Sidebar collapse&expand control
const openNav = function () {
  sidebar.css({
    'width': '200px'
  });
  hamburger.css({
    'visibility': 'hidden'
  });
}
const closeNav = function () {
  sidebar.css({
    'width': '0px'
  });
  hamburger.css({
    'visibility': 'visible'
  });
}
$(".closebtn").click(closeNav());
$(".openbtn").click(openNav());

// Initialize page with search history from local storage
window.onload = function() {
  storageInit()
}


function storageInit() {
  displayHistory();
}

// Handle search submit
function getCoords(event) {
  event.preventDefault();
  let searchValue = $('#search-input').val();
  let searchFormatted = searchValue.split(', ');
  console.log(searchFormatted.length);
  if (searchFormatted.length < 2) {
    alert('Please enter a valid city and state, separated by a comma and a space.  Example: Austin, Texas');
    return;
  }
  let city = searchFormatted[0];
  let state = searchFormatted[1];
  if (city.includes(' ') || state.includes('')) {
    city = city.replace(/\s+/g, '');
    state = state.replace(/\s+/g, '');
  }
  console.log(city);
  console.log(state);

  let searchTerms = city + '%20' + state;
  let geoUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchTerms +
    '.json?access_token=pk.eyJ1IjoibnVtaW5vdXNibHVlIiwiYSI6ImNrdWFocWk0NTBoMHkydm1uMHRuODY1aXYifQ.lEnI_ZRd1_I8-2IZUSA_MA';
  console.log(geoUrl);


  fetch(geoUrl)
    .then(response => {
      console.log(response);
      if (!response.ok) {
        throw response.json();
      } else {
        return response.json();
      }
    })
    .then(location => {
      let lat = location.features[0].geometry.coordinates[1].toString().substring(0, 5);
      let long = location.features[0].geometry.coordinates[0].toString().substring(0, 5);

      console.log(lat);
      console.log(long);
      searchTerm = location.query.join(', ').toUpperCase();
      searchQueryEl.text(searchTerm);

      buildWeatherUrl(lat, long);
      getWeatherObj(buildWeatherUrl(lat, long));
      displayHistory();
    });
}

function buildWeatherUrl(coordsX, coordsY) {
  const APIkey = '3cb8573c763144f45675130c586b0e88';
  let weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + coordsX + '&lon=' + coordsY + '&units=imperial&appid=' + APIkey;
  return weatherUrl;
}

function getWeatherObj(coordsUrl) {
  fetch(coordsUrl)
    .then(response => {
      if (!response.ok) {
        throw response.json();
      } else {
        return response.json();
      }
    })
    .then(data => {
      let location = searchTerm;
      let objIndex = data.current;
      console.log(location);
      let day = moment().format('MMM Do YY');
      console.log(day)
      let temperature = objIndex.temp.toString().substring(0, 4) + '\xB0 F';
      console.log(temperature)
      let realFeel = objIndex.feels_like.toString().substring(0, 4) + '\xB0 F';
      console.log(realFeel);
      let humid = objIndex.humidity.toString() + ' %';
      console.log(humid);
      let windSpeed = objIndex.wind_speed.toString() + ' mph';
      console.log(windSpeed);
      let uvIndex = objIndex.uvi.toString();
      console.log(uvIndex);

      const newItem = new Template(location, day, temperature, realFeel, humid, windSpeed, uvIndex);
      localStorage.setItem(searchTerm, JSON.stringify(newItem));
    })
}

// Object constructor determining format of storage items
function Template(city, date, temp, feel, humidity, wind, uv) {
  this.city = city;
  this.date = date;
  this.temp = temp;
  this.feel = feel;
  this.humidity = humidity;
  this.windSpeed = wind;
  this.uvIndex = uv;
};


// Uses local storage to populate search history with previous cities viewed
function displayHistory() {
  if (localStorage.length > 0) {
    let i = 0;
    while (i < localStorage.length) {
      item = JSON.parse(localStorage.getItem(localStorage.key([i])));
      anchor = document.createElement("a")
      node = document.createTextNode(item.city)
      $('#mySidebar').append(anchor);
      anchor.append(node);
      i++;
    }
  }
  else {
    return
  }
};

searchFormEl.submit(getCoords);