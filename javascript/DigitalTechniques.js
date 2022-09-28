//
//	        DigitalTechniques.js
//
//        Misc Helper Classes and functions
//
//  27 Sep 2022 	Created
//



function digitalTechniquesInit(  ) {
  let elementHtml = "";
  const dir = "../digital_techniques/";
  let container = document.querySelector( ".DigitalTechniques" );

  fileReadText( `digital_techniques.txt`, textObj => {
    if( textObj.text ) {
      let fileNames = textObj.text.split("\n");

      for( let fileName of fileNames ) {
        elementHtml += `<div class="RollUpDown">`;
        elementHtml += `  <div class="Title" onclick=rollUpDownOnClick(event)>${fileName}</div>`;
        elementHtml += `  <div class="Content">`;

        if( extension(fileName) == ".pdf" ) {
          elementHtml += `    <object type="application/pdf" data="${dir}${fileName}"> </object>`;
        }
        if( extension(fileName) == ".txt" ) {
          elementHtml += `    <object type="text/plain" data="${dir}${fileName}"> </object>`;
        }
        if( extension(fileName) == ".html" ) {
          elementHtml += `    <object type="text/html" data="${dir}${fileName}"> </object>`;
        }

        elementHtml += `  </div>`;
        elementHtml += `</div>`;


        // fileReadText( `$digital_techniques/${htmlFile}`, textObj => {
        //   if( textObj.text ) {
        //   }
        // } );
      }

      container.innerHTML = elementHtml;
    }
  } );
}


function extension( fileName ) {
  let extStart;

  extStart = fileName.lastIndexOf( "." );
  if( extStart != -1 ) return fileName.substring( extStart );
  else return "";
}


let RolledDownElement = null;
function rollUpDownOnClick( event ) {
  if( RolledDownElement ) {
    // Roll up the previuosly rolled down element (if there was one)
    RolledDownElement.parentElement.classList.remove( "RollDown" );

  }
  if( RolledDownElement == event.target ) {
    // No Element rolled down now, since we just rolled up the element clicked on
    RolledDownElement = null;
  }
  else if( RolledDownElement != event.target ) {
    // Roll it down and save it
    event.target.parentElement.classList.add( "RollDown" );
    event.target.parentElement.scrollIntoView(true); // true = will be aligned to the top of the visible area of the scrollable ancestor.
    RolledDownElement = event.target;
  }
}


function showDigitalTechniques( ) {


}











//
