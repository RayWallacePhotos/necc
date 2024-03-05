//
//	        Init.js
//
//        Misc Helper Classes and functions
//
//  15 Sep 2022 Created
//  21 Feb 2024 Added CompetitionResults
//              V1.3
//   3 Mar 2024 Added Google Calendar support
//              V1.4
//   5 Mar 2024 Tweaked calendar code a bit
//              V1.5
//


const Version = "V1.5";
const FirstYear = "2018";

const MenuEntries = [
        {url:"index.html", button:"Home", init:null},
        {url:"Meetings.html", button:"Meetings", init:meetingsInit},
        {url:"PhotoTrips.html", button:"Photo Trips", init:photoTripsInit},
        {url:"Competition.html", button:"Competition", init:competitionInit},
        {url:"CompetitionResults.html", button:"Competition Results", init:competitionResultsInit},
        {url:"Photos.html", button:"Photos", init:photosInit},
        {url:"DigitalTechniques.html", button:"Digital Techniques", init:digitalTechniquesInit},
        {url:"About.html", button:"About", init:null},
        {url:"FindUs.html", button:"FindUs", init:null},
        {url:"ContactUs.html", button:"Contact Us", init:null}
      ];


// Kick it off
init( );

function init( ) {
  let thisYear = new Date().getFullYear();

  document.querySelector( "footer .Version" ).innerText = Version;

  if( FirstYear == thisYear ) document.querySelector( "footer .Year" ).innerText = thisYear;
  else document.querySelector( "footer .Year" ).innerText = `${FirstYear} - ${thisYear}`;

  // Create menus AND call init() routines, all based on the web page we are on
  createMenus( );

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

      if( menu.init ) menu.init( );
    }
    else menusHtml += `<a href="${menu.url}" target="_self">${menu.button}</a>`;
  }

  menuElement.innerHTML = menusHtml;
}





//
