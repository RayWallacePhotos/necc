//
//	        Misc.js
//
//        Misc Helper Classes and functions
//
//  20 Sep 2022 Created
//  30 Dec 2022 Added loading="lazy" for <img>'s
//  21 Feb 2024 Added competitionResultsInit()
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

	var nameBox = document.getElementById("mailNameID");
	var fromBox = document.getElementById("mailFromID");
	var messageBox = document.getElementById("mailMessageID");

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
  displayCSVFile( "meetingsID" );

   // DEBUG TESTING for editing meetings.csv table/file
//  let table = meetingsID.querySelector( "table" );
//  table.contentEditable = true;
}



function photoTripsInit( ) {
  displayCSVFile( "photoTripsID", "Striped" );
}



function competitionInit( ) {
  displayCSVFile( "scanvengerListID", "Striped" );
  displayCSVFile( "assignedSubjectsID", "Striped" );
}



function competitionResultsInit( ) {
  let filename = competitionResultsID.innerHTML

  LargeImageID.addEventListener( "click", event => {
    LargeImageID.classList.add( "Hidden" );
  })


  fileReadText( filename, result => {
    competitionResultsID.innerHTML = result.text

    competitionResultsID.addEventListener( "click", event => {
      if( event.target.tagName == "IMG" && event.altKey ) {
        let id = event.target.src.slice(-12,-4)

        LargeImageID.classList.remove( "Hidden" );

        LargeImageID.src = `https://ccocne.photoclubservices.com/ImageZoom2.aspx?ImageSize=2&ImageId=${id}`
        // LargeImageID.src = "https://picsum.photos/200/300"  // This works

// // DEBUG
//         // Error "No 'Access-Control-Allow-Origin' header is present"
//         fetch( `https://ccocne.photoclubservices.com/ImageZoom2.aspx?ImageSize=2&ImageId=${id}`,
//            {mode:"cors", headers:{Origin: 'ccocne.photoclubservices.com'} } ) // cors error without headers
//         // fetch( `https://ccocne.photoclubs}ervices.com/ImageZoom2.aspx?ImageSize=2&ImageId=${id}`, {mode:"no-cors"} )
//         // fetch( `https://ccocne.photoclubservices.com/ImageZoom2.aspx?ImageSize=2&ImageId=${id}`, {mode:"same-origin"} ) // NOT the same origin
//         // fetch( `https://picsum.photos/200/300` )
//
//         // .then( result => result.blob() )
//         // .then( aBlob => {
//         //   console.log( aBlob ) // type "", size 0
//         //
//         //   competitionResultsID.src = URL.createObjectURL( aBlob )
//         //   competitionResultsID.onload = event => {
//         //     URL.revokeObjectURL( objUrl )
//         //   }
//
//         .then( response => {
//           if( !response.ok ) console.error( `fetch failed: ${response.status}::"${response.statusText}"`)
//           console.log( response )
//
//         // .then( response => response.text() )
//         // .then( data => {
//         //   console.log( data )  // ""
//
//         // .then( response => response.json() ) // Unexpected end of input
//         // .then( data => {
//         //   console.log( data )
//         //   console.log( JSON.stringify(data) )
//
//         } ) // END fetch & .then
//         .catch( error => {
//           console.error( error )
//         })
      } // END if tagName
    } ) // END addEventListener()
  } ) // END fileReadText()
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
  let tableRows = "";
  let firstCell = true;
  let firstCellDate = null;
  let lineDate;
  let fistCellInRow;
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
              if( firstCellDate.toString() != "Invalid Date" ) calendar = true; // Treat this csv file as a calendar
            }
            if( firstCellInRow && calendar && cell ) {
              firstCellInRow = false;
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

            tableRows += `<td class=${oldDateClass}>${cell}</td>`;
          }

          tableRows += `</tr>`;
        }
      }
      element.innerHTML = `<table>${tableRows}</table>`;
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





//
