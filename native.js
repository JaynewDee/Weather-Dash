// Sidebar variables
const navClose = $(".closebtn");
const sidebar = $('.sidebar');
const hamburger = $('#hamburger');
// Search form variables
const searchFormEl = $('#searchform');
const searchQueryEl = $('#search-query');


// Sidebar collapse&expand control
/* Sets the width of the sidebar and the left margin of the page content */
const openNav = function () {
  sidebar.css({
    'width': '200px'
  });
  hamburger.css({
    'visibility': 'hidden'
  });

}

/* Set the width of the sidebar and the left margin of the page content */
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


// OpenWeather API Key: 33596ed794152bc041c4e0f24c667630
// Call Template: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// Handle search submit

// Get coordinates of searched input

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
      if (!response.ok) {
        throw response.json();
      } else {
      return response.json();
      }
     })
    .then(response => {
      // get coords from response object
    })
    .then(response => {
      searchTerm = response.query.join(', ').toUpperCase();
      $('#search-query').text(searchTerm);
    }
    );

  

  
    
}

// Send search parameters to local storage
  localStorage.setItem

// function searchSubmit () {

//   let searchValue = $('#search-input').val();

//   if (!searchValue) {
//     console.error('No search text submitted!');
//     return;
//   }
//   console.log(searchValue);
// }

searchFormEl.submit(getCoords);
