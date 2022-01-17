// DOM selector variables
const sidebar = $('.sidebar');
const hamburger = $('#hamburger');
const searchFormEl = $('#searchform');
const searchQueryEl = $('#search-query');
const searchInput = $('#search-input')
const historyEl = $('#history');
const bigBox = $('#weather-main');
const bigList = $('#big-list');
const cityHeader = $('#city-header');
const dataCol = $('#right-column');
const searchBtn = $('#searchbtn')
const links = $('a')

let lastSearched;


class Location {
  constructor(city, date, temp, feel, humidity, wind, uv, url) {
    this.city = city;
    this.date = date;
    this.temp = temp;
    this.feel = feel;
    this.humidity = humidity;
    this.windSpeed = wind;
    this.uvIndex = uv;
    this.url = url
  }
};

// Handles local storage refresh on window load
function storageInit() {
  displayHistory();
}
// Initialize page with search history from local storage
window.onload = () => {
  event.stopPropagation();
  storageInit();
  populateMain();
}


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

// window.addEventListener("click", () => {

// })

// Handle submission of search and fetch to mapbox
function getCoords(event) {
  event.preventDefault();
  let searchValue = $('#search-input').val();
  let searchFormatted = searchValue.split(', ');
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

  // Build mapbox fetch url using terms grabbed from search form
  let searchTerms = city + '%20' + state;
  let geoUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + searchTerms +
    '.json?access_token=pk.eyJ1IjoibnVtaW5vdXNibHVlIiwiYSI6ImNrdWFocWk0NTBoMHkydm1uMHRuODY1aXYifQ.lEnI_ZRd1_I8-2IZUSA_MA';

  // Fetch request to mapbox
  fetch(geoUrl)
    .then(response => {
      if (!response.ok) {
        throw response.json();
      } else {
        return response.json();
      }
    })
    .then(location => {
      let lat = location.features[0].geometry.coordinates[1].toString().substring(0, 5);
      let long = location.features[0].geometry.coordinates[0].toString().substring(0, 5);

      searchTerm = location.query.join(', ').toUpperCase();
      searchQueryEl.text(searchTerm);
      
      getWeatherObj(buildWeatherUrl(lat, long));

    });
}

// Build data gathered from mapbox fetch into weathermap url for new fetch
function buildWeatherUrl(coordsX, coordsY) {
  const APIkey = '3cb8573c763144f45675130c586b0e88';
  let weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + coordsX + '&lon=' + coordsY + '&units=imperial&appid=' + APIkey;
  return weatherUrl;
}

// Retrieve and format data received from open weather api
async function getWeatherObj(coordsUrl) {
  await fetch(coordsUrl)
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
      let day = moment().format('MMM Do YY');
      let temperature = objIndex.temp.toString().substring(0, 4) + '\xB0 F';
      let realFeel = objIndex.feels_like.toString().substring(0, 4) + '\xB0 F';
      let humid = objIndex.humidity.toString() + ' %';
      let windSpeed = objIndex.wind_speed.toString() + ' mph';
      let uvIndex = objIndex.uvi.toString();
      // Send to local storage using search terms as property key and template of data as values
      const newItem = new Location(location, day, temperature, realFeel, humid, windSpeed, uvIndex, coordsUrl);
      return newItem;
    })
    .then((newItem) => {
      localStorage.setItem(searchTerm, JSON.stringify(newItem));
      lastSearched = searchTerm;
    })
    .then(() => {
      let header = cityHeader.text().toString().toLowerCase();
      let input = searchInput.val().toString().toLowerCase();
      if (header !== input) {
        cityHeader.text(' ');
        dataCol.text(' ');
        let data = JSON.parse(localStorage.getItem(searchInput.val().toUpperCase()))
        console.log(data)
        let values = Object.values(data)
          values.pop();
        let cityName = values.shift();
        cityHeader.text(cityName);
        values.forEach((value) => {
          row = document.createElement('li');
          dataCol.append(row);
          row.textContent = value;
        })
        console.log("The elements are not equal! And the comparison is working.")
      }
      else if (header === input) {
        console.log("You've performed a redundant search.")
      }
      return
    })
}


// Uses local storage to populate search history with previous cities viewed
function displayHistory() {
  if (localStorage.length > 0) {
    let i = 0;
    while (i < localStorage.length) {
      item = JSON.parse(localStorage.getItem(localStorage.key([i])));
      anchor = document.createElement("a")
      node = document.createTextNode(item.city)
      anchor.setAttribute("data", item.url)
      $('#mySidebar').append(anchor);
      anchor.append(node);
      i++;
    }
  }
  else {
    return
  }
};

links.on("click", (event) => {
  console.log(event)
  event.preventDefault();
  let url = event.target.data;
  console.log(event.target)
  getWeatherObj(url)
    .then(() => {
      localStorage.getItem(event.target.innerHTML)
    })
})

// Handle transfer of data from response/local storage to weather cards
function populateMain() {
  // Define condition and function for comparing last search to displayed card
  
  if (localStorage.length > 0) {
    let mainKey = localStorage.length - 1;
    let keyName = localStorage.key(mainKey);
    let data = JSON.parse(localStorage.getItem(keyName))
    let values = Object.values(data)
    values.pop();
    let cityName = values.shift();
    cityHeader.text(cityName);
    let list = document.createElement('ul');
    dataCol.append(list)
    values.forEach((value) => {
      row = document.createElement('li');
      dataCol.append(row);
      row.textContent = value;
    })
  }
  return
};

function populateMinor() {
  if (localStorage.length > 1) {





  }
}

searchFormEl.submit(getCoords);

