
const navClose = $(".closebtn");
const sidebar = $('.sidebar');
const main = $('#main');




/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
const openNav = function() {
     sidebar.css({ 'width': '200px'});
     main.css({ 'visibility': 'hidden'});
     
   }
   
   /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
const closeNav = function() {
     sidebar.css({'width': '0px'});
     main.css({'visibility': 'visible'});
   }

$(".closebtn").click(closeNav());
$(".openbtn").click(openNav());

