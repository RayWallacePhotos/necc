//
//	        Misc.js
//
//        Misc Helper Classes and functions
//
//  20 Sep 2022 Created
//  30 Dec 2022 Added loading="lazy" for <img>'s
//  21 Feb 2024 Added competitionResultsInit()
//   3 Mar 2024 Added support for adding event to Google Calendar by clicking on date
//              by adding addCalendarEntryOnClick() and addCalendarEntry()
//              Fixed oldDateClass so it is in quotes
//



/*
 * Process the EMAIL input fields
 *
 * Uses ID's, IDEMailName, IDEMailFrom, IDEMailMessage
 *
 */
function sendEmailOnClick( event ) {
  var emailName = "";
	var emailFrom = "";
	var emailTo = "Ray@RipsPics.com";
	var emailSubject = "NECC: Website form";
	var emailBody = "";
	var msg = "";

	var nameBox = document.getElementById("MailNameID");
	var fromBox = document.getElementById("MailFromID");
	var messageBox = document.getElementById("MailMessageID");

	emailName = nameBox.value;
	emailFrom = `<${fromBox.value}>`;
	emailBody = `From: ${emailName} ${emailFrom}\n ${messageBox.value}`;

	msg = `mailto:${emailTo}?subject=${encodeURI(emailSubject)}&body=${encodeURI(emailBody)}`;

	/* Now Open the EMail window with all the From/Subject/Body */
	var emailWindow = window.open( msg );

	/* Firefox was opening a blank new tab/window, so I need to close it */
	emailWindow.close( );

	/* Clear all the fields (boxes) as feedback to the user that we're done */
	nameBox.value = "";
	fromBox.value = "";
	messageBox.value = "\n\n\t\tTHANK YOU FOR YOUR INQUIRY!\n\nWe will get back to you as soon as we can.";
}


function meetingsInit( ) {
  displayCSVFile( "MeetingsID" );

   // DEBUG TESTING for editing meetings.csv table/file
//  let table = MeetingsID.querySelector( "table" );
//  table.contentEditable = true;
}



function photoTripsInit( ) {
  displayCSVFile( "PhotoTripsID", "Striped" );
}



function competitionInit( ) {
  displayCSVFile( "ScanvengerListID", "Striped" );
  displayCSVFile( "AssignedSubjectsID", "Striped" );
}



function competitionResultsInit( ) {
  let dates = ""
  let authors = `<option value="**All**">**All Users**</option>`

  for( let filename of ScoresFilesID.innerText.split(",") ) { // i.e. scores_Feb_2024.html, scores_Jan_2024.html
    let dateStr = capitalizeWords( filename.trim().slice(7,-5).replace("_", " ") )
    dates += `<option value="${dateStr}">${dateStr}</option>`
  }
  DateSelectionID.innerHTML = dates

  UserSelectionID.innerHTML = authors

  LargeImageID.addEventListener( "click", event => {
    LargeImageID.classList.add( "Hidden" );
  })


  DateSelectionID.addEventListener( "change", event => {
  // DEBUG
    // let filename = `scores/scores_${event.target.value.toLowerCase().replaceAll(" ", "_")}.html`
    let filename = `scores/scores_${event.target.value.replaceAll(" ", "_")}.html`

    let author = UserSelectionID.children[UserSelectionID.selectedIndex].value
    displayScores( filename, author )
  } )


  UserSelectionID.addEventListener( "change", event => {
    let author = event.target.value

    let date = DateSelectionID.children[DateSelectionID.selectedIndex].value
  // DEBUG
    // let filename = `scores/scores_${date.toLowerCase().replaceAll(" ", "_")}.html`
    let filename = `scores/scores_${date.replaceAll(" ", "_")}.html`
    displayScores( filename, author )
  } )


  let date = DateSelectionID.children[DateSelectionID.selectedIndex].value
  // let author = AuthorsListID.children[AuthorsListID.selectedIndex].value  // AuthorsListID is in scores .html, which isn't not loaded yet
  let author = "**ALL**"
// DEBUG
  // displayScores( `scores/scores_${date.toLowerCase().replaceAll(" ", "_")}.html`, author )
  displayScores( `scores/scores_${date.replaceAll(" ", "_")}.html`, author )
}



