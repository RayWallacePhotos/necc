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
// 17 Mar 2024  Modifed CompetitionResults.html and Misc.js to handle new FirstPlaceOnlyID checkbox
//              Improved performance in displayScores()
//              V1.6
//              Reworkd displayScores() some more
//              V1.7
// 18 Mar 2024  Added First place icon and cursor for inputs
//              V1.8
// 15 Apr 2024  Replaced Files.js v1.7 with latest files.js v1.17
//              V1.9
//  7 Nov 2024  Fixed an issue in Misc.js addCalendarEntryOnClick() with some entries in the MeetingsList.csv
//              V2.0
// 23 Dec 2024  Moved setupHoudini( ) to here from (the unused) Administrate.js
//              V2.1
//



const Version = "V2.1";
const FirstYear = "2018";



var Houdini = false;

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

  setupHoudini( );

  loadFirstPlaceImagePaths( )
}



function loadFirstPlaceImagePaths( ) {
  fileReadJson( "competitions_scores.json", result => {
    if( result.jsonObj ) {
      let images = result.jsonObj

      for( let entry of images[images.dates[0]].entries ) {
        if(  entry.award ) {
          let containerElement = document.createElement( "span" )
          let img = document.createElement( "img" )
          let authorElement = document.createElement( "span" )

          containerElement.classList.add( "FirstPlaceContainer" )
          authorElement.classList.add( "Author" )

          authorElement.innerText = entry.author
          img.classList.add( "FirstPlaceImage" )
          img.src = `${images[images.dates[0]].destDirs}${entry.filename}`

          containerElement.appendChild( authorElement )
          containerElement.appendChild( img )
          FirstPlaceImagesID.appendChild( containerElement )
        }
      }

    }
    else console.error( `Could not read: competitions_scores.json`)
  } )
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


function setupHoudini( ) {
  // Add Houdini class to the footer (EMail) on the current html page (so I don't have to edit all .html files)
  let emailElement = document.querySelectorAll( "footer a" )[1];

  emailElement.addEventListener( "click", event => {
    if( event.altKey ) {
      let houdiniOnlyTags = document.querySelectorAll( ".HoudiniOnly" );

      Houdini = !Houdini;

      if( Houdini )  event.target.classList.add( "Houdini" );
      else   event.target.classList.remove( "Houdini" );

      for( let tag of houdiniOnlyTags ) {
        if( Houdini ) tag.classList.remove( "Hidden" );
        else tag.classList.add( "Hidden" );
      }
    }
  } )
}





//
