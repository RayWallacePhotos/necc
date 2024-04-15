//
//        Files.js
//
//        File Handling Class and functions
//        Images, Json, Text, etc...
//
//  Written for use with reading/writing Images (Sprite Sheets), and Level Maps (Json), Text
//
//  Includes waiting for all files to finish loading
//
//  RWWJ 29 Dec 2021  Created Originaly for The Hike game
//  RWWJ 10 Mar 2022  Edited for more generic use and adding file lists of files functionality
//  RWWJ  9 Aug 2022  Added error handling to fileReadJson() so bad .json files don't fail silently
//  RWWJ 21 Aug 2022  Changed LocalStorage functions, to use LocalStoragePrefix global string variable IF it is defined
//  RWWJ 29 Aug 2022  Fixed fileReplaceExt() to handle filenames with NO extension
//  RWWJ 30 Aug 2022  Added clearLocalStorage()
//  RWWJ 13 Oct 2022  ReWrote fileSaveCanvas(  ) to use canvas.toDataURL() instead of canvas.toBlob() and URL.createObjectURL()
//  29 Nov 2022  Moved testFileFunctions() into file_tests.js
//               v1.9
//               Added comment
//               v1.9a
//  11 Dec 2022  Renamed LocalStorage functions and changed parameter order for toLocalStorage() nee jsonToLocalStorage()
//               v1.10
//  12 Jan 2023  Added listLocalStorage()
//               v1.11
//  21 Jan 2023  Added fileGetImageData( ), fileSaveBinary()
//               Added element to fileGetImageData()
//               v1.12
//   2 Feb 2023  Added  fileGetFileObj()
//               v1.13
//   9 Mar 2023  Added filename to error message in fileReadJson()
//               v1.14
//               Changed case of ImageID to imageId in createImgElement()
//               v1.15
//  23 Sep 2023  Added fileExists( fileName, callback )
//               v1.16
//  10 Nov 2023  Added a few comments
//               Changed fileReplaceExt() slightly to be the same as changeExtension() in helpers.js
//               v1.17
//



var FilesJsVersion = "1.17";


//
//  NEEDS/REQURIES/USES:
//    Creates FileWaitingOnFiles global variable for keep tracking of pending file operations
//

// let LocalStoragePrefix = ""; // If app does not define, then we default to "RWWJ_"


// Import all with this statement (NOTE: change the directory as appropriate)
//import {fileReplaceExt, fileFileOfImageTextFiles, loadNextImage, fileFileOfTextFiles, fileReadText, fileReadTextPrompt, fileSaveBinary, fileSaveText, fileSaveLargeText,
//        fileSaveJson, fileSaveCanvas, fileSaveLargeCanvas, fileExists, fileReadJson, fileReadJsonPrompt, fileNamePrompt, fileLoadImage, fileGetImageData, fileGetFileObj,
//        removeLocalStorage, deleteLocalStorage, fromLocalStorage, toLocalStorage, clearLocalStorage, listLocalStorage }
//        from "../Javascript-Libraries/Files-Module.js";


// export {fileReplaceExt, fileFileOfImageTextFiles, loadNextImage, fileFileOfTextFiles, fileReadText, fileReadTextPrompt, fileSaveBinary, fileSaveText, fileSaveLargeText,
//         fileSaveJson, fileSaveCanvas, fileSaveLargeCanvas, fileExists, fileReadJson, fileReadJsonPrompt, fileNamePrompt, fileLoadImage, fileGetImageData, fileGetFileObj,
//         removeLocalStorage, deleteLocalStorage, fromLocalStorage, toLocalStorage, clearLocalStorage, listLocalStorage };



//
//   Properties
//
// LocalStoragePrefix                              // If defined, it is used as a prefix for toLocalStorage() and fromLocalStorage()