function displayScores( filename, requestedAuthor ) {
  let authorStillExists = false

  requestedAuthor = requestedAuthor.trim()

  fileReadText( "../" + filename, result => {
    if( result.text ) {
      let authorsDomStr = `<option value="**All**">**All Users**</option>`

      CompetitionResultsID.innerHTML = result.text

      // Build new Author selection list
      let prevousUserIndex = -1
      let index = 1 // Account for "**ALL**" which is not in the AuthorsListID, but is always in the UserSelectionID
      for( let author of JSON.parse(AuthorsListID.innerText) ) {
        let authorStr = author.trim()
        authorsDomStr += `<option value="${authorStr}">${authorStr}</option>`

        if( requestedAuthor == authorStr ) {
          authorStillExists = true
          prevousUserIndex = index
        }

        ++index
      }
      UserSelectionID.innerHTML = authorsDomStr

      if( authorStillExists && requestedAuthor != "**ALL**" ) {
        UserSelectionID.selectedIndex = prevousUserIndex

        // Need index of Author header
        let authorIndex
        let th = CompetitionResultsID.querySelectorAll("th")
        for( let next = 0, found = false; next < th.length && !found; next++ ) {
          found = th[next].innerText == "Author"
          if( found ) authorIndex = next
        }

        // Hide authors if needed
        for( let entry of CompetitionResultsID.querySelectorAll("tbody tr") ) {
          let authorName = entry.querySelectorAll("td")[authorIndex].innerText
          if( requestedAuthor != authorName ) entry.classList.add( "Hidden" )
        }
      }
    }
    else CompetitionResultsID.innerHTML = ""
  } ) // END fileReadText()


  // Display larger image when click on thumbnail
  // CompetitionResultsID.addEventListener( "click", event => {
  //   // DEBUG Only hiding the click behind the alt key for testing purposes
  //   if( event.target.tagName == "IMG" && event.altKey ) {
  //     // let id = event.target.src.slice(-12,-4)
  //     let bigImgPath = event.target.src.replace( "/scores_thumbnails_", "/scores_big_images_" )
  //
  //     LargeImageID.classList.remove( "Hidden" );
  //     LargeImageID.src = bigImgPath
  //   } // END if tagName
  // } ) // END addEventListener()
}



function photosInit( ) {
  let nameText;
  let element = document.querySelector( ".SlideShow" );

  fileReadText( element.innerText, textObj => {
    if( textObj.text ) {
      let fileNames = textObj.text.split( "\n" ); // Get an array of the lines

      element.innerHTML = "";
      for( let fileName of fileNames ) {
        nameText = fileName.replace(/-/g, " - ").replace(/_/g, " ")
        if( fileName ) element.innerHTML += `<span class="PhotoFrame"><img loading="lazy" src="photos/${fileName}"><span>${nameText}</span></span>`;
      }
    }
  });
}


function displayCSVFile( elementID, trClasses="" ) {
  let element = document.getElementById( elementID );
  let tableCaption = "<caption>*Click on a date to add meeting to your Google Calendar if you use it.</caption>"
  let tableRows = "";
  let firstCell = true;
  let firstCellDate = null;
  let lineDate;
  let fistCellInRow;
  let cursorClass = "";
  let oldDateClass = "";
  let calendar = false; // For now, set this to true IF the firstCell is a valid javascript Date

  fileReadText( element.innerText, textObj => {
    tableRows = "";

    if( textObj.text ) {
      let lines = textObj.text.split( "\n" ); // Get an array of the lines

      for( let line of lines ) {
        if( line = line.trim() ) {
          let cells = splitCSV( line ); // Get an array of csv cell data
          firstCellInRow = true;

          tableRows += `<tr class=${trClasses}>`;

          for( let cell of cells ) {

            // Bunch of code to handle calendar like csv files, to mark old/past dates with a OldDateClass so css can style them diff
            if( firstCell ) {
              firstCell = false;
              firstCellDate = new Date(cell);
              if( firstCellDate.toString() != "Invalid Date" )  calendar = true; // Treat this csv file as a calendar
            }
            if( firstCellInRow && calendar && cell ) {
              firstCellInRow = false;
              cursorClass = "Cursor"
              lineDate = new Date(cell);
              if( lineDate.toString() != "Invalid Date" ) {
                // Compare dates and change oldDateClass to either "OldDateClass" or ""
                if( lineDate.getTime() <= Date.now() ) {

                  oldDateClass = "OldDateClass";
                }
                else {
                  oldDateClass = "";
                }
              }
            }
            else cursorClass = ""

            tableRows += `<td class="${cursorClass} ${oldDateClass}">${cell}</td>`;
          }

          tableRows += `</tr>`;
        }
      }
      element.innerHTML = `<table>${tableCaption}<tbody onclick="addCalendarEntryOnClick(event)">${tableRows}</tbody></table>`;
    }
  });
}



