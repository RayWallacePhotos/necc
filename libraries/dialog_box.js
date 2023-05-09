//
//        dialog_box.js
//
//        Dialog and Message Box Classes and functions
//
//  Written while writing The Hike Game
//
//  RWWJ  1 Jan 2022  Created
//  RWWJ 30 Aug 2022  Moved mouseDown to close dialog into createDialogBox()
//                    Added handling for ESC/escape key to close dialog
//  RWWJ  6 Sep 2022  Added makeDOMId() to sanitize ID names (replace invalid ID characters)
//                    Modified DialogMenu() to display a Text Input with a Button when button name is ""
//                    Added constrainDialogPosition() and calls to it after adding content to each dialog box
//                    Added Version text
//                    Version 1.1
// RWWJ 19 Sep 2022   In both createButton() and createActionButton(), move the .appendChild(button) outside of the else{}
//                    Version 1.2
//  21 Nov 2022  Fixed the handling of x,y defaults in createButton()
//               Added a Close button in createDialogBox(), which will affect DialogOk() and all the others that use it
//               Version 1.3
//  16 Dec 2022  Changed createDialogBox() to NOT close when clicked on, only when CLOSE button is clicked
//               Modified all the functions that were overriding createDialogBox()'s onclick
//               Major edit to DialogMenu() to deal with close button and it's own buttons
//               Lots more fixes to DialogMenu() to work correctly with recent changes
//               Fixed makeDOMId() to NOT include spaces in the ID name
//               Fixed DialogYesNo() to not close when dialog box was clicked on
//               V1.4
//  18 Dec 2022  Fixed centering code in createDialogBox2()
//               V1.4a
//  20 Dec 2022  Fixed createButton() x & y error and removed them from paramater list
//               V1.4b
//  23 Dec 2022  Added cssColorDefaults( ) and a call to it
//               Removed all use of makeDOMId().
//               Removed all re-use code. All created elements (buttons, dialog boxes, etc..) are now new, never re-used
//               Added addElement( )
//               V1.4d
//               Modified addElement( ) to add id and classlist if supplied
//               V1.4e
//               Fixed textArea on multiple and subsequent uses
//               Made overlapping dialog boxes accessible with :hover & z-index
//               V1.4f
//




//
//  NEEDS/REQURIES/USES:
//    Mostly Standalone (so far)
//


var DialogBoxJsVersion = "1.4f";
// Set the stylesheet for dialog boxes at initialization
setDialogboxStyelsheet( );


//
//   MEMBER FUNCTIONS
//
// DialogInventory( viewPort, board, playerInventory )
// createCanvas( parentElement, title, x, y, w, h )
// DialogYesNo( titleStr, msgText, x, y, callbackFunction = null )
// DialogOk( titleStr, msgText, x, y, callbackFunction = null )
// DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null )
// DialogActions( titleStr, actions, x, y )
// addElement( type="div", {parent=null, id=null, classList=null} )
// makeDOMId( name, suffix = "ID" )
// createTextArea( parentElement )
// createButton( parentElement, txt, isMenu = false )
// createActionButton( parentElement, txt, action, isMenu = false )
// constrainDialogPosition( dialogElement )
// createDialogBox( titleStr, msgText, x = null, y = null )
// createDialogBox2( titleStr, msgText, x = null, y = null )
// closeDialogBox2( event )
// createSlider( label, min, max, x = null, y = null, callback = null )
// DialogHistory1( titleStr, current, history, x, y, callbackFunction = null )
// cssColorDefaults( )
// setDialogboxStyelsheet( )




