// Sidebar variables
const navClose = $(".closebtn");
const sidebar = $('.sidebar');
const main = $('#main');
// Search form variables
const searchFormEl = $('#searchform');



/* Sets the width of the sidebar and the left margin of the page content */
const openNav = function() {
     sidebar.css({ 'width': '200px'});
     main.css({ 'visibility': 'hidden'});
     
   }
   
   /* Set the width of the sidebar and the left margin of the page content */
const closeNav = function() {
     sidebar.css({'width': '0px'});
     main.css({'visibility': 'visible'});
   }

$(".closebtn").click(closeNav());
$(".openbtn").click(openNav());


// OpenWeather API Key: 33596ed794152bc041c4e0f24c667630
// Call Template: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}