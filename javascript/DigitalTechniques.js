//
//	        DigitalTechniques.js
//
//        Misc Helper Classes and functions
//
//  27 Sep 2022  Created
//  15 Jun 2024  Changed to using <details> and replaced rollUpDownOnClick() with rollUpDownOnToggle()
//



let RolledDownElement = null; // So we can roll it up when it is clicked again or another technique is clicked


function digitalTechniquesInit(  ) {
  let elementHtml = "";
  const dir = "../digital_techniques/";
  let container = document.querySelector( ".DigitalTechniques" );

  fileReadText( `digital_techniques.txt`, textObj => {
    if( textObj.text ) {
      let fileNames = textObj.text.split("\n");

      for( let fileName of fileNames ) {
        elementHtml += `<details class="RollUpDown"  ontoggle="rollUpDownOnToggle(event)">`;
        elementHtml += `  <summary class="Title" oncontextmenu="rollUpDownOnContext(event)">${fileName}</summary>`;
        elementHtml += `  <div class="Content">`;

        if( extension(fileName) == ".pdf" ) {
          elementHtml += `    <object type="application/pdf" data="${dir}${fileName}"> </object>`;
        }
        else if( extension(fileName) == ".txt" ) {
          elementHtml += `    <object type="text/plain" data="${dir}${fileName}"> </object>`;
        }
        else if( extension(fileName) == ".html" ) {
          elementHtml += `    <object type="text/html" data="${dir}${fileName}"> </object>`;
        }

        elementHtml += `  </div>`;
        elementHtml += `</details>`;
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



function rollUpDownOnToggle( event ) {
  if( event.target.open ) {
    if( RolledDownElement ) {
      RolledDownElement.classList.remove( "RollDown" );
      RolledDownElement.removeAttribute("open");
    }

    event.target.classList.add( "RollDown" );

    RolledDownElement = event.target;

    event.target.scrollIntoView(true); // true = will be aligned to the top of the visible area of the scrollable ancestor
  }
  else {
    event.target.classList.remove( "RollDown" );

    // Only clear if we just closed the last one open
    if( RolledDownElement && RolledDownElement == event.target ) RolledDownElement = null;
  }
}



function rollUpDownOnContext( event ) {
  let linkText = event.target.parentElement.querySelector("div.Content object").data
  event.preventDefault()

  if( isSecureContext ) {
    navigator.clipboard.writeText( linkText )
    DialogOk( "COPIED to CLIPBOARD", "Link to this Technique was copied to clipboard", event.pageX, event.pageY )
  }
  else {
    DialogOk( "Select and ctl-C", linkText, event.pageX, event.pageY )
    console.log( `Clipboard is only available with https:// OR localhost` );
  }
}





//