//
//   Methods
//
// fileReplaceExt( fileName, newExt )
// fileFileOfImageTextFiles( fileName, callback )
// loadNextImage( next, max, fileList, callback )
// fileFileOfTextFiles( fileName, callback )
// fileReadText( fileName, callback )
// fileReadTextPrompt( callback )
// fileSaveBinary( defaultFileName, data )
// fileSaveText( defaultFileName, text )
// fileSaveLargeText( defaultFileName, text )
//
// fileSaveJson( defaultFileName, jsonObj )
// fileSaveCanvas( defaultFileName, canvas )
// fileSaveLargeCanvas( defaultFileName, canvas )
// createImgElement( idSubtring )
// fileExists( fileName, callback )
// fileReadJson( fileName, callback )
// fileReadJsonPrompt( callback=null )
// fileNamePrompt( extensions=".json", callback=null )
// fileLoadImage( fileName, callback=null )
// fileLoadImageCore( fileName, callback )
// fileGetImageData( callback=null )
// fileGetFileObj( mimeType = "*.*", callback=null )  --- returns {fileName, file, src}
//
// removeLocalStorage( variableName )
// deleteLocalStorage( variableName )
// fromLocalStorage( name )                        // Uses LocalStoragePrefix if defined, else prefixes with RWWJ
// toLocalStorage( name, value )                   // Uses LocalStoragePrefix if defined, else prefixes with RWWJ
// --- jsonFromLocalStorage( variableName )        // Deprecated, use fromLocalStorage()
// --- jsonToLocalStorage(variable, variableName ) // Deprecated, use toLocalStorage()
// clearLocalStorage( name )
// listLocalStorage( )


let FileWaitingOnFiles = 0;




//
// Replaces (or appends) extension of fileName with newExt
//   Where newExt has an optional leading . (e.g. ".json" or "json" )
//
// NOTE: Same as changeExtension() and changeExt() in helpsers.js, but lets us be self contained
//
function fileReplaceExt( fileName, newExt ) {
  let extStart = fileName.lastIndexOf( "." );

  if( newExt[0] != "." ) newExt = `.${newExt}`;

  if( extStart != -1 ) return fileName.slice( 0, extStart ) + newExt;
  else                 return fileName + newExt;
}



//
// Specified fileName contains a list of fileNames of matching image and text files
//
// Return an object to the callback, with the image and text, {image:imageElement, text:text}
//
// NOTE: If either file could not be read, it's respective value (image or text) will be null
//
function fileFileOfImageTextFiles( fileName, callback ) {
  let next;
  let fileNames = [];
  let nextFile;

  fileReadText( fileName, (textObj) => {
    // Make sure the file was successfully loaded
    if( textObj.text ) {
      fileNames = textObj.text.trim().split("\n");

      // Setup for some recursion, so we process the list in list order, not an asynchronous order
      loadNextImage( 0, fileNames, callback );
    }
    else callback( {image:null, text:null} ); // Indicate we didn't/couldn't read anything
  } );
}

//
// Helper function for fileFileOfImageTextFiles()
//
function loadNextImage( next, fileList, callback ) {
  if( next < fileList.length ) {
    // First load the image from the filelist
    fileLoadImage( fileList[next], imageObj => {
      // imageObj might be null if image file could not be loaded (not found etc...)
      if( imageObj ) {
        // Then replace the .ext and read the text file with the same name as the image file
        fileReadText( imageObj.fileName.slice(0,imageObj.fileName.lastIndexOf('.'))+".txt", (textObj) => {
          // Finally, return both the imageElement and the text (if there was a text file)
          callback( {image:imageObj.element, text: (textObj ? textObj.text : null)} );

          // Recursion until we're done
          loadNextImage( ++next, fileList, callback );
        } );
      }
      else {
        callback( {image:null, text:null} ); // Indicate we didn't/couldn't read anything

        // Recursion until we're done
        loadNextImage( ++next, fileList, callback );
      }
    } );
  }
}



//
// Return an object with fileName and content (text) to the callback,
// i.e. {fileName:"",text:""}
//
// NOTE: If either file could not be read, their respective value will be null
//
function fileFileOfTextFiles( fileName, callback ) {
  let next;
  let fileNames = [];

  fileReadText( fileName, (textObj) => {
    // Make sure the file was successfully loaded
    if( textObj.text ) {
      fileNames = textObj.text.trim().split("\n");

      loadNextFile( 0, fileNames, callback );
    }
    else callback({fileName:null,text:null}); // Indicate we didn't/couldn't read anything
  } );
}

//
// Helper function for fileFileOfTextFiles()
//
function loadNextFile( next, fileList, callback ) {
  if( next < fileList.length ) {
    fileReadText( fileList[next], (textObj) => {
      callback( textObj );

      // Recursion until we're done
      loadNextFile( ++next, fileList, callback );
    } );
  }
}



