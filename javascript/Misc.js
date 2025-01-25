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
//   5 Mar 2025 Fixed time in the addCalendarEntry()
//              Tweaked displayCSVFile() a bit
//  14 Mar 2024 "Final" fix for OldDateClass
//  17 Mar 2024 Modifed competitionResultsInit() and displayScores() to handle new FirstPlaceOnlyID checkbox
//              Reworked displayScores() to improve performance for displaying/re-displaying the scores table
//              Some rework/simplifying code in displayScores()
//  15 Apr 2024 Changed competitionResultsInit() to read filenames from  .json instead of mbedded in CompetitionResults.html
//  15 Apr 2024 Fixed competitionResultsInit() so the "_" replacement is global replace
//  13 May 2024 Fixed displayCSVFile() to only show Google Calendar caption IF the table is a calendar
//  7 Nov 2024  Fixed an issue in addCalendarEntryOnClick() with some entries in the MeetingsList.csv
// 23 Dec 2024  Added saveCompetitionResultsOnClick( event ) to support the <button> added to CompetitionResults.html
// 31 Dec 2024  Contrary to previous entry, we never did have saveCompetitionResultsOnClick() in here and don't use it at all now
// 25 Jan 2025  Changed photosInit() to use the new competitions_results.json file
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



//
// Main init code is in CompetitionResults.js
//
function competitionResultsInit( ) {
  competitionResultsInitContinued( )
}



function photosInit( ) {
  let nameText;

  PhotosID.innerHTML = "";

  fileReadJson( "competitions_scores.json", result => {
    if( result.jsonObj ) {
      let images = result.jsonObj

      for( let entry of images[images.dates[0]].entries ) {
        if(  Math.random() > 0.85 ) {
          // element.innerHTML += `<span class="PhotoFrame"><img loading="lazy" src="photos/${fileName}"><span>${nameText}</span></span>`;
          let frameElement = document.createElement( "span" )
          let img = document.createElement( "img" )
          let authorElement = document.createElement( "span" )

          frameElement.classList.add( "PhotoFrame" )
          // authorElement.classList.add( "Author" )

          authorElement.innerText = `${entry.title} - ${entry.author}`
          img.classList.add( "FirstPlaceImage" )
          // DEBUG Add lazy loading to the other two places that load competion images
          img.loading = "lazy"
          img.src = `${images[images.dates[0]].destDirs}${entry.filename}`

          frameElement.appendChild( img )
          frameElement.appendChild( authorElement )
          PhotosID.appendChild( frameElement )
        }
      }

    }
    else console.error( `Could not read: competitions_scores.json`)
  } )
}



// function OLDphotosInit( ) {
//   let nameText;
//   let element = document.querySelector( ".SlideShow" );
//
//   fileReadText( element.innerText, textObj => {
//     if( textObj.text ) {
//       let fileNames = textObj.text.split( "\n" ); // Get an array of the lines
//
//       element.innerHTML = "";
//       for( let fileName of fileNames ) {
//         nameText = fileName.replace(/-/g, " - ").replace(/_/g, " ")
//         if( fileName ) element.innerHTML += `<span class="PhotoFrame"><img loading="lazy" src="photos/${fileName}"><span>${nameText}</span></span>`;
//       }
//     }
//   });
// }



