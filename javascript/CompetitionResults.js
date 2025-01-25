//    CompetitionResults.js
//
// 26 Dec 2024  Based on code from Misc.js
//              Major modifications to use my new competition results .json files
//


//                           Keep in sync with competition_scores/scores.js
//
// Rewrite everything to get and build everything from the new competitionResults.json file
//
// Competitions = {
//   headers: ["subject", "date", "author", "title", "score", "award", "filename"],
//   dates: ["YYYY-MM-DD", "YYYY-MM-dd", /*...*/],
//   "YYYY-MM-DD": {
//     authors: [],   // List of authors with entries in this completion
//     srcDirs:  "",  // i.e. path without the filename
//     destDirs: "",  // i.e. path without the filename
//     entries: [
//       {subject: "",  date: "",  author: "", title: "",  score: "",  award: "",  filename: ""},
//       {},
//       // ...
//     ]
//   },
//   "YYYY-MM-dd": {entries: [{/*...*/}]},
//   // ...
// }
//
let Competitions = {headers: [], dates: []}  // See above comment for layout



function competitionResultsInitContinued( ) {
  fileReadJson( "competitions_scores.json", result => {
    if( result.jsonObj ) {  // .jsdonObj is null on error
      Competitions = result.jsonObj

      buildScoresTables( )

      // Build the Date selection list
      let dateDomStr = ""
      for( let date of Competitions.dates ) {
        let dateStr = date.slice(0,4) + " " + toMonthStr( date.slice(5,7) - 1 )
        dateDomStr += `<option value="${date}">${dateStr}</option>`
      }
      DateSelectionID.innerHTML = dateDomStr

      // Build the Author selection list
      buildAuthorSelection( )
    }


    DateSelectionID.addEventListener( "change", event => {
      // Build the Author selection list
      buildAuthorSelection( )

      displayScores(  )
    } )


    UserSelectionID.addEventListener( "change", event => {
      displayScores(  )
    } )


    FirstPlaceOnlyID.addEventListener( "change", event => {
        displayScores(  )
    } )


    displayScores(  )
  } ) // END fileReadJson()
}



//
// Build the Author selection list based on the selected Date
//
function buildAuthorSelection( ) {
  let selectedDate   = DateSelectionID.children[DateSelectionID.selectedIndex].value
  let authorsDomStr = `<option value="**All**">**All Users**</option>`
  for( let author of Competitions[selectedDate].authors ) {
    authorsDomStr += `<option value="${author}">${author}</option>`
  }
  UserSelectionID.innerHTML = authorsDomStr
}



//
// Build the tables with ALL the Competitions then hide/show entries that match/don't match Date, Author, FirstPlace
//
// Seperate <table> for each .dates[]
//
function buildScoresTables( ) {
  for( let date of Competitions.dates ) {
    let {table, tbody} = createTable( date )

    for( let entry of Competitions[date].entries ) {
      addTableRow( tbody, entry, Competitions[date].destDirs )
    }

    CompetitionResultsID.append( table )
  }
}



//
// return {table, tbody}
//
function createTable( date ) {
  let table   = document.createElement( "table" )
  let caption = document.createElement( "caption" )
  let thead   = document.createElement( "thead" )
  let tbody   = document.createElement( "tbody" )

  table.id = `Table_${date}ID`
  caption.innerText = `${date} Competiion Scores`

  thead.innerHTML = `
      <tr>
        <th>Image</th> <th>Subject</th> <th>Title</th> <th>Author</th> <th>Score</th> <th>Award</th> <th>Date</th>
      </tr>
  `

  table.append( caption )
  table.append( thead )
  table.append( tbody )

  return {table, tbody}
}



function addTableRow( table, entry, destDirs ) {
  let row = document.createElement( "tr" )

  // Image, Subject, Title, Author, Score, Award, Date
  row.innerHTML = `
    <tbody>
      <tr>
        <td><img src="${destDirs}${entry.filename}"</td>
        <td>${entry.subject}</td> <td>${entry.title}</td> <td>${entry.author}</td>
        <td>${entry.score}</td> <td>${entry.award}</td>  <td>${entry.date}</td>
      </tr>
    </tbody>
  `

  table.append( row )
}



function displayScores(  ) {
  let selectedDate    = DateSelectionID.children[DateSelectionID.selectedIndex].value
  let firstPlaceOnly  = FirstPlaceOnlyID.checked
  let requestedAuthor = UserSelectionID.children[UserSelectionID.selectedIndex].value
  let dateTableElement = null

  // For now, only show one date table. Hide the others
  for( let date of Competitions.dates ) {
    if( date == selectedDate ) {
      // Remember the enabled table, we'll use it below
      dateTableElement = document.querySelector( `#Table_${date}ID` )
      dateTableElement.classList.remove( "Hidden" )
    }
    else  document.querySelector( `#Table_${date}ID` ).classList.add( "Hidden" )
  }

  // Shouldn't have to check dateTableElement, but...
  if( dateTableElement ) {
    // Showing/hide rows based on requestedAuthor and firstPlaceOnly
    for( let row of dateTableElement.querySelectorAll("tbody tr") ) {
      let author = row.cells[3].innerText
      let firstPlace = row.cells[5].innerText
      let date = row.cells[6].innerText

      // Show/hide entries per selceted author (or * ALL)
      if( (requestedAuthor == "**All**" || author == requestedAuthor) && (!firstPlaceOnly || firstPlace) && date == selectedDate ) {
        row.classList.remove( "Hidden" )
      }
      else  row.classList.add( "Hidden" )
    }
  }
}





//