//
// An object with fileName (or url) and text of file (url), is passed to the callback,
// i.e. callback({fileName:"",text:""})
//    Where text is null if could not read file
// NOTE: \r\n are replaced with \n, so caller has consistant EOL's
//
// Takes either a url OR a fileName
//
function fileReadText( fileName, callback ) {
  let returnText = null;
  // Deal with some funky characters (smart quotes etc..) cut/pasted from MS Word docs
  let decoder = new TextDecoder("iso-8859-1");

  // If we need to get a fileName from user, then use a totally different function to prompt and read json
  if( !fileName )  fileReadTextPrompt( callback );
  else {
    ++FileWaitingOnFiles; // File operation about to be pending

    fetch( fileName, {headers:{Accept:"text/plain"}} )
    .then( response => {
      let textStream = null;

//      if(response.ok) textStream = response.text(); // .status is in the range 200-299
      // Deal with some funky characters (smart quotes etc..) cut/pasted from MS Word docs
      if(response.ok) textStream = response.arrayBuffer(); // .status is in the range 200-299
      else if(response.status==404)  console.log("WARNING: <"+fileName+"> not found. " + response.statusText);
      else  console.log("ERROR: Could not open file or url: <"+fileName+">" + response.statusText);

      return textStream;
    } )
    .then( text => {
      // decoder.decode(text) to Deal with some funky characters (smart quotes etc..) cut/pasted from MS Word docs
      // Standardize EOL (\n vs \r\n). And remove blank lines at file extremities
//      if( text ) text = text.replace(/\r\n/g,"\n").trim();
      if( text ) text = decoder.decode(text).replace(/\r\n/g,"\n").trim();

      returnText = text;
    } )
    .finally( () => {
      --FileWaitingOnFiles; // File operation no longer pending

      callback( {fileName:fileName,text:returnText} );  // Return the results
    } );
  }
}



//
// Shows a file dialog for user to select text file
// Reads the selected file
//
// Calls the specified callback, passing back an object with filename and text ({fileName:"",text:""})
//
// NOTE NOTE Use fileReadText("",) to get here!!!
//
function fileReadTextPrompt( callback=null ) {
  let inputFileElement = document.createElement( 'input' );
  let fileName = "";

  inputFileElement.type = 'file';
  inputFileElement.accept = ".txt, .json, text/*, text/html";

  // Wait for onchange (i.e. User selected a file)
  inputFileElement.onchange = (event) => {
    // NOTE Chrome seems to reuse it's event object, so we need to store .files[0].name for use inside fileReader.onload()
    fileName = event.target.files[0].name;

    event.target.files[0].text( )  // Get a promise for the text
    .then( text => {
      if( callback )  callback( {fileName:fileName,text:text.replace(/\r\n/g,"\n").trim()} );
    });
  };

  inputFileElement.click();  // Initiate the File dialog box
}



//
// Shows a file dialog for user to select binary (image, etc...) file name and folder
// Writes binary data to the selected file
//
// NO indication of failure, success, done writing or canceling by user
//
function fileSaveBinary( defaultFileName, data ) {
  let fileURL;
  let aElement = document.createElement( "a" );  // Create a <a> tag (hyperlink)

  aElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate

  fileURL = URL.createObjectURL( new Blob([data]) );

  aElement.href = fileURL;

  aElement.click( );  // Trigger the save dialog

  URL.revokeObjectURL( fileURL );
}



//
// Shows a file dialog for user to select text file name and folder
// Writes text to the selected file
//
// NO indication of failure, success, done writing or canceling by user
//
function fileSaveText( defaultFileName, text ) {
  // Create a <a> tag (hyperlink), with a dataURL, then "click() on it"
  let aElement = document.createElement( "a" );

  aElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate

  // Create a dataURL out of our string, and set it as the hyperlink address
  // Force Windows EOL (\r\n vs \r)
  // NOTE: Need encodeURIComponent() to encode whitespace (and other special chars)
  //       Otherwise the invalid url can silently fail (no save dialog box will be shown)
  aElement.href = "data:text/plain," + encodeURIComponent(text.replace(/\n/g,"\r\n"));

  aElement.click( );  // Trigger the save dialog
}



//
// Shows a file dialog for user to select text file name and folder
// Writes text to the selected file
//
// NO indication of failure, success, done writing or canceling by user
//
function fileSaveLargeText( defaultFileName, text ) {
  let fileURL;
  let aElement = document.createElement( "a" );  // Create a <a> tag (hyperlink)

  aElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate

  // Force Windows EOL (\r\n vs \r)
  // let fileData = new Blob( text );
  fileURL = URL.createObjectURL( new Blob([text.replace(/\n/g,"\r\n")]) );

  aElement.href = fileURL;

  aElement.click( );  // Trigger the save dialog

  URL.revokeObjectURL( fileURL );
}