//
// For a csv spec/RFC see:
//  https://datatracker.ietf.org/doc/html/rfc4180
// ---OR---
//  https://www.ietf.org/rfc/rfc4180.txt
//
function displayCSVFile( elementID, trClasses="" ) {
  let element = document.getElementById( elementID );
  // Fixed displayCSVFile() to only show Google Calendar caption IF the table looks to be a calendar
  let tableCaption = "<caption>*Click on a date to add meeting to your Google Calendar if you use it.</caption>"
  let tableRows = "";
  let firstCellDate = null;
  let cellInRowNumber
  let lineDate;
  let fistCellInRow;
  let cursorClass = "";
  let oldDateClass = "";
  let calendar = false; // For now, set this to true IF the first cell is a valid javascript Date

  fileReadText( element.innerText, textObj => {
    tableRows = "";

    if( textObj.text ) {
      let lines = textObj.text.trim().split( "\n" ); // Get an array of the lines

      // Determine if this csv file is a calendar
      firstCellDate = new Date(splitCSV(lines[0])[0]);
      if( firstCellDate.toString() != "Invalid Date" )  calendar = true; // Treat this csv file as a calendar

      for( let line of lines ) {
        if( line = line.trim() ) {
          let cells = splitCSV( line ); // Get an array of csv cell data
          cellInRowNumber = 0;  // first cell in row

          tableRows += `<tr class=${trClasses}>`;

          for( let cell of cells ) {
            // Bunch of code to handle calendar like csv files, to mark old/past dates with a OldDateClass so css can style them diff
            if( calendar && cellInRowNumber == 0 && cell ) {
              cursorClass = "Cursor"
              lineDate = new Date(cell);
              lineDate.setHours(21)  // Fix for OldDateClass - Edited on 14 Mar 2024
              if( lineDate.toString() != "Invalid Date" ) {
                // Compare dates and change oldDateClass to either "OldDateClass" or ""
                if( lineDate.getTime() < Date.now() ) {  // Fix for OldDateClass - Changed from <= on 14 Mar 2024

                  oldDateClass = "OldDateClass";
                }
                else {
                  oldDateClass = "";
                }
              }
            }
            else cursorClass = ""

            tableRows += `<td class="${cursorClass} ${oldDateClass}">${cell}</td>`;

            ++cellInRowNumber;
          } // END for( cells )

          tableRows += `</tr>`;
        } // END if( line )
      } // END for( lines )
      element.innerHTML = `<table>${calendar?tableCaption:""}<tbody onclick="addCalendarEntryOnClick(event)">${tableRows}</tbody></table>`;
    }
  });
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



function addCalendarEntryOnClick( event ) {
  let target = event.target
  let row = event.target.parentElement
  let date
  let time = ""
  let title = ""
  let description = ""

  // Ensure we clicked on a date cell
  if( target.tagName == "TD" && row.children[0] == event.target && row.children[0].innerHTML ) {
    date = row.children[0].innerText
    title = row.children[1].innerText

    description += row.children[1].innerText

    let siblingRow = row.nextSibling

    // Get the time from the second row
    let timePieces = siblingRow.children[1].innerText.split( " " )  // e.g. 7:30 PM
    let amPm = timePieces.length < 2 ? "" : timePieces[1].trim().toUpperCase()
    let startHour  = (parseInt(timePieces[0].split(":")[0]) + (amPm == "PM" ? 12 : 0)).toString().padStart(2,"0")
    let endHour  = (parseInt(timePieces[0].split(":")[0]) + (amPm == "PM" ? 12 : 0) + 2).toString().padStart(2,"0")
    let minutes = parseInt(timePieces[0].split(":")[1]).toString().padStart(2,"0")
    let startTime = `${startHour}${minutes}00000`
    let endTime   = `${endHour}${minutes}00000`

    while( siblingRow && siblingRow.children.length > 1 && !siblingRow.children[0].innerHTML ) {
      description += "\n" + siblingRow.children[1].innerText

      siblingRow = siblingRow.nextSibling
    }

    addCalendarEntry( date, startTime, endTime, title, description )
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
function addCalendarEntry( date, startTime, endTime, title, description ) {
  title        = "Camera Club - " + title
  let locationName = "College Church basement, 337 Main St Lancaster MA"
  let startDateTime // YYYYMMDDTHHmmSSZ
  let endDateTime   // YYYYMMDDTHHmmSSZ
  startDateTime = new Date(date).toISOString().replace(/[-:\.]/g, "").split("T")[0]+`T${startTime}`  // 19000000   7:00pm
  endDateTime   = new Date(date).toISOString().replace(/[-:\.]/g, "").split("T")[0]+`T${endTime}`  // to 21000000  9:00pm

  // Encode spaces etc.. and create calendar event
  window.open( encodeURI(`https://calendar.google.com/calendar/r/eventedit?ctz=America/New_York&text=${title}&location=${locationName}&details=${description}&dates=${startDateTime}/${endDateTime}&sprop=website:www.NewEnglandCameraClub.org`) )
}





//