//
// Not sure if we need to pass in viewPort OR the .board
//
function DialogInventory( viewPort, board, playerInventory ) {
  let dialogBox;
  let dialogBoxX = null;  // Will get centered horizontally
  let dialogBoxY = 100;
  let contentElement;
  let canvas;
  let canvasSize = viewPort.cellSize; // Realy no relationship to cellSize, but it is a good size for these :-)
  let item;
  // Only gets the (top level) key names, not the the individual objects
  let inventoryArray = Object.keys(playerInventory);

  // Create our main dialog box
  dialogBox = createDialogBox2( "INVENTORY", "Items in Players inventory", dialogBoxX, dialogBoxY );

  // Mark header so css will change the font for us
  dialogBox.getElementsByClassName("DlgHeader")[0].classList.add("BigCreepyFont");

  // Get the content area, so we can place all our items to it
  contentElement = document.getElementsByClassName("DlgContent")[0];

  // Loop through inventory
  //
  // Creating a small canvas for each item. Draw on it using layer,col,row for image src
  //
  // Also need
  for( item = 0; item < inventoryArray.length; ++item ) {
    let layer = playerInventory[inventoryArray[item]].layer;
    let description = playerInventory[inventoryArray[item]].description;
    let quantity = playerInventory[inventoryArray[item]].quantity;
    let boardCol = playerInventory[inventoryArray[item]].col;
    let boardRow = playerInventory[inventoryArray[item]].row;
    // Convert col, row to from board col, row, to spriteSheet col, row
    col = board.layers[layer].cellData[boardCol][boardRow].col;
    row = board.layers[layer].cellData[boardCol][boardRow].row;

    // We need an item container, with canvas on left and item values on it's right
    let containerElement = document.createElement("div");
    containerElement.classList.add( "DlgItemContainer" );
    contentElement.appendChild( containerElement );

    canvas = createCanvas( containerElement, inventoryArray[item], canvasSize, canvasSize );

    // Calculate x, y, with formula for indent, border, etc...
    let srcX = board.layers[layer].imageObj.spriteXY(col,row).x;
    let srcY = board.layers[layer].imageObj.spriteXY(col,row).y;
    canvas.drawImage( board.layers[layer].imageObj.element, srcX, srcY, canvasSize, canvasSize, 0, 0, canvasSize, canvasSize );

    let propertiesElement = document.createElement("div");
    containerElement.appendChild( propertiesElement );

    // Display some of the properties of this object
    let properties = board.layers[layer].imageObj.properties[col][row];
    propertiesElement.innerHTML = `<bold>${description}</bold><br> quantity: ${quantity}
    <br>Value: ${properties.Value}
    <br>Key: ${properties.Key}
    <br>Health: ${properties.Health}
    <br>SingleUse: ${properties.SingleUse}
    <br>Message: ${properties.Message}
    <!-- <br>Action: ${properties.Action} -->
    `;
  }

  constrainDialogPosition( dialogBox );
}


//
// Support function
// Base code for creating canvas' for our dialog boxes
//
// Returns canvas context (NOT the <canvas> element)
//
function createCanvas( parentElement, title, w, h ) {
  let canvasElement;
  let titleElement;
  let area = addElement( "div", {parent:parentElement} );  // Container for Title and Canvas, so they go in one grid area

  // Create a title
  addElement( "div", {parent:area} ).innerText = title;

  // insert canvas into page DOM, associated to our dialog box <div>
  canvasElement = addElement( "canvas", {parent:area} );

  // Position it
  canvasElement.style.marginBottom = "30px";

  // Set size. NOTE: Both element.style and canvas must be same size or we will get scaling
  canvasElement.width = w;
  canvasElement.style.width = w+"px";
  canvasElement.height = h;
  canvasElement.style.height = h+"px";

  return canvasElement.getContext("2d");
}



//
// Return "yes" or "no" for user clicking the "yes" or "no" button respectively
//
function DialogYesNo( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, msgText, x, y );

  // Create "yes" and "no" buttons
  let buttonTwo = createButton( msgBoxElement, "No" );
  let buttonOne = createButton( msgBoxElement, "Yes" );

  constrainDialogPosition( msgBoxElement );

  msgBoxElement.onclick = event => {
    if( event.target.tagName == "BUTTON" ) {
      if( callbackFunction ) callbackFunction(event.target.innerText);
      msgBoxElement.style.display = "none";
    }
  };
}


//
// Return "ok" after user clicks on "Ok"
//
// If x and/or y are negative, we will move the right and/or bottom of the dialog box to the x and/or y position
//
function DialogOk( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, msgText, Math.abs(x), Math.abs(y) );

  // Create "Ok" button
  createButton( msgBoxElement, "Ok" ).onclick = event => {
    if( callbackFunction ) callbackFunction("ok");
    msgBoxElement.style.display = "none";
  };

  if( x < 0 ) {
    x = Math.abs(x) - parseInt(msgBoxElement.clientWidth);
    if( x < 0 ) x = 0;
    msgBoxElement.style.left = x +"px";
  }
  if( y < 0 ) msgBoxElement.style.top = Math.abs(y) - parseInt(msgBoxElement.clientHeight)  +"px";

  constrainDialogPosition( msgBoxElement );
}


