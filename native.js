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
const links = $('.history');
const smallOne = $('#small-card-one');
const smallTwo = $('#small-card-two');
const smallHeaderOne = $('#small-header-one');
const smallHeaderTwo = $('#small-header-two')
const smallListOne = $('#small-list-one');
const smallListTwo = $('#small-list-two');

links.on("click", (event) => console.log(event))

// Initialize object constructor to model storage of relevant data from fetch
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
  cityHeader.text('');
  dataCol.text('');
  smallHeaderOne.text('')
  smallListOne.text('')
  smallHeaderTwo.text('')
  smallListTwo.text('')
  storageInit();
  populateMain();
  populateSub();
}

function populateSub() {
  if (localStorage.length > 2) {
    let itemOneKey = localStorage.key(localStorage.length - 2);
    let itemTwoKey = localStorage.key(localStorage.length - 3);
    let itemOne = JSON.parse(localStorage.getItem(itemOneKey));
    let itemTwo = JSON.parse(localStorage.getItem(itemTwoKey));
    let valuesOne = Object.values(itemOne);
    let valuesTwo = Object.values(itemTwo);
    let headerOne = valuesOne.shift();
    let headerTwo = valuesTwo.shift();
    smallHeaderOne.text(headerOne);
    smallHeaderTwo.text(headerTwo);
    valuesOne.splice(4, 3);
    valuesTwo.splice(4, 3);
    valuesOne.forEach((value) => {
      item = document.createElement('li');
      item.textContent = value;
      smallListOne.append(item)
    })
    valuesTwo.forEach((value) => {
      item = document.createElement('li');
      item.textContent = value;
      smallListTwo.append(item)
    })
  }
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
      if (header !== input && localStorage.length > 2) {
        cityHeader.text(' ');
        dataCol.text(' ');
        let data = JSON.parse(localStorage.getItem(searchInput.val().toUpperCase()))
        let values = Object.values(data)
        values.pop();
        let cityName = values.shift();
        cityHeader.text(cityName);
        values.forEach((value) => {
          row = document.createElement('li');
          dataCol.append(row);
          row.textContent = value;
        })
      } else if (header === input) {
        return;
      }
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
      anchor.setAttribute("class", "history")
      $('#mySidebar').append(anchor);
      anchor.append(node);
      i++;
    }
  } else {
    return
  }
};

// Handle transfer of data from response/local storage to weather cards
function populateMain() {
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
      list.append(row);
      row.textContent = value;
    })
  }
  return
};

searchFormEl.submit(getCoords);