//
// Shows a file dialog for user to select json file
// Writes json to the selected file
//
// NO indication of failure, success, done writing or canceling by user
//
function fileSaveJson( defaultFileName, jsonObj ) {
  let jsonString = JSON.stringify( jsonObj, null, "  " );  // The "" causes formating

  defaultFileName = fileReplaceExt( defaultFileName, ".json" );  // Force the .json file extension

  // Create a <a> tag (hyperlink), with a dataURL, then "click() on it"
  let aElement = document.createElement( "a" );

  // Create a dataURL out of our string, and set it as the hyperlink address
  // NOTE: Need encodeURIComponent() to encode whitespace (and other special chars)
  //     in any jsonObj attribute strings (like {"name":"Ray Wallace"})
  aElement.href = "data:application/json," + encodeURIComponent(jsonString);

  aElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate

  aElement.click( );  // Trigger the save json dialog
}



//
// Shows a file dialog to user
// Writes image in canvas to the selected file
//
// NO indication of failure, success or canceling by user
//
// Accepts a default filename and a <canvas> element or a canvas context
// NOTE: Will aslo work with a canvas class obj IF it has a .toDataURL() implementation
//
function fileSaveCanvas( defaultFileName, canvas ) {
  let dataUrl;
  let linkElement = document.createElement( "a" );

  // If a canvas context was passed in, then get it's canvas element
  if( !("toDataURL" in canvas) )  canvas = canvas.canvas;

  dataUrl = canvas.toDataURL( "image/png", 1 ); // use "image/png" (the default), "image/jpeg". Quality is 100% (1.0)

  linkElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate
  linkElement.href = dataUrl;

  linkElement.click();  // Save as dialog box will let user save the data to a file
}



//
// Shows a file dialog to user
// Writes image in canvas to the selected file
//
// NO indication of failure, success or canceling by user
//
// Accepts a default filename and either a <canvas> element or a <canvas> context
//
function fileSaveLargeCanvas( defaultFileName, canvas ) {
  // If a canvas context was passed in, then get it's canvas element
  if( "canvas" in canvas )  canvas = canvas.canvas;

  canvas.toBlob( blob => {
    let linkElement = document.createElement( "a" );

    linkElement.download = defaultFileName;  // The download attribute causes the browser to download instead of navigate
    linkElement.href = URL.createObjectURL(blob);

    linkElement.click();  // Save as dialog box will let user save the data to a file
    URL.revokeObjectURL( linkElement.href ); // Remove connection to file blob, to allow garbage collection
  },"image/png" );  // Could use "image/png" (the default), "image/jpeg", "image/tiff", "image/bmp" or "image/gif"
}



//
// Support function
// Base code for creating <img> tag for functions that do "new Image()"
//
// idSubtring is added to the ID name, to make it reusable but unique. Image file name is perfect for this!!
//
// Returns image element (<img>)
//
function createImgElement( idSubtring ) {
  // Reusable ID
  let imageId = "__Img_"+idSubtring+"ID";

  // Attempt to get the <img> that we may have previously created
  let imgElement = document.getElementById( imageId );

  if( !imgElement ) {
   // Haven't previously created the <img>, so create it now and set it up
    imgElement = new Image();
    imgElement.id = imageId;
  }

  return imgElement;
}



//
// Checks the existance of a file (Like fileRead(), but with fewer error messages, i.e. just the browser logging http errors)
//
// "Returns" to the callback true if found, false otherwise
//
// Takes either a url OR a fileName
//
function fileExists( fileName, callback ) {
  let exists = false;  // Need to save the results for the .finally() clause, since it does NOT take parameters like .then() does

  // fetch( fileName, {method:"HEAD", Cache-Control: no-store, headers:{Accept:"text/plain"}} )
  fetch( fileName, {method:"HEAD", cache:"no-store"} ) // Sets the "cache-control" http header
  .then( response => {
    let jsonStream = null;

    if(response.ok) exists = true; // Means .status is in the range 200-299
    callback( exists );
  } )
  .catch( error => {
    callback( exists ) // Does not exist
  } );
}