//
// menuStr is an array [menu1, menu2, ...] for example: ["Copy", "Paste"]
//
// Pass in an empty menu string (""), to have a mated Text Input field (clicking button returns text typed into Input field)
//
// Pass the selected menu string to the callbackFunction()
//
function DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null ) {
  let nextButton;
  let buttons = [];
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );

  let clickContainer = document.createElement( "div" );
  msgBoxElement.appendChild( clickContainer );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < menuStrs.length; ++nextButton ) {
    if( menuStrs[nextButton] ) {
      buttons[nextButton] = createButton( clickContainer, menuStrs[nextButton], true );
      buttons[nextButton].style.minWidth = "5rem";  // Match the custom button's minimum size
    }
    else {
      // If an empty string "" ,then create a "[CREATE/ADD]" Button with sibling edit box for user to enter text
      let customButtonContainer = document.createElement( "div" );

      // The Button
      buttons[nextButton] = createButton( customButtonContainer, "[CREATE]" ); // x,y of 0,0 moves it out of view in the <div>!!!
      buttons[nextButton].style.minWidth = "5rem";  // Keep custom button's size from changing a lot

      // The Input Text Edit box
      let editBox = document.createElement( "input" );
      editBox.setAttribute( "type", "text" );
      editBox.style.marginLeft = "4px";  // Style it
      editBox.style.boxShadow = "2px 2px 2px gray";
      editBox.placeholder = "New User Name";
      editBox.oninput = event => {
        let siblingButton = event.target.parentElement.firstChild;
        siblingButton.innerText = event.target.value;
      }
      customButtonContainer.appendChild( editBox );

      // Add it all to the dialog box
      clickContainer.appendChild( customButtonContainer );

      // Place the cursor in the edit box by default
      editBox.focus();
    }
  }

  constrainDialogPosition( msgBoxElement );

  // Handle button click by closing dialog box and returning the button's string
  clickContainer.onclick = event => {
    // If the unmodified "[CREATE]" button was clicked, then return nothing; Else return text of button clicked on
    let returnString = null;

    if( event.target.tagName == "BUTTON" ) {
      returnString = event.target.innerText;
      if( returnString == "[CREATE]" ) returnString = "";

      // A button was clicked (i.e. NOT the custom button input edit box), so we are out of here
      if( callbackFunction ) callbackFunction(returnString);
      msgBoxElement.style.display = "none";
    }
  };

  // Close dialog box on mouse click
  let closeButton = msgBoxElement.querySelector(".DlgClose button");
  closeButton.onclick = event => {
    // just return an empty string ""
    if( callbackFunction ) callbackFunction("");
    msgBoxElement.style.display = "none";
  };
}