function addCalendarEntryOnClick( event ) {
  let target = event.target
  let row = event.target.parentElement
  let date
  let title = ""
  let description = ""

  // Ensure we clicked on a date cell
  if( target.tagName == "TD" && row.children[0] == event.target && row.children[0].innerHTML ) {
    date = row.children[0].innerText
    title = row.children[1].innerText

    description += row.children[1].innerText

    let siblingRow = row.nextSibling
    while( siblingRow && !siblingRow.children[0].innerHTML ) {
      description += "\n" + siblingRow.children[1].innerText

      siblingRow = siblingRow.nextSibling
    }

    addCalendarEntry( date, title, description )
  }
}



//
// NOTE: For docs, please see: https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
//    Timezone:    ctz=America/New_York
//           Leave off Z suffix if specifying timezone
//    Date Time:   YYYYMMDDTHHmmSSZ/YYYYMMDDTHHmmSSZ
//           i.e. 20240310T013000Z/20240310T013000Z
//           Leave off Z suffix for users timezone. Can also ADD ctz=  to specify timezone
//    Title:       text=
//    Description: details=
//    Location:    location=
//           A location that Google maps will understand (Lunenburg Walmart, 45 Page Hill Rd Lunenburg MA, etc..)
//    Website:     sprop=website:www.NewEnglandCameraClub.org
//           Did NOT do anything
//
function addCalendarEntry( date, title, description ) {
  title        = "Camera Club - " + title
  let locationName = "College Church basement, 337 Main St Lancaster MA"
  let startDateTime // YYYYMMDDTHHmmSSZ
  let endDateTime   // YYYYMMDDTHHmmSSZ
  startDateTime = new Date(date).toISOString().replace(/[-:\.]/g, "").split("T")[0]+"T19000000"  // 7:00pm
  endDateTime   = new Date(date).toISOString().replace(/[-:\.]/g, "").split("T")[0]+"T21000000"  // to 9:00pm

  // Encode spaces etc.. and create calendar event
  window.open( encodeURI(`https://calendar.google.com/calendar/r/eventedit?ctz=America/New_York&text=${title}&location=${locationName}&details=${description}&dates=${startDateTime}/${endDateTime}&sprop=website:www.NewEnglandCameraClub.org`) )
}



//
// Split line into an array of cells, based on csv rules
//
// Returns array of cell data
//
function splitCSV( line ) {
  let cells = [];
  let nextCell = 0;

  while( line.length ) {
    line = csvCell( line, cells ); // Calls csvQuotedCell() as needed
  }

  return cells;
}

//
// Parse next csv cell from line
//
// Returns unused portion of line
// Adds new cell data to end of cells array
//
function csvCell( line, cells ) {
  let charIndex;

  line = trimLeading( line );

  if( line.length ) {
    if( line[0] == '"' ) line = csvQuotedCell( line, cells );
    else {
      charIndex = line.indexOf(',');
      if( charIndex != -1 ) {
        cells[cells.length] = line.slice( 0, charIndex ).trim();
        line = line.slice( charIndex + 1 ); // Skip to  after the comma
      }
      else {
        // No next comma, so use rest of line as cell data
        cells[cells.length] = line.trim();
        line = ""; // Nothing left to parse
      }
    }
  }

  return line;
}

function csvQuotedCell( line, cells ) {
  let charIndex;

  line = line.slice(  1 ); // Skip the leading quote

  line = trimLeading( line );

  if( line.length ) {
      charIndex = line.indexOf('"');
      if( charIndex != -1 ) {
        cells[cells.length] = line.slice( 0, charIndex );
        line = line.slice( charIndex + 2 ); // Skip to after the quote and the comma
      }
      else {
        // No next quote (that's an error), so use rest of line as cell data
        cells[cells.length] = line;
        line = ""; // Nothing left to parse
      }
  }

  return line;
}

function trimLeading( line ) {
  while( line[0] == ' ' || line[0] == '\t' ) {
    line = line.slice( 1 );
  }

  return line;
}





//
