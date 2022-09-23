//
//	        Init.js
//
//        Misc Helper Classes and functions
//
//  15 Sep 2022 Created
//


const Version = "V1.01";
const FirstYear = "2018";

const MenuEntries = [
        {url:"index.html", button:"Home"},
        {url:"Meetings.html", button:"Meetings"},
        {url:"PhotoTrips.html", button:"Photo Trips"},
        {url:"Competition.html", button:"Competition"},
        {url:"Photos.html", button:"Photos"},
        {url:"About.html", button:"About"},
        {url:"FindUs.html", button:"FindUs"},
        {url:"ContactUs.html", button:"Contact Us"}
      ];


// Kick it off
init( );

function init( ) {
  let thisYear = new Date().getFullYear();

  document.querySelector( "footer .Version" ).innerText = Version;

  if( FirstYear == thisYear ) document.querySelector( "footer .Year" ).innerText = thisYear;
  else document.querySelector( "footer .Year" ).innerText = `${FirstYear} - ${thisYear}`;

  createMenus( );

  // Call some init() routines based on the web page we are on
  if( pageName() == "Meetings" ) meetingsInit( );
  if( pageName() == "PhotoTrips" ) photoTripsInit( );
  if( pageName() == "Competition" ) competitionInit( );
  if( pageName() == "Photos" ) photosInit( );
}



// DEBUG Menus visibly shift/bounce left/right when I change pages
//   This is no better than OLD()
//
function createMenus( ) {
  let menuElement = document.querySelector( "menu" );
  let pageUrl = pageName( ) + ".html";
  let menusHtml = "";


  // for( let nextMenu = 0; nextMenu < MenuEntries.length; ++nextMeny )
  for( let menu of MenuEntries ) {
    // <a href="index.html" target="_self">Home</a>
    if( menu.url == pageUrl ) {
      // Include CurrentMenu class
      menusHtml += `<a href="${menu.url}" target="_self" class="CurrentMenu">${menu.button}</a>`;
    }
    else menusHtml += `<a href="${menu.url}" target="_self">${menu.button}</a>`;
  }

  menuElement.innerHTML = menusHtml;
}


function createMenusOLD( ) {
  let menuElement = document.querySelector( "menu" );
  let pageUrl = pageName( ) + ".html";

  menuElement.innerHTML = "";

  // for( let nextMenu = 0; nextMenu < MenuEntries.length; ++nextMeny )
  for( let menu of MenuEntries ) {
    // <a href="index.html" target="_self">Home</a>
    if( menu.url == pageUrl ) {
      // Include CurrentMenu class
      menuElement.innerHTML += `<a href="${menu.url}" target="_self" class="CurrentMenu">${menu.button}</a>`;
    }
    else menuElement.innerHTML += `<a href="${menu.url}" target="_self">${menu.button}</a>`;
  }
}






//
