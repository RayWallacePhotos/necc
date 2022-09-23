//
//        DialogBox.js
//
//        Dialog and Message Box Classes and functions
//
//  Written while writing The Hike Game
//
//  RWWJ  1 Jan 2022  Created
//  RWWJ 30 Aug 2022  Moved mouseDown to close dialog into createDialogBox()
//                    Added handling for ESC/escape key to close dialog
//
//  NEEDS/REQURIES/USES:
//    Mostly Standalone (so far)
//

//
//   MEMBER FUNCTIONS
//
// DialogInventory( viewPort, board, playerInventory )
// createCanvas( parentElement, title, x, y, w, h )
// DialogYesNo( titleStr, msgText, x, y, callbackFunction = null )
// DialogOk( titleStr, msgText, x, y, callbackFunction = null )
// DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null )
// DialogActions( titleStr, actions, x, y )
// createTextArea( parentElement )
// createButton( parentElement, txt, x = 0, y = 0, isMenu = false )
// createActionButton( parentElement, txt, action, isMenu = false )
// createDialogBox( titleStr, msgText, x = null, y = null )
// createSlider( label, min, max, x = null, y = null, callback = null )
// DialogHistory1( titleStr, current, history, x, y, callbackFunction = null )




//
// Not sure if we need to pass in viewPort OR the .board
//
function DialogInventory( viewPort, board, playerInventory ) {
  var dialogBox;
  var dialogBoxX = null;  // Will get centered horizontally
  var dialogBoxY = 100;
  var contentElement;
  var canvas;
  var canvasSize = viewPort.cellSize; // Realy no relationship to cellSize, but it is a good size for these :-)
  var item;
  // Only gets the (top level) key names, not the the individual objects
  var inventoryArray = Object.keys(playerInventory);

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
    var srcX = board.layers[layer].imageObj.spriteXY(col,row).x;
    var srcY = board.layers[layer].imageObj.spriteXY(col,row).y;
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

}


//
// Support function
// Base code for creating canvas' for our dialog boxes
//
// Returns canvas context (NOT the <canvas> element)
//
function createCanvas( parentElement, title, w, h ) {
  // Make it so we have different ID's for each canvas that gets added to a dialogBox, but reuse them subsequent incarnations
  var canvasID = "__"+title+"CanvasID";
  // Attempt to get the <div> that we may have previously created
  var element = document.getElementById( canvasID );

  // Create this <canvas> if we haven't previously
  if( !element ) {
    element = document.createElement("canvas");
    element.id = canvasID;

    // Position it
    element.style.marginBottom = "30px";
  }

  // Create container for Title and Canvas, so they go in one grid area
  var area = document.createElement("div");
  parentElement.appendChild(area);

  // Create a title
  var titEl = document.createElement("div");
  area.appendChild(titEl);
  titEl.innerText = title;

  // insert canvas into page DOM, associated to our dialog box <div>
  area.appendChild(element);

  // Set size. NOTE: Both element.style and canvas must be same size or we will get scaling
  element.width = w;
  element.style.width = w+"px";
  element.height = h;
  element.style.height = h+"px";

  return element.getContext("2d");
}



//
// Return "yes" or "no" for user clicking the "yes" or "no" button respectively
//
function DialogYesNo( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  var msgBoxElement = createDialogBox( titleStr, msgText, x, y );

  // Create "yes" and "no" buttons
  var buttonTwo = createButton( msgBoxElement, "no", msgBoxElement.style.left, msgBoxElement.style.top );
  var buttonOne = createButton( msgBoxElement, "yes", msgBoxElement.style.left, msgBoxElement.style.top );

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target==buttonOne ? "yes" : "no");
    msgBoxElement.style.display = "none";
  };
}


//
// Return "ok" after user clicks on "Ok"
//
// If x and/or y are negative, we will move the right and/or bottom of the dialog box to the x and/or y position
//
function DialogOk( titleStr, msgText, x, y, callbackFunction = null ) {
  // Build the main part of the dialog box
  var msgBoxElement = createDialogBox( titleStr, msgText, Math.abs(x), Math.abs(y) );

  // Create "Ok" button
  createButton( msgBoxElement, "Ok", msgBoxElement.style.left, msgBoxElement.style.top );

  if( x < 0 ) {
    x = Math.abs(x) - parseInt(msgBoxElement.clientWidth);
    if( x < 0 ) x = 0;
    msgBoxElement.style.left = x +"px";
  }
  if( y < 0 ) msgBoxElement.style.top = Math.abs(y) - parseInt(msgBoxElement.clientHeight)  +"px";

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction("ok");
    msgBoxElement.style.display = "none";
  };
}