//
// The read json object is passed to the callback, i.e. callback(jsonObj)
//
// "Returns" to the callback {fileName:"",jsonObj:""}
//   where jsonObj is null on error, json object read from the file otherwise
//   where fileName is an error message on error, filename otherwise
//
// Takes either a url OR a fileName
//
function fileReadJson( fileName, callback ) {
  let returnJson = {};  // Need to save the results for the .finally() clause, since it does NOT take parameters like .then() does

  // If we need to get a fileName from user, then use a totally different function to prompt and read json
  if( !fileName )  fileReadJsonPrompt( callback );
  else {
    ++FileWaitingOnFiles; // File operation about to be pending

    fetch( fileName, {headers:{Accept:"application/json"}} )
    .then( response => {
      let jsonStream = null;

      if(response.ok) jsonStream = response.json(); // .status is in the range 200-299
      else if(response.status==404)  console.log("WARNING: <"+fileName+"> not found. " + response.statusText);
      else  console.log("ERROR: Could not open file or url: <"+fileName+">" + response.statusText);

      return jsonStream;
    } )
    .then( jsonObj => returnJson = jsonObj, error => console.error(`Bad .json file, ${fileName}: ${error}`) )  // Save json for .finally()
    .finally( () => {
      --FileWaitingOnFiles; // File operation no longer pending

      callback( {fileName:fileName,jsonObj:returnJson} );  // Return the results
    } );
  }
}



//
// Shows a file dialog for user to select json file
// Reads the selected file
//
// Calls the specified callback, passing back an object with filename and json text ({fileName:"",jsonObj:""})
//
// NOTE NOTE Use fileReadText("",) to get here!!!
//
function fileReadJsonPrompt( callback=null ) {
  let inputFileElement = document.createElement( 'input' );
  let fileName = "";

  inputFileElement.type = 'file';
  inputFileElement.accept = ".json";

  // Wait for onchange (i.e. User selected a file)
  inputFileElement.onchange = (event) => {
    // NOTE Chrome seems to reuse it's event object, so we need to store .files[0].name for use inside fileReader.onload()
    fileName = event.target.files[0].name;

    event.target.files[0].text( )  // Get a promise for the text
    .then( text => {
      if( callback )  callback( {fileName:fileName,jsonObj:JSON.parse(text)} );
    });
  };

  inputFileElement.click();  // Initiate the File dialog box
}



//
// Prompts user for a filename.
//
// Pass in comma seperated list of extensions or mime types (i.e. ".txt, .json, image/*, text/*")
//
// Return filename to callback
//
// NOTE Caller must prepend appropriate path (i.e. "Images/") if needed, as we can NOT get the path of selected filename
//
function fileNamePrompt( extensions=".*", callback=null ) {
  let inputFileElement = document.createElement( 'input' );

  inputFileElement.type = 'file';
  inputFileElement.accept = extensions;

  // Wait for onchange (i.e. User selected a file)
  inputFileElement.onchange = (event) => {
    if( callback )  callback( event.target.files[0].name );
  };

  inputFileElement.click();  // Initiate the File dialog box
}



//
// If empty fileName (""), then show a file open dialog box
// Reads the specified/selected file
//
// Return null to callback on error, otherwise return {fileName,element,image} object
//
function fileLoadImage( fileName, callback=null ) {
  // Prompt for fileName? Or go directly to core code?
  if( fileName ) fileLoadImageCore( fileName, callback );
  else {
    let inputFileElement = document.createElement( 'input' );

    inputFileElement.type = 'file';
    inputFileElement.accept = "image/png, image/*";

    inputFileElement.onchange = (event) => {  // Wait for our faked .click() below
      let fileName = event.target.files[0].name;
      let imageElement = createImgElement( fileName ); // NOTE: fileName is just for creating an ID

      // Create a URL refernce to the file blob (just a refernce, it is not the actual data like a dataURL)
      let objectURL = URL.createObjectURL( event.target.files[0] ); // Must be the whole file structure, not just fileName

      imageElement.onload = () => {
        URL.revokeObjectURL( objectURL );  // The file blob can not be garbage collected until we break the association with objectURL
        if( callback ) callback( {fileName:fileName, element:imageElement, image:objectURL} );
      };

      imageElement.src = objectURL;  // Trigger file load
    };

    // Initiate the File dialog box
    inputFileElement.click();
  }
}



//
// Just need to load the fileName into an <img> image element and pass the image element to the callback
//
// NOTE: Only get here from fileLoadImage()
//
// Return null to callback on error, otherwise return {fileName,element,image:null} object
//
function fileLoadImageCore( fileName, callback ) {
    let imageElement = createImgElement( fileName ); // NOTE: fileName is just for the ID for the created reusable html <img> element

    // Add 1 any time we initiate a file read (img or json files)
    // Subtract 1 any time we finish reading a file
    ++FileWaitingOnFiles;

    imageElement.onload = () => {
      --FileWaitingOnFiles;

      callback( {fileName:fileName, element:imageElement,image:null} );
    };

    // Handle failure/errors
    imageElement.onerror = (event) => {
      --FileWaitingOnFiles;

      console.log("WARNING fileLoadImageCore(): FAILED to load <"+fileName+">: "+event.type);

      callback( null );
    };

    // Setting the .src will cause the image file to load asynchronousely
    imageElement.src = fileName;
}