//
// actions is an array of objects [{name:"someName", action:actionFunction}, {name:"AName", action:actionFunction}, ...]
//    for example: [{name:"Test One", action:()=>console.log("OK")}, {name:"Test Two", action:()=>console.log("Something")}]
//
// Creates a column of buttons, one for each action
// Creates a textarea text box at the bottom of the dialogBox
//
// Return's the textArea element, so caller can write and read text using textArea.value
//
function DialogActions( titleStr, actions, x, y ) {
  let nextButton;
  let buttons = [];
  let textArea;
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < actions.length; ++nextButton ) {
    buttons[nextButton] = createActionButton( msgBoxElement, actions[nextButton].name, actions[nextButton].action, msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  textArea = createTextArea( msgBoxElement );

  constrainDialogPosition( msgBoxElement );

  return textArea;
}



//
//  Adds an empty element to the DOM body or specified parent element, of type <type>
//
//  type is "dialog", "div", "button", etc...
//  id is the ID to use when looking for or creating the element
//
//  Also set id and classlist if specified
//
//  Returns the <> element
//
function addElement( type="div", {parent=null, id=null, classList=null} = {} ) {
  let element = document.createElement( type ); // i.e. "dialog", "div", "button", etc...

  if( parent ) parent.appendChild( element );         // Add element to the specified parent element
  else document.body.appendChild( element );          // Add element the <body>

  if( id ) element.id = id;
  if( classList ) element.classList.add( classList );

  return element;
}



// Support function
// Base code for creating text boxes for our dialog boxes
//
// Returns textArea (the <textarea> element), so calling function can make it go away, etc...
//
function createTextArea( parentElement, txt = "" ) {
  // Haven't previously created the <textarea>, so create it now and set it up
  textArea = document.createElement("textarea");

  // Position it
  textArea.style.position = "relative";

  // Style it
  textArea.style.margin = "2px";

  // Size it (# of text cols and rows)
  textArea.cols = 60;
  textArea.rows = 10;

  // insert textArea into page DOM, associated to our dialog box <div>
  parentElement.appendChild(textArea);

  // Set new text
  textArea.innerText = txt;

  return textArea;
}



// Support function
// Base code for creating buttons for our dialog boxes
//
// Returns button (the <button> element), so calling function can make it go away, etc...
//
function createButton( parentElement, txt, isMenu = false ) {
  let button = addElement( "button", {parent:parentElement} );

  button.innerText = txt;

  // Position it
  button.style.position = "relative";

  // Style it
  button.style.margin = "2px";
  button.style.cursor = "pointer";

  if( isMenu )  button.style.display = "block";

  return button;
}



// Support function
// Base code for creating buttons for our dialog boxes
//
// Returns button (the <button> element), so calling function can make it go away, etc...
// Associate the button with an action (a function passed in by the caller)
//
function createActionButton( parentElement, txt, action, isMenu = false ) {
  // Haven't previously created the <button>, so create it now and set it up
  let button = addElement( "button", {parent:parentElement} );

  button.innerText = txt;

  // Position it
  button.style.position = "relative";

  // Style it
  button.style.margin = "2px";
  button.style.backgroundColor = "orange";
  button.style.cursor = "pointer";

  if( isMenu )  button.style.display = "block";

  button.onclick = event => {
    action(); // Call the users action code
  };

  return button;
}


function constrainDialogPosition( dialogElement ) {
  let x = dialogElement.offsetLeft;
  let y = dialogElement.offsetTop;
  let w = dialogElement.clientWidth;
  let h = dialogElement.clientHeight;
  let padding = 10;  // A little padding to push it just a tad away from edge

  // Constrain Dialog location so it fits within window boundry
  if( x + w + padding > window.innerWidth ) {
    dialogElement.style.left = ( (window.innerWidth - w - padding) > 0 ? (window.innerWidth - w - padding) : 0 ) + "px";
  }
  if( y + h + padding > window.innerHeight ) {
    dialogElement.style.top = ( (window.innerHeight - h - padding) > 0 ? (window.innerHeight - h - padding) : 0 ) + "px";
  }
}


//
// Support function
// Base code for creating the main part of our dialog boxes
//
// Returns msgBox (the <div> element), so other functions can put buttons on it, etc...
//
// Location defaults to 10px from left and 1/3 down from top (i.e. if x and y are null)
//
function createDialogBox( titleStr, msgText, x = 10, y = window.innerHeight / 3 ) {
  let msgBox = addElement( "div", {classList:"Dialog"} );

  // Position it
  msgBox.style.position = "absolute";

  // Style the <div> into a box
  msgBox.style.border = "2px solid gray";
  msgBox.style.boxShadow = "3px 3px 2px #777777";
  msgBox.style.padding = "10px 10px 10px 4px"; // -bottom is 4px; So ::after content stays close to bottom
  msgBox.style.backgroundColor = "#ffffff"+"dd";  // Include some transparency
  msgBox.style.borderRadius = "8px";
  msgBox.style.color = "darkgray";

  // Hide dialog by pressing ESC
  // NOTE: Must call event.preventDefault() from the mouse event handler that got us here (if any), so we don't lose focus
  msgBox.tabIndex = 0; // Set .tabIndex so that .focus() works
  msgBox.focus();
  msgBox.onkeydown = event => {
    if( event.key == "Escape" ) msgBox.style.display = "none";
  };

  // Set new position
  msgBox.style.left = x +"px";
  msgBox.style.top = y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = `<span class="DlgClose"></span> <span class="DlgTitle">${titleStr.toUpperCase()}</span> <hr> ${msgText} <br>`;

  // Create "Close" button (i.e. Hide dialog by clicking on button)
  let containerElement = msgBox.querySelector(".DlgClose");
  let closeButtonElement = createButton( containerElement, "Close" );
  closeButtonElement.onclick = event => {
    msgBox.style.display = "none";
  };

  return msgBox;
}



//
// Support function
// Base code for creating the main part of our dialog boxes
//
// Returns msgBox (the <div> element), so other functions can put buttons on it, etc...
//
// <esc> will close it
//
// Location defaults to centered horizontally and/or vertically in parent, if x and/or y are null
//
function createDialogBox2( titleStr, msgText, x = null, y = null ) {
  let msgBox = addElement("dialog", {classList:DlgDialogBox});  // Include a class so .css can style it

  // Set new position, either with specified x,y or centered in parent
  if( options.x == null ) {
    dlgBox.style.left = "50%";  // Move corner of dialog to center of screen
    dlgBox.style.transform += "translateX(-50%)"; // Move X by half the dialog size
  }
  else dlgBox.style.left = options.x +"px";
  if( options.y == null ) {
      dlgBox.style.top = "50%";  // Move corner of dialog to center of screen
      dlgBox.style.transform += "translateY(-50%)"; // Move Y by half the dialog size
  }
  else dlgBox.style.top = options.y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = `
    <div class="DlgHeader">
      <span class="DlgTitle"> ${titleStr.toUpperCase()}</span>
      <button class="DlgCloseButton" onclick="closeDialogBox2(event)">&times</button>
      <hr>
    </div>
    <span> ${msgText} </span><br>
    <div class="DlgContent"> </div>
  `;

  msgBox.show( );  // Display the dialog box

  return msgBox;
}

//
// ONLY for closing <dialog> based dialog boxes
//
function closeDialogBox2(event) {
   event.target.parentElement.parentElement.close();
}


//
// Create a slider (<input type="range">)
//
// Returns the element, so calling function can make it go away, etc...
//
// Location (upper left corner) defaults (if x and y are null) to 33% of window size
//
function createSlider( label, min, max, x = window.innerWidth / 3, y = window.innerHeight / 3, callback = null ) {
  let element = addElement( "input" );
  let labelElement = addElement( "label" );

  // Position it
  element.style.position = "absolute";
  // element.style.position = "relative";
  labelElement.style.position = "absolute";

  // Set the text for the label
  labelElement.innerText = label;

  // Set new position
  element.style.left = x +"px";
  element.style.top = y +"px";
  labelElement.style.left = x +"px";
  labelElement.style.top = y-20 +"px";


  // Set html for the control type and label
  element.type = "range";
  element.name = label;
  labelElement.htmlFor = label; // In html we use for="labelText", in js we need to use .htmlFor="labelText"
  element.min = min;
  element.max = max;

  if( callback ) element.addEventListener('input', event => callback(event.target.value));

  return element;
}




//
// current is the index of the current history location
//
// history is an array of objects [title, menu1, menu2, ...] for example: ["Title txt", "Copy", "Paste"]
// [{layer:layer#,location:{col:col#,row:row#},prevData:{col:col#,row:row#},newData:{col:col#,row:row#}}, ...]
//
// Pass the selected menu string to the callbackFunction()
//
function DialogHistory1( titleStr, current, history, x, y, callbackFunction = null ) {
  let nextLine;
  let numStates = history.length;
  // Build the main part of the dialog box
  let msgBoxElement = createDialogBox( titleStr, "", x, y );
  // Get current html of the dialog we just created
  let htmlStr = msgBoxElement.innerHTML;

  // Append a style string onto the current dialog html
  htmlStr += "<style>span.DialogSpan{display:inline-block; width:60px;margin:6px;border:solid 2px red;}</style>";


  // Create a line/row of 3 columns for each item in history

  for( nextLine = 0; nextLine < numStates; ++nextLine ) {
    // Column 0
    htmlStr += `<span class="DialogSpan">${nextLine}</span>`;

    // Column 1
    if( nextLine == current ) htmlStr += `<span>${current} -></span>`;
    else htmlStr += `<span class="DialogSpan">____</span>`;

    // Column 2 and 3
    htmlStr += `<span class="DialogSpan">${history[nextLine].location.col}, ${history[nextLine].location.row}</span><span class="DialogSpan">Prev: ${history[nextLine].prevData.col}, ${history[nextLine].prevData.row}</span>`;

    htmlStr  += "<br>";


//    buttons[nextButton] = createButton( msgBoxElement, columns[nextButton], true );
  }

  msgBoxElement.innerHTML = htmlStr;

  constrainDialogPosition( msgBoxElement );

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target.innerText);
    msgBoxElement.style.display = "none";
  };
}