//
// menuStr is an array [title, menu1, menu2, ...] for example: ["Title txt", "Copy", "Paste"]
//
// Pass the selected menu string to the callbackFunction()
//
function DialogMenu( titleStr, menuStrs, x, y, callbackFunction = null ) {
  var nextButton;
  var buttons = [];
  // Build the main part of the dialog box
  var msgBoxElement = createDialogBox( titleStr, "", x, y );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < menuStrs.length; ++nextButton ) {
    buttons[nextButton] = createButton( msgBoxElement, menuStrs[nextButton], msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  // Close dialog box on mouse click
  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target.innerText);
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
  var nextButton;
  var buttons = [];
  var textArea;
  // Build the main part of the dialog box
  var msgBoxElement = createDialogBox( titleStr, "", x, y );

  // Create a button for each menu item.
  for( nextButton = 0; nextButton < actions.length; ++nextButton ) {
    buttons[nextButton] = createActionButton( msgBoxElement, actions[nextButton].name, actions[nextButton].action, msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  textArea = createTextArea( msgBoxElement );

  return textArea;
}



// Support function
// Base code for creating text boxes for our dialog boxes
//
// Returns textArea (the <textarea> element), so calling function can make it go away, etc...
//
function createTextArea( parentElement ) {
  var textAreaID = "__TextAreaID";
  // Attempt to get the <div> that we may have previously created
  var textArea = document.getElementById( textAreaID );

  if( textArea ) {
      // We have previously created/used this, so just make <textarea> visible again
      textArea.style.display = "inline-block";
  }
  else {
    // Haven't previously created the <textarea>, so create it now and set it up
    textArea = document.createElement("textarea");

    textArea.id = textAreaID;

    // Position it
    textArea.style.position = "relative";

    // Style it
    textArea.style.margin = "2px";

    // Size it (# of text cols and rows)
    textArea.cols = 60;
    textArea.rows = 10;

    // insert textArea into page DOM, associated to our dialog box <div>
    parentElement.appendChild(textArea);
  }

  // Set new text
  textArea.innerText = "This is a TEST of the emergency dialog system :-)";

  textArea.onclick = event => {
    event.stopPropagation(); // Don't let the click get up to the dialogBox, which would use it to close the dialogBox
  };

  return textArea;
}



// Support function
// Base code for creating buttons for our dialog boxes
//
// Returns button (the <button> element), so calling function can make it go away, etc...
//
// Location (upper left corner) defaults (if x and y are 0) to 33% of dialog <div> size
function createButton( parentElement, txt, x = 0, y = 0, isMenu = false ) {
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  var buttonID = "__"+txt+"ButtonID";
  // Attempt to get the <div> that we may have previously created
  var button = document.getElementById( buttonID );
  if( !x ) x = window.innerWidth / 3;
  if( !y ) y = window.innerHeight / 3;

  if( button ) {
      // We have previously created/used this, so just make <button> visible again
      button.style.display = "inline";
  }
  else {
    // Haven't previously created the <button>, so create it now and set it up
    button = document.createElement("button");

    button.id = buttonID;

    // Position it
    // button.style.position = "absolute";
    button.style.position = "relative";

    // Style it
    button.style.margin = "2px";
    button.style.cursor = "pointer";

    // insert button into page DOM, associated to our dialog box <div>
    parentElement.appendChild(button);
  }

  // Set new position
  button.style.left = x +"px";
  button.style.top = y +"px";

  // Set new text
  button.innerText = txt;

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
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  var buttonID = "__"+txt+"ButtonID";
  // Attempt to get the <div> that we may have previously created
  var button = document.getElementById( buttonID );

  if( button ) {
      // We have previously created/used this, so just make <button> visible again
      button.style.display = "inline";
  }
  else {
    // Haven't previously created the <button>, so create it now and set it up
    button = document.createElement("button");

    button.id = buttonID;

    // Position it
    button.style.position = "relative";

    // Style it
    button.style.margin = "2px";
    button.style.backgroundColor = "orange";
    button.style.cursor = "pointer";

    // insert button into page DOM, associated to our dialog box <div>
    parentElement.appendChild(button);
  }

  // Set new text
  button.innerText = txt;

  if( isMenu )  button.style.display = "block";

  button.onclick = event => {
    event.stopPropagation(); // Don't let the click get up to the dialogBox, which would use it to close the dialogBox

    action(); // Call the users action code
  };

  return button;
}



//
// Support function
// Base code for creating the main part of our dialog boxes
//
// Returns msgBox (the <div> element), so other functions can put buttons on it, etc...
//
// Location (upper left corner) defaults (if x and y are null) to 33% of window size
//
function createDialogBox( titleStr, msgText, x = null, y = null ) {
  var dlgID = titleStr+"__DlgID";
  // Attempt to get the <div> that we may have previously created
  var msgBox = document.getElementById( dlgID );
  if( x == null ) x = window.innerWidth / 3;
  if( y == null ) y = window.innerHeight / 3;

  if( msgBox ) {
    // We have previously created/used this, so just make <div> visible again
    msgBox.style.display = "block";

    // Clear old HTML (i.e. buttons)
    msgBox.innerHTML = "";
  }
  else {
    // Haven't previously created the <div>, so create it now and set it up
    msgBox = document.createElement("div");

    msgBox.id = dlgID;

    // Position it
    msgBox.style.position = "absolute";

    // Style the <div> into a box
    msgBox.style.border = "2px solid gray";
    msgBox.style.boxShadow = "3px 3px 2px #777777";
    msgBox.style.padding = "10px 10px 10px 4px"; // -bottom is 4px; So ::after content stays close to bottom
    msgBox.style.backgroundColor = "#ffffff"+"dd";  // Include some transparency
    msgBox.style.borderRadius = "8px";
    msgBox.style.color = "#darkgray";

    // insert msgBox into page DOM
    document.body.appendChild(msgBox);

    // Hide dialog by clicking on it
    // The createActionButton() stopsPropatation, so this event only gets fired if user clicks on background of dialogBox
    // NOTE: Some dialog box wrappers to this funciton, will overright the .onclick. Nothing wrong with that.
    msgBox.onclick = event => {
      msgBox.style.display = "none";
    };

    // Hide dialog by pressing ESC
    // NOTE: Must call event.preventDefault() from the mouse event handler that got us here (if any), so we don't lose focus
    msgBox.contentEditable = true; // OR set .tabIndex = 0 so that .focus() works
    msgBox.focus();
    msgBox.onkeydown = event => {
      if( event.key == "Escape" ) msgBox.style.display = "none";
    };
  }

  // Set new position
  msgBox.style.left = x +"px";
  msgBox.style.top = y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = '<span class="DlgTitle">' + titleStr.toUpperCase() + '</span>'+ "<hr>" + msgText + "<br>";

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
  var dlgID = titleStr+"__DlgID";
  // Attempt to get the <div> that we may have previously created
  var msgBox = document.getElementById( dlgID );

  // Create a <dialog> if a previous call hasn't already (i.e. reuse old dialog box)
  if( !msgBox ) {
    msgBox = document.createElement("dialog");
    msgBox.id = dlgID;

    msgBox.classList.add( "DlgDialogBox" );     // Add a class so .css will style it

    document.body.appendChild(msgBox);          // insert msgBox into page DOM
  }

  // Set new position, either with specified x,y or centered in parent
  if( x == null ) {
    msgBox.style.left = "50%";  // Move corner of dialog to center of screen
    msgBox.style.transform = "translateX(-50%)"; // Move by half the dialog size
  }
  else msgBox.style.left = x +"px";
  if( y == null ) {
    msgBox.style.top = "50%";  // Move corner of dialog to center of screen
    msgBox.style.transform = "translateY(-50%)"; // Move by half the dialog size
  }
  else msgBox.style.top = y +"px";

  // Set new text. Uppercase the titleStr
  msgBox.innerHTML = '<div class="DlgHeader">' +
    '<span class="DlgTitle">' + titleStr.toUpperCase() + '</span>' +
    // Create a close [X] button
     '<button class="DlgCloseButton" onclick="closeDialogBox2(event)">&times</button>' +
     '<hr></div>' +
     '<span>' + msgText + '</span><br>' +
     '<div class="DlgContent">' + '</div>';

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
function createSlider( label, min, max, x = null, y = null, callback = null ) {
  // Make it so we have different ID's for "yes", "no", "ok", "cancel", etc... buttons
  var elementID = "__"+label+"ElementID";
  var labelElementID = "label"+elementID;
  // Attempt to get the element that we may have previously created
  var element = document.getElementById( elementID );
  var labelElement = document.getElementById( labelElementID );

  if( x==null ) x = window.innerWidth / 3;
  if( y==null ) y = window.innerHeight / 3;

  if( element ) {
      // We have previously created/used this, so just make control visible again
      element.style.display = "inline";
      labelElement.style.display = "inline";
  }
  else {
    // Haven't previously created the control, so create it now and set it up
    element = document.createElement("input");
    labelElement = document.createElement("label");

    element.id = elementID;
    labelElement.id = labelElementID;

    // Position it
    element.style.position = "absolute";
    // element.style.position = "relative";
    labelElement.style.position = "absolute";

    // Set the text for the label
    labelElement.innerText = label;

    // insert element into page DOM, associated to our dialog box <div>
    document.body.appendChild(element);
    document.body.appendChild(labelElement);
  }

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
  var nextLine;
  var numStates = history.length;
  // Build the main part of the dialog box
  var msgBoxElement = createDialogBox( titleStr, "", x, y );
  // Get current html of the dialog we just created
  var htmlStr = msgBoxElement.innerHTML;

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


//    buttons[nextButton] = createButton( msgBoxElement, columns[nextButton], msgBoxElement.style.left, msgBoxElement.style.top, true );
  }

  msgBoxElement.innerHTML = htmlStr;

  msgBoxElement.onclick = event => {
    if( callbackFunction ) callbackFunction(event.target.innerText);
    msgBoxElement.style.display = "none";
  };
}




//
