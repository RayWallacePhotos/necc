//
//      Administrate.js

//  13 Feb 2023  Create

let VersionAdministrateJs = "0.1";


var Houdini = false;
let ItemsData = null;


administrateInit();


function administrateInit( ) {
  let emailElement = document.querySelectorAll( "footer a" )[1];

  emailElement.addEventListener( "click", houdini );

  SelectListID.addEventListener( "click", event => {
    let item = ItemsData[ event.target.dataset.item ];

    // Ensure we did not click between <span>'s
    if( item != undefined ) {
      let html = `<span contenteditable="true">${item.date}</span>`;

      if( item.lines.length ) html += `<span>${item.lines[0]}</span>`;

      for( let itemNum = 1; itemNum < item.lines.length; ++itemNum ) {
        html += `<span></span> <span>${item.lines[itemNum]}</span>`;
      }

      SelectedItemID.innerHTML = html;
    }
  });


  SelectedItemID.addEventListener( "focus", event => {
    console.log("focus");
  } );


  SelectedItemID.addEventListener( "click", event => {
    // console.log("click");
    event.target.addEventListener( "blur", event => {
      console.log("Target blur");
    });

    event.target.addEventListener( "focus", event => {
      console.log("Target focus");
    } );
  } );


  SelectedItemID.addEventListener( "input", event => {
    console.log("input");
  } );
}



function editCalendarOnClick( event ) {
  // [ {date, lines:[]}, ... ]
  loadMeetingCsv( "../MeetingsList.csv", data => {
    ItemsData = data;
    SelectListID.innerHTML = "";

    let itemNum = 0;
    for( let item of data ) {
      SelectListID.innerHTML += `<span data-item="${itemNum}" > &#9999;&#65039; </span> <span data-item="${itemNum}"> ${item.date} </span> <span data-item="${itemNum}"> ${item.lines[0]} </span>`;
      ++itemNum;
    }
  } );
}


function loadMeetingCsv( fileName, callback ) {
  let data = [];     // [ {date, lines:[]}, ... ]
  let lineDate;
  let fistCellInRow;

  fileReadText( fileName, textObj => {
    tableRows = "";

    if( textObj.text ) {
      let lines = textObj.text.split( "\n" ); // Get an array of the lines

      for( let line of lines ) {
        if( line = line.trim() ) {
          let cells = splitCSV( line ); // Get an array of csv cell data
          firstCellInRow = true;

          for( let cell of cells ) {
            if( firstCellInRow ) {
              firstCellInRow = false;
              lineDate = new Date(cell).toDateString();
              if( lineDate != "Invalid Date" ) {
                data.push( {date:lineDate, lines:[""]} );
              }
              else {
                data[data.length-1].lines.push( cell );
              }
            }
            else {
              data[data.length-1].lines[ data[data.length-1].lines.length-1 ] += " " + cell;
            }
          }
        }
      }

      callback( data );
    }
    else callback( "" );
  });
}




//
// Toggle Houdini when user Alt-clicks on my EMail address
//
// css can target .Houdini to markup any element's with the Houdini class (i.e. highlight, add text :after, etc...)
//
function houdini( event ) {
  if( event.altKey ) {
    let houdiniOnlyTags = document.querySelectorAll( ".HoudiniOnly" );

    Houdini = !Houdini;

    if( Houdini ) {
      event.target.classList.add( "Houdini" );

      for( let tag of houdiniOnlyTags ) {
        tag.classList.remove( "Hidden" );
      }
    }
    else {
      event.target.classList.remove( "Houdini" );

      for( let tag of houdiniOnlyTags ) {
        tag.classList.add( "Hidden" );
      }
    }
  }
}






//