//
// If the css color variables that the DialogBox css stylesheet uses, are not defined, then define them
//
function cssColorDefaults( ) {
  let allStyles = getComputedStyle( document.documentElement ); // Neccessary for values from .css file
  let dark = allStyles.getPropertyValue( '--DarkestColor' );
  let normal = allStyles.getPropertyValue( '--NormalColor' );
  let light = allStyles.getPropertyValue( '--LightColor' );
  let harley = allStyles.getPropertyValue( '--HarleyOrange' );


  if( !dark )  document.documentElement.style.setProperty( '--DarkestColor', "black" );
  if( !normal )  document.documentElement.style.setProperty( '--NormalColor', "gray" );
  if( !light )  document.documentElement.style.setProperty( '--LightColor', "white" ); // "beige" );
  if( !harley )  document.documentElement.style.setProperty( '--HarleyOrange', "orange" );
}


function setDialogboxStyelsheet( ) {
  cssColorDefaults( );

  cssStylesheet( "DialogBox", `
    /*
     * DIALOG BOX CLASSES
     */
     /*
      *   Add class of DlgInput to anything you want clickable and to allow it to return a value
      *
      *      class DlgDialogBox
      *  --------------------------
      *  |  TITLE   ......... O X |  Class DlgTitle {grid, grid-template-columns: max-content 1fr}
      *  |------------------------|
      *  | TBL TBL        TBR TBR |  Class DlgButtons {grid, grid-template-columns: 1fr max-content}, DlgButtonsLeft, DlgButtonsRight
      *  |------------------------|
      *  |   HEADER HD HD .....   |  Class DlgHeader {grid, repeat( auto-fit, minmax( 5rem, 1fr) )}
      *  |------------------------|
      *  |                        |  Class DlgBody
      *  |   BODY BD BD ...       |          Class DlgLine {grid, repeat( auto-fit, minmax( 5rem, 1fr) )}
      *  |   BODY BD BD ...       |
      *  |                        |
      *  |------------------------|
      *  | BBL BBL         BR BBR |  Class DlgButtons {grid, grid-template-columns: 1fr max-content}, DlgButtonsLeft, DlgButtonsRight
      *  |------------------------|
      */
    .DlgDialogBox {
      position: absolute; /* <dialog> doesn't need this for some reason, but if we use a <div> for the DialogBox base element, then we do  */
      padding: 4px;
      border: solid 1px black;
      border-radius: 8px;
      background-image: linear-gradient(var(--NormalColor),var(--LightColor),var(--NormalColor));
    }
    .DlgDialogBox:hover {
      border: solid 1px rgba(100, 100, 0, 0.9);
      z-index: 10;
    }

    .DlgTitle {
      box-shadow: 3px 3px 5px var(--DarkestColor);
      margin-bottom: 4px;
      padding-left: 0.25rem;
      width: 100%;

      display: grid;
      /*                      title       [fullscreen box       eXit] */
      grid-template-columns:   1fr    max-content;
    }
    .DlgTitle h2 {
      margin-right: 2rem;
    }
    .DlgTitle button, .DlgTitle .DlgButton {
      min-width: 1.6rem;
    }

    .DlgMenus, .DlgButtons {
      background-color: var(--NormalColor);
      border-bottom: solid 2px var(--DarkestColor);
      border-radius: 4px;

      display: grid;
      grid-template-columns: 1fr max-content;
    }

    .DlgMenu {
      display: inline; /* Incase someone uses a <div> as appose to a <span> */
      margin-left: 10px;
      padding: 0px 2px;

      border-radius: 2px;
      box-shadow: 1px 2px 4px black;

      cursor: pointer;
    }
    .DlgMenu:hover {
      /* Don't use "border", it changes the size of the element */
      outline: solid 1px var(--LightColor);
    }
    .DlgMenu:active {
      /* Don't use "border", it changes the size of the element */
      outline: ridge 4px var(--LightColor);
    }

    .DlgHeader {
      border-bottom: solid 1px var(--HarleyOrange);

      display: grid;
      grid-template-columns: repeat( auto-fit, minmax( 5rem, 1fr) );
    }

    .DlgBody {
      border: solid 1px var(--DarkestColor);
      border-radius: 4px;
      box-shadow: inset -2px -2px 3px var(--DarkestColor);

      max-width: 100%;  /* Don't let huge content let it get bigger than the dialog box */
      min-height: 4rem;

      margin: 0.3rem 0rem;
      padding: 0.25rem;
    }
    .DlgBody img {
      max-width: 100%; /* Don't let huge images go to full size */
    }

    .DlgInput {
      cursor: pointer;
    }
  ` );
}







//