//
// Show a file open dialog box
// Returns the image data of the selected file as an ArrayBuffer
//
// Return null to callback on error, otherwise return {fileName, image, element} object
//
function fileGetImageData( callback=null ) {
  let imageElement = document.createElement( "img" );
  let inputFileElement = document.createElement( 'input' );

  inputFileElement.type = 'file';
  inputFileElement.accept = "image/png, image/*";

  inputFileElement.onchange = (event) => {  // Wait for our faked .click() below
    let fileName = event.target.files[0].name;
    let file = event.target.files[0];
    let fileReader = new FileReader( );

    // Create a URL refernce to the file blob (just a refernce, it is not the actual data like a dataURL)
    imageElement.src = URL.createObjectURL( file ); // Make available incase caller want's to display the image as well as use the binary data

    fileReader.onload = event => {  // loadend event ( .onloadend ) happens whether successfull or not. load event (.onload) only for success
      if( callback ) callback( {fileName:fileName, image:event.target.result, element:imageElement} );
    };
    fileReader.readAsArrayBuffer( file );  // Trigger file read

  };

  inputFileElement.click();    // Initiate the File dialog box
}



//
// Show a file open dialog box
//
// Returns the filename and file object of selected file {fileName, file, src}
//   The file object is usable as a parameter to URL.createObjectURL(), FileReader, fetch( {body:file} ), etc...
//   The src can be used as the file src for an img element, etc...
//
// Return null to callback on error, otherwise return {fileName, image, src} object
//
function fileGetFileObj( mimeType = ".*", callback=null ) {
  let inputFileElement = document.createElement( 'input' );

  inputFileElement.type = 'file';
  inputFileElement.accept = mimeType; // e.g. "image/png, image/*";

  inputFileElement.onchange = (event) => {  // Wait for our faked .click() below
    let fileName = event.target.files[0].name;
    let file = event.target.files[0];
    let src = URL.createObjectURL( file ); // Make available incase caller want's to display the image as well as use the binary data

    if( callback ) callback( { fileName, file, src } );
  };

  inputFileElement.click();    // Initiate the File dialog box
}



//
// Remove a variable from localStorage (browser "internal" storage)
//
// Previously called removeFromLocalStorage()
//
function removeLocalStorage( variableName ) {
  let prefix = (typeof LocalStoragePrefix != "undefined") ? LocalStoragePrefix + "_" : "RWWJ_";

  localStorage.removeItem(prefix + variableName);
}
let removeFromLocalStorage = removeLocalStorage;  // Legacy support

// Synonym for removeLocalStorage()
let deleteLocalStorage = removeLocalStorage;


//
// Read json object from localStorage
//   Return the object or null (if not found)
//
// Previously called jsonFromLocalStorage()
//
function fromLocalStorage( name ) {
  let prefix = (typeof LocalStoragePrefix != "undefined") ? LocalStoragePrefix + "_" : "RWWJ_";

  return JSON.parse( localStorage.getItem(prefix + name) );
}


//
// Write value object to localStorage in json format
//
// Previously called jsonToLocalStorage() NOTE: with params REVERSED
//
function toLocalStorage( name, value ) {
  let prefix = (typeof LocalStoragePrefix != "undefined") ? LocalStoragePrefix + "_" : "RWWJ_";
  let jsonStr = JSON.stringify( value, null, "  " );

  localStorage.setItem(prefix + name, jsonStr);
}


//
// Either delete variable from localStorage, or clear ALL of localStorage
//
// NOTE: Clearing ALL localStorage, could effect other web pages/sites
//
function clearLocalStorage( name = null ) {
  let prefix = (typeof LocalStoragePrefix != "undefined") ? LocalStoragePrefix + "_" : "";

  if( name ) localStorage.removeItem(prefix + name);
  else localStorage.clear( );
}


//
// Return an array of names of all entries in LocalStorage
//
function listLocalStorage( ) {
  let list = [];

  for( let keyNum = 0; keyNum < localStorage.length;++ keyNum ) {
    list.push( localStorage.key( keyNum ) );
  }

  return list;
}






//
