//
//	        Helpers.js
//
//        Misc Helper Classes and functions
//
//  RWWJ  26 Dec 2021	Created
//
//  RWWJ   1 Apr 2022	Added fullscreenToggle()
//              			Version 1.1
//
//  RWWJ   2 Jul 2022  Fixed pageName() for Atom editor preview html, it seems to append a (second) .html extension
//                     Added decodeURI() to convert %20 back to a space (for html filenames with spaces, "Contact Us.html" et.al.)
//                     Fixed hostName() "." to "," conversion and eating last digit of IP. Remove port #
//			               Version 1.5
//
//  RWWJ  21 Jul 2022  Fixed capitalizeWords() (more like finished it, is was totaly not correct/working)
//                     Version 1.6
//
//  RWWJ  10 Aug 2022  Fixed infinite recursion in cloneObj() by adding check for hasOwnProperty()
//                     Version 1.7
//  RWWJ  15 Aug 2022  Removed redundant .replace(".html", "") in pageName()
//  RWWJ  31 Aug 2022  Added pathFromURL()
//                     Removed cloneObj_OLD()
//                     Fixed capitalizeWords()
//  RWWJ   4 Sep 2022  Fixed playSoundFileWebAudio(), playSoundFile(), playSoundFile2() to use fileName param and return sound element
//                     Version 1.8
//  RWWJ   5 Sep 2022  Added hash() function (I did not write it)
//  RWWJ  24 Sep 2022  Removed "redundant" .replace(".html", "") in pageName(), as it is a fix for Atom preview
//  RWWJ  07 Oct 2022  Added extension()
//					   Version 1.9
//  RWWJ  30 Oct 2022  Added changeExtension( fileName, ext )
//
//  19 Nov 2022  Added uuid() and initSlider()
//        Version 2.0
//  20 Dec 2022  Added cssStylesheet()
//        Version 2.1
//  27 Dec 2022  Added emptyObj( )
//        Version 2.2
//   4 Jan 2023  Added capitalize() synonym for capitalizeWords()
//        Version 2.3
//   4 Jan 2023  Added filename()
//        Version 2.3a
//   4 Jan 2023  Added makeDOMId( ) (moved here from dialog_box.js)
//        Version 2.3b
//   9 Jan 2023  Added guid() and smallId()
//   6 Feb 2023  Added copyObj
//        Version 2.4
//  28 Mar 2023  Added toClipboard( event )
//        Version 2.5
//   3 May 2023  Added fileSizeStr( size )
//   2 Aug 2023  Changed jsonToLocalStorage() call in initSlider(), to be the newer toLocalStorage()
//        Version 2.6
//  27 Aug 2023  Added addElement() and cssColorDefaults()
//        Version 2.7
//  14 Sep 2023  Changed fileSizeStr() to not show B and to not show fractional (decimal point) amounts
//        Version 2.8
//  20 Sep 2023  Added hasExtension(  )
//        Version 2.9
//  28 Sep 2023  Added shuffle( )
//  15 Oct 2023  Added random( ...args )
//               Version 3.0
//  20 Oct 2023  Added step to initSlider() parameters
//               Fixed initSlider() to handle localStorge if files.js is not being used by program
//               Version 3.1
//  21 Oct 2023  Changed initSlider() to return the slider input element (not the ID string)
//               Rewrote initSlider() to use addElement()
//               Version 3.2
//  24 Oct 2023  Removed extranious console.log()'s and changed one to a console.error()
//               Version 3.3
//  26 Oct 2023  Added the map() function
//               Version 3.4
//  2 Nov 2023   Added randomInt( )
//               Changed random() to be random float
//               NOTE: random() and randomInt() now treat max like Math.random(), e.g. "up to but NOT including max"
//               Version 3.5
//  10 Nov 2023  Added fileDir( fileName )
//               Changed changeExtension() slightly to be the same as fileReplaceExt() in files.js
//               V3.6
//  18 Nov 2023  Added hsb() and hsv() rgb color conversion functions
//               V3.7
//  19 Nov 2023  Added brightness( )
//               V3.8
//               Sometime recently I changed filePath() to be fileDir() ... this could break some code, tho it is more accurate
// 29 Nov 2023  Added isWindows( ), isLinux( ), isMac( )
//              V3.9
//  2 Dec 2023  Changed cloneObj() to call the newish Javascript structuredClone() function
//              V4.0
// 16 Dec 2023  Changed addElement() to allow the classes string to be a space seperated string of classes
//              so cutting and pasting from HTML just works!
//              V4.1
// 15 Jan 2025  Renamed playSoundFile2() playSoundFile() and removed the old playSoundFile() code
//              V4.2
// 24 Jan 2024  Changed filename() to use similar code to fileDir()
//              BREAKING CHANGE: Changed fileDir() to append a trailing "/"
//              V4.3
// 30 Apr 2024  Fixed fileDir() to return "" if there is NO directory
//              V4.4
//  8 May 2024  Added sanitizeFilename() and checkFilename()
//              V4.5
// 22 Jul 2024  Fixed initSlider() to use fromLocalStorage() like I thought it was and should have been
//              V4.6
//  9 Aug 2024  Added support in cloneObj() and copyObj() for regular expressions (RegExp)
//              and simplified their Date code to one line (one call)
//              V4.7
// 16 Aug 2024  Fixed the copyObj() call for a non-object dst property
//              V4.8
// 14 Sep 2024  Default initial initSlider() value to midpoint from min to max
//              Add value parameter to initSlider()
//              V4.9
// 14 Oct 2024  Moved .SliderContainer label to the left side of the slider
//              V5.0
// 25 Oct 2024  Added camelCase( str )
//              V5.1
// 13 Nov 2024  Improved extension(path) to deal with . in directory name portions of the path
//              Added mimeExtension(path)
//              V5.2
// 25 Dec 2024  Added toMonthStr(month)
//              V5.3
// 27 Dec 2024  Yet again removed "redundant" .replace(".html", "") in pageName(). It was a fix for Atom preview, but NOT a problem with Pulsar
//              V5.4
//


var HelpersJsVersion = "5.4";



// Import all with this statement (NOTE: change the directory as appropriate)
// import {fullscreenToggle, hostName, pageName, capitalizeWords, capitalize, cloneObj, copyObj, emptyObj,
//         toMonthStr, daysInMonth, loadScript, playSoundFileWebAudio, playSoundFile, pathFromURL, hash, uuid, guid, smallId,
//         makeDOMId, filename, fileDir, extension, hasExtension, mimeExtension, changeExtension, changeExt, sanitizeFilename,
//         checkFilename, camelCase, initSlider, cssStylesheet, cssColorDefaults, toClipboard,
//         fileSizeStr, addElement, shuffle, random, randomInt, map, hsb, hsv, isWindows, isLinux, isMac, isCellPhone
//       } from "../javascript_libraries/helpers_module.js";


// export {fullscreenToggle, pageName, hostName, capitalizeWords, capitalize, cloneObj, copyObj, emptyObj,
//         toMonthStr, daysInMonth, loadScript, playSoundFileWebAudio, playSoundFile, pathFromURL, hash, uuid, guid, smallId,
//         makeDOMId, filename, fileDir, extension, hasExtension, mimeExtension, changeExtension, changeExt, sanitizeFilename,
//         checkFilename, camelCase, initSlider, cssStylesheet, cssColorDefaults, toClipboard,
//         fileSizeStr, addElement, shuffle, random, randomInt, map, hsb, hsv, isWindows, isLinux, isMac, isCellPhone
//        };

//   ONLY needed in Node Js, not in browser (client side) code
// import {performance} from "perf_hooks";


//        Functions
//
// fullscreenToggle( )
// hostName( )
// pageName( )
// capitalizeWords( str )
// capitalize( str )
// isCellPhone( )
// cloneObj( src )
// copyObj( src, dst )
// emptyObj( obj )
// toMonthStr( month )
// daysInMonth( theDate = null )
// loadScript( jsFileName, callback = null )
// playSoundFileWebAudio( fileName, volume = 0.01 )
// playSoundFile( fileName, volume = 0.01 )
// pathFromURL( url )
// hash( string )
// uuid()
// guid()
// smallId( )
// makeDOMId( name, suffix = "ID" )
// filename( filename  )
// fileDir( fileName )
// extension( filename )
// hasExtension( filename, extensions )
// mimeExtension( path )
// changeExtension( fileName, ext )
// changeExt( fileName, ext )
// sanitizeFilename( pathname )
// checkFilename( pathname )
// camelCase( str )   ---   Convert string to camel case
// initSlider( {name="Percentage", sliderId=null, parent = null, callback=null, value=null, min=0, max=100, step=1} )
// cssStylesheet( name, styleText )
// cssColorDefaults( )
// toClipboard( event )
// fileSizeStr( size )
// addElement(  tag="div", {parent=document.body, id=null, classList=null, text="", type=""} )
// shuffle( array )
// random( ...args )        --- (), or (max), or (min, max)
// randomInt( ...args )     --- (), or (max), or (min, max)
// map( value, min, max, newMin, newMax )
// hsb( red, green, blue )
// hsv( red, green, blue )  --- Synonym for hsb()
// isWindows( )
// isLinux( )
// isMac( )
//




//
//
// Toggle Fullscreen mode
//
function fullscreenToggle( ) {
  if( document.fullscreenElement )  document.exitFullscreen();  // Exit is done on the document
  else document.documentElement.requestFullscreen();            // Enter is done on an element, which the document is not. The <html> tag is however.
}



//
// Returns the webpage name, i.e. the URL, minus the, server, port, extension, anchors ("#pageMarker" et.al.) and search string ("?string" if any)
//
// So we return, for example, "index", "About", etc..
//
// Browsers load index.html if the URL does not have a file name, so this routine does as well
//
// Could use location.pathname() instead of .href(), but still need to .split("/"), so code is no shorter
//
function pageName( ) {
  // // FIX: For Atom editor preview html, it seems to append a (second) .html extension
  // return  decodeURI(location.href.split("/").slice(-1).toString().replace(".html", "").replace(".html", "").split("?")[0].split("#")[0] || "index");
  return  decodeURI(location.href.split("/").slice(-1).toString().replace(".html", "").split("?")[0].split("#")[0] || "index");
}



//
// Returns the webpage host name, i.e. the URL, minus the, protocol, port, path, page name, and search string ("?" if any)
//
// So we return, for example, just "google.com", "RipsPics.com", etc..
//
function hostName( ) {
  // return location.href.split("/").slice(2,3).toString().replace("www.", "").split(".").slice(0,-1).toString();

  // Fixes the .'s in domain names and ip address being replaced by ,'s (i.e. amzon.com bacame amazon,com, http://127.0.0.1:59730/index.html, becoming 127,0,0)
  // Also was eating the last digit of the ip address
  // And remove port
  return location.hostname.replace( "www.", "" );
}



//
// Capitalize all words that start with a character (i.e. not with a # or symbol)
//
// Equivelent to capitalize()
//
function capitalizeWords( str ) {
  // return str.split(" ").map(str => str[0].toUpperCase()+str.slice(1) ).join(" ");
  return str.replace( /\b(\w)/g , match => match.toUpperCase() );
}



//
// Synonym for capitalizeWords()
//
function capitalize( str ) {
  return capitalizeWords( str );
}



//
// Returns a copy of the objects (sub-objects are copied too, not just their references)
//
// Recursive
//
// NOTE: Dec 2023, I now just call structuredClone() (been available for a year or so)
//       It handles cyclic references (mine would get stuck in a loop), dates, and some types mine doesn't
//
// NOTE: 9 Aug 2024 Added support for regular expressions (RegExp)
//                  Simplified Date code to one line (one call)
//
// OLD NOTE: This is similar to the first routine I wrote, but is a variation on code from a video by Dave Gray
//       It is more concise and fixes a couple of bugs that my routine had
//       Among other modifications, I added code for dates and catching non-cloneable items (functions et.al.)
//
function cloneObj( src ) {
  let dst;

  if( typeof structuredClone == "function" ) dst = structuredClone( src )
  else {
    // Basic type, not an array, not null (is the typeof "object") not a date and not an object
    if( typeof src != "object" || src == null )  dst = src;
    else if(src instanceof Date) {  // Handle Dates, I don't use them, but may as well cover it
      dst = new Date(src);
    }
    else if(src instanceof RegExp) {  // Handle Regular Expressions, I don't use them, but may as well cover it
      dst = new RegExp(src);
    }
    else if( typeof src == "object" ) { // Handle arrays ([]) and "real" objects (i.e. {})
      dst = Array.isArray(src) ? [] : {};

      for( let nextProperty in src ) {
        if( src.hasOwnProperty(nextProperty) ) {
          dst[nextProperty] = cloneObj(src[nextProperty]);
        }
      }
    }
    else    console.error("ERROR cloneObj(): Unexpected data type"); // Can not clone functions, etc..
  }

  return dst;
}



//
// Copy src object into the dest object, replacing properties that are already in dest with values from src
// (like a deep clone, but a deep copy)
//
// Similar to cloneObj(), but totaly different :-)
//
// NOTE: 9 Aug 2024 Added support for regular expressions (RegExp)
//                  Simplified Date code to one line (one call)
//      16 Aug 2024 Fixed the copyObj() call for a non-object dst property
//
// TEST examples:
//    srcObj = {a:12,c:{x:22,y:[3,4]}}; dstObj = {a:0,c:{t:55,u:66,y:77}}; copyObj(srcObj,dstObj); console.log(srcObj); console.log(dstObj);
//
function copyObj( src, dst ) {
    // Basic type, not an array, not null (is the typeof "object") not a date and not an object
    if( typeof src != "object" || src == null )  ;  // No change to dst
    else if(src instanceof Date) {  // Handle Dates, I don't use them, but may as well cover it
      dst = new Date(src);
    }
    else if(src instanceof RegExp) {  // Handle Regular Expressions, I don't use them, but may as well cover it
      dst = new RegExp(src);
    }
    else if( typeof src == "object" ) { // Handle arrays ([]) and "real" objects (i.e. {})
      for( let property in src ) {
        if( src.hasOwnProperty(property) && src[property] != undefined ) {
          if( typeof src[property] != "object" || src[property] == null ) { // Of course, null IS an "object". Crazy!
            dst[property] = src[property];
          }
          else if( typeof dst[property] != "object" || dst[property] == null ) {
            dst[property] = copyObj( src[property], Array.isArray(src[property]) ? [] : {} );  // Copy to [] or {}
          }
          else {
            copyObj(src[property], dst[property]);
          }
        }
      }
    }

    return dst;
}



//
// This only tests for emptiness. Use Object.keys(obj).length if you want to know the number of properties
//
function emptyObj( obj ) {
  for( let property in obj ) return false; // If there are ANY properties, then it is not empty
  return true;
}



//
// Uses month # from 0 to 11 to return 3 letter month string
// Works with Date().getMonth()
//
function toMonthStr( month ) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  return months[month]
}



//
// Defaults to today, but can pass in value valid for the Date constructor
// i.e. dateString, dateObject, or milliseconds since January 1, 1970, 00:00:00 UTC
//
function daysInMonth( theDate = null ) {
  let dt;
  dt = theDate ? new Date(theDate) : new Date();

  // Specifying a day of 0 makes us go to the last day of the month previous to the specified one
  return new Date( dt.getFullYear(), dt.getMonth()+1, 0 ).getDate();
}



//
// Load a .js script file by injecting a <script> tag into the <head> of the dom
//
// Since it loads asynchronously, we can provide a callback if we need to know when variables and functions
// in the file are ready to be used
//
function loadScript( jsFileName, callback = null ) {
    let scriptElement = document.createElement("script");

    if( callBack ) scriptElement.onload = callback;	// The callback function can use the newly loaded .js file

    scriptElement.src = jsFileName;

    // Trigger the load by adding it to the <head>
    document.head.appendChild(jsScript);
}



// Play sound files (mp3, wav, etc..)
//
// NOTE Does NOT work for .mp3 nor .ogg
//    Does work for .wav, m4a
function playSoundFileWebAudio( soundFileName, volume = 0.01 ) {
  let buffer = null;
  let sndContext = new AudioContext();

  fetch(soundFileName)
  .then( response => {
    if(response.ok) return response.arrayBuffer();
    else throw new Error("playSoundFileWebAudio() Could not open file: <"+soundFileName+">");
  })
  .then (data => {
    return sndContext.decodeAudioData( data );
  })
  .then( decodedData => {
    let sourceNode = sndContext.createBufferSource( );
    buffer = decodedData;
    sourceNode.buffer = buffer;

    sourceNode.connect( sndContext.destination );

    sourceNode.start( 0 );
    sourceNode.stop( 2 ); // Play for 2 seconds
  })
  .catch( error => console.error(error)
  );

}


//
// Play sound files (mp3, wav, etc..)
//
// Returns the Sound Element, so caller can use .pause(), .play(), .volume, .muted, .loop
//
// Works with .wav, .mp3, .m4a
// Does NOT work with the .ogg file I have
//
// For quick successive calls
//
function playSoundFile( fileName, volume = 0.01 ) {
  let sndElement;

  // Browser starts loading file imediatly, if a fileName is specified
  sndElement = new Audio( fileName );

  // NOTE: 0.5 is supposedly half volume. I don't believe it!
  sndElement.volume = volume;

  // Can set .autoplay in place of .play()
  sndElement.autoplay = true;

  // NOTE: Instead, we could set .autoplay=true
  // sndElement.play();
  // setTimeout(()=>sndElement.pause(),5000); // Play for 5 seconds

  // We can also pause the playback
  // sndElement.pause();

  // We can also rewind the playback
  // sndElement.currentTime = 0;

  // Can mute it without changing the volume (that is, .volume=0 also mutes)
  // sndElement.muted = true;

  // We can loop forever
  // sndElement.loop = true;

  return sndElement;
}



//
// e.g. "http://127.0.0.1:3000/Images/Chris_Hamons-PublicDomain-DungeonCrawl_ProjectUtumnoTileset-32x32.png"
//     becomes "Images/Chris_Hamons-PublicDomain-DungeonCrawl_ProjectUtumnoTileset-32x32.png"
//
function pathFromURL( url ) {
  let path = decodeURI( url );
  let foundAt = url.indexOf("://"); // See if there is a "http://" prefix

  // Ensure it is a url
  if( foundAt != -1 ) {
    path = path.slice( foundAt+3 );
    if( path.indexOf("/") != -1 ) {
     path = path.substring(path.indexOf("/")+1);
    }
  }

  return path;
}



//
//    Create a hash number from a string
//
//    RWWJ This function is verbatum (except name change from cyrb53() to hash()) from:
//        https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
//        "...cyrb53, a simple but high quality 53-bit hash. It's quite fast, provides very good* hash distribution"
//      You can read more of what Bryc says about it on StackOverflow.com by search for cyrb53 at:
//        https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
//
//    cyrb53 (c) 2018 bryc (github.com/bryc)
//    A fast and simple hash function with decent collision resistance.
//    Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
//    Public domain. Attribution appreciated.
//
function hash( str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1>>>16), 2246822507) ^ Math.imul(h2 ^ (h2>>>13), 3266489909);
    h2 = Math.imul(h2 ^ (h2>>>16), 2246822507) ^ Math.imul(h1 ^ (h1>>>13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1>>>0);
}

//
//  Generate an RFC compliant UUID (GUID), specifally an rfc uuid v4 (standard uuid these days)
//
//  NOTE: The UUID is a valid html class and id name
//
//  23 Feb 2022	Created by Ray Wallace based on code from by broofa, called uuidv4() at:
//    https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
//
// Synonym for guid()
//
function uuid() {
  return crypto.randomUUID ?
    crypto.randomUUID() : // .randomUUID() is only avalable in https:// (secure) connections
    ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
    // Equivelent to:
    // `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
    // --or--
    //    "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16) );
}

//
// Synonym for uuid()
//
function guid() {
  return uuid();
}

//
// Returns a 19 character string (17 hex digits and 2 _'s)
// NOTE: Note in about 500 years, the date will be such that the string will be one hex digit longer :-)
//
function smallId( ) {
  // Ignore the fractional part of .now(), since most browsers round it up to full milliseoconds (or more)
  return Date.now().toString(16).padStart(12,"0") + "_" + Math.floor(performance.now()%65535).toString(16).padStart(4,"0") + "_" + Math.floor(Math.random()*256).toString(16).padStart(2,"0");
}

//
// Creates a unique DOM Element ID with __, name, datetime and specified suffix
//
// Sanitizes name by replacing spaces and invalid ID characters with _ (underscore)
//
function makeDOMId( name, suffix = "ID" ) {
  let uniqueStr = performance.now().toString(16);

  return "__" + name.replace( /[\[\]\s!@#$%^&\*\(\)]/g, "_" ) + "_" + uniqueStr + "_" + suffix;
}



//
// Returns filename with the path stripped off
//
function filename( path ) {
  let linuxEnd = path.lastIndexOf( "/" );
  let windowsEnd = path.lastIndexOf( "\\" );
  let pathEnd = windowsEnd > linuxEnd ? windowsEnd : linuxEnd;

  if( pathEnd != -1 ) return path.substring( pathEnd+1 );
  else return path;
}



//
// Returns path with the filename stripped off
//   Adds a trailing / IF there was a directory
//
function fileDir( path ) {
  let linuxEnd = path.lastIndexOf( "/" );
  let windowsEnd = path.lastIndexOf( "\\" );
  let pathEnd = windowsEnd > linuxEnd ? windowsEnd : linuxEnd;

  if( pathEnd != -1 ) return path.substring( 0, pathEnd ) + "/";
//  else return path + "/";
  else return "";
}



//
// Returns .ext (extension of the path's filename), i.e. ".jpg", ".pdf"
//
function extension( path ) {
  let name = path
  let nameStart = path.lastIndexOf( "/" );
  let extStart;

  if( nameStart != -1 )  name = path.substring( nameStart )

  extStart = name.lastIndexOf( "." );

  if( extStart != -1 ) return name.substring( extStart );
  else return "";
}



//
// Returns true if path's filename has one of the specified extensions (i.e. [".jpg", ".pdf"])
//
function hasExtension( filename, extensions ) {
  let found = false;
  let filesExt = extension( filename );

  for( let extIndex = 0; !found && extIndex < extensions.length; ++extIndex ) {
    let ext = extensions[extIndex];
    found = filesExt == ext;
  }

  return found;
}



//
// Returns mimeType based on the extension of the path's filename), i.e. "image/jpeg", "application/pdf"
//
function mimeExtension( path ) {
  const exts = {jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", bmp:"image/bmp", gif:"image/gif",
                tif:"image/tiff", tiff:"image/tiff",
                pdf:"application/pdf", json:"application/json", txt:"text/plain",
                htm:"text/html", html:"text/html", js:"text/javascript",
                css:"text/css", csv:"text/csv",
                avi:"video/x-msvideo", mp3:"audio/mpeg", wav:"audio/wav", mp4:"video/mp4", mpeg:"video/mpeg",
                bin:"application/octet-stream", ttf:"font/ttf",
                doc:"application/msword", docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                zip:"application/zip", gz:"application/gzip",
               }
  let mimeType = exts[extension(path).toLowerCase().slice(1)]

  return mimeType ? mimeType : ""
}



//
// Replaces (or appends) path's filename extension, with newExt
//   Where newExt has an optional leading . (e.g. ".json" or "json" )
//
// A synonym for changeExt()
//
// NOTE: Same as fileReplaceExt() in files.js
//
function changeExtension( path, newExt ) {
  let extStart = path.lastIndexOf( "." );

  if( newExt[0] != "." ) newExt = `.${newExt}`;

  if( extStart != -1 ) return path.slice( 0, extStart ) + newExt;
  else                 return path + newExt;
}



//
// Replaces (or appends) path's filename extension, with newExt
//   Where newExt has an optional leading . (e.g. ".json" or "json" )
//
// A synonym for changeExtension()
//
// NOTE: Same as fileReplaceExt() in files.js
//
function changeExt( path, newExt ) {
  return changeExtension( path, newExt );
}



//
// Returns string with all bad characters (if any) replaced with _ (underscore)
//
// Windows reserved characters: < > : " / \ | ? * ;
//
// & was causing problems in some instances, so replace that as well
//
// Trailing . (i.e. \.$ ) seems to be a no-no as well
//
function sanitizeFilename( pathname ) {
  let name = filename( pathname )
  let dir = fileDir( pathname )

  return dir + name.replace( /[&\\/:*?\"<>|;]|\.$/g, "_" )
}



//
// Check filename
//
// Returns string of all bad characters (if any)
// INCLUDING a trailing . (i.e. \.$ )
// Else returns "" (null string) if filename is ok
//
// Windows reserved characters: < > : " / \ | ? * ;
//
function checkFilename( pathname ) {
  let filename = Path.basename( pathname );

  return [...filename.matchAll(/[&\\/:*?\"<>|;]|\.$/g)].join("");
}



//
// Convert string to camel case
//   example:
//     camelCase( "some-css-property" )  returns   "someCssProperty"
//
function camelCase( str ) {
  return str.replace(/-./g, x=>x[1].toUpperCase())
}



//
// sliderId
//   If sliderId is specified, then we'll use the associated element if it's already in the DOM, or create it if it isn't
//   If sliderId is not specified (or or there is no element for the id provided), then a slider (range input) will be created.
///  NOTE: You must specify a sliderId if you want the slider value saved and restored to/from localStorage
//
// parent (can be either an element OR an "ID_string")
//   Where the slider and all it's parts (label, min, max, and value spans) will be appended to.
//   If it doesn't exist then we'll append to the body
//
// value
//    Initial value of slider. Defaults to midpoint between min and max
//
// min
//    Minimum value slider can have
//
// max
//    Maximum value slider can have
//
// callback()
//   Called anytime slider value changes and is passed that value
//   Also called once during Initialization so caller knows the initial value (possibly restore from localStorage)
//
// Return the slider input element. If you specified an ID, then it will have that ID.
//
// localStorage
//   If a sliderId is specified, then we will store and restore the slider's value to/from local storage
//
// Classes .SliderContainer, .Slider (same as input[type=range]), .SliderLabel, .SliderRange, .SliderValue
//   NOTE: Caller can use these classes to style the "parts" of the slider
//
// We are creating this html:
//   <div class="SliderContainer">
//     <label for="SliderID"> name </label>
//       <span class="SliderRange">0</span>
//         <input id="SliderID" type="range" min="0" max="100" value="0">
//           <span id="value_SliderID">50</span>
//             <span class="SliderRange">100</span>
//   </div>
//
function initSlider( {name="Percentage", sliderId=null, parent = null, callback=null, value=null, min=0, max=100, step=1} ) {
  let storeAndRestore = sliderId ? true : false;  // Don't clutter localStorage with a bunch of random sliderId name entries
  let sliderElement = null;

  parent = parent ? (typeof parent === "string" ? document.getElementById( parent ) : parent) : document.body;

  let containerElement = addElement( "div", {parent, classList:"SliderContainer"} )

  // Slider id and element (either get or create it)
  if( sliderId ) sliderElement = document.getElementById( sliderId );
  else sliderId = uuid().slice(-12) + "_ID";
  if( sliderElement === null ) sliderElement = document.createElement("input");

  // Get stored value from localStorage (if there), now that we have a sliderId
  // NOTE value will be null if not in localStorage
  if( storeAndRestore ) {
    if( window.fromLocalStorage ) value = fromLocalStorage( `Slider_${sliderId}` )
    else value = JSON.parse( localStorage.getItem(`Slider_${sliderId}`) )
  }

  // Default initial slider value to midpoint from min to max
  if( value == null ) value = min + (max - min) / 2

  let labelElement = addElement( "label", {parent:containerElement, text:name} )
  labelElement.htmlFor = sliderId;  // MUST use .htmlFor instead of .for OR use .setAttribute("for","")

  // Slider
  sliderElement = addElement( "input", {parent:containerElement, id:sliderId, classList:"Slider", type:"range"} )
  sliderElement.min = min;
  sliderElement.max = max;
  sliderElement.step = step;
  sliderElement.value = value;

  let minElement = addElement( "span", {parent:containerElement, classList:"SliderRange", text:min} )

  let maxElement = addElement( "span", {parent:containerElement, classList:"SliderRange", text:max} )

  let valueElement = addElement( "span", {parent:containerElement, id:`value_${sliderId}`, classList:"SliderValue", text:`{${value}}`} )

  // Initial call to user callback
  if( callback ) callback( value ); // Initial slider value

  // input is an active event (fires as slider is moving)
  sliderElement.addEventListener( "input", event => {
    value = event.target.value;
    valueElement.innerText = `{${value}}`;
    if( callback )  callback( value );
  } );

  if( storeAndRestore ) {
    // change event only fires when slider stops moving, so good time to store value in localStorage
    sliderElement.addEventListener( "change", event => {
      value = event.target.value;
      if( window.toLocalStorage ) toLocalStorage( `Slider_${sliderId}`, value )
      else localStorage.setItem( `Slider_${sliderId}`, JSON.stringify(value,null,"  ") )
    } );
  }

  return sliderElement;
}


function cssStylesheet( name, styleText ) {
  let newStyleSheet;
  let existingSheets;
  let newRule;
  let exists = false;

  // Figure out if we are doing the workaround for browser not implementing CSSStyleSheet() constructor
  if( document.adoptedStyleSheets ) existingSheets = document.adoptedStyleSheets;
  else existingSheets = document.styleSheets;

  // First see if we've already created this css style
  for( let next = 0 ; !exists && next < existingSheets.length; ++next ) {
    let sheetFirstRule = existingSheets[next].cssRules[0].cssText;
    // Look for our mark (a class we use only for this purpose) and the name
    exists = sheetFirstRule.startsWith(".DlgCSSCreatedFlag") && sheetFirstRule.includes(name);
  }

  if( !exists ) {
    // Go ahead and create the css stylesheet
    if( document.adoptedStyleSheets ) {
      newStyleSheet = new CSSStyleSheet();
      document.adoptedStyleSheets = [newStyleSheet];  // Tell the DOM about our new styleSheet
    }
    else {
      let styleElement = document.createElement( "style" );
      document.head.appendChild( styleElement );
      newStyleSheet = styleElement.sheet;
    }

    // Set the contents of the stylesheet (Synchronously)
    newStyleSheet.replaceSync( styleText );

    // Set a flag so we know we've created this stylesheet
    newStyleSheet.insertRule( `.DlgCSSCreatedFlag { content: "${name}" }` ); // Ensure it's last rule that we add, so we find it at .cssRules[0]
  }
}


//
// Set "common" css color variables.
//
// Some libraries or library routines (like dialog_box.js and dialog_class.js) may use
// "common" (my common) color variables. Calling this function makes sure that they are defined.
//
function cssColorDefaults( ) {
  let allStyles = getComputedStyle( document.documentElement ); // Neccessary for values from .css file
  let darkest = allStyles.getPropertyValue( '--DarkestColor' );
  let darker = allStyles.getPropertyValue( '--DarkerColor' );
  let normal = allStyles.getPropertyValue( '--NormalColor' );
  let light = allStyles.getPropertyValue( '--LightColor' );
  let lighter = allStyles.getPropertyValue( '--LighterColor' );
  // And an ACCENT color!!!
  let harley = allStyles.getPropertyValue( '--HarleyOrange' );

  // Now set the color variables that were not already set
  if( !darkest )  document.documentElement.style.setProperty( '--DarkestColor', "black" );
  if( !darker )  document.documentElement.style.setProperty( '--DarkerColor', "gray" );
  if( !normal )  document.documentElement.style.setProperty( '--NormalColor', "lightgray" );
  if( !light )  document.documentElement.style.setProperty( '--LightColor', "beige" ); // "beige" );
  if( !lighter )  document.documentElement.style.setProperty( '--LighterColor', "white" ); // "beige" );
  if( !harley )  document.documentElement.style.setProperty( '--HarleyOrange', "orange" );
}



//
// Copy selected text of .target to the clipboard. If there is no selection then copy everything
//
function toClipboard( event ) {
  let txt;

  // If there is no selection, then copy everything, else copy the selection
  if( event.target.selectionStart == event.target.selectionEnd ) txt = event.target.value
  else txt = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd)

  // Put it on the clipboard
  navigator.clipboard.writeText( txt )
}


//
// Using fileSizeStr().padStart(13) can line up an output display nicely
//
function fileSizeStr( size ) {
  const places = 3  // places right of the .
  let suffix = ""
  let newSize = size

  if( (newSize /= 1024) < 1024 )     suffix = "KB"
  else if( (newSize /= 1024) < 1024 )     suffix = "MB"
  else if( (newSize /= 1024) < 1024 )     suffix = "GB"
  else if( (newSize /= 1024) < 1024 )     suffix = "TB"

  return Math.ceil(newSize) + " " + suffix
}


//
//  Adds an element to the DOM
//
//    parent    - element is useful for adding elements (buttons, inputs, etc..) to a dialog or form
//    text      - is added as the elements innerHTML (mostly useful for text, but some text (e.g. &times) needs be inserted as HTML)
//    type      - is "dialog", "div", "button", etc...
//    id        - is set as the element's HTML ID
//    classList - is a string or array of strings that are set as the elements HTML classes
//    isMenu    - makes a vertical column of buttons
//
//  Returns the html element
//
function addElement( tag="div", {parent=document.body, id=null, classList=null, text="", type=null, isMenu=false} = {} ) {
  let element;

  if( tag == "text" )  element = document.createTextNode( text );
  else {
    element = document.createElement( tag ); // i.e. "dialog", "div", "button", etc...
    element.innerHTML = text;

    if( type ) element.type = type; // For input tags, we need to know what kind of input
  }

  if( isMenu )  element.style.display = "block";  // For making menus a vertical column of buttons

  parent.appendChild( element );         // Add element to the specified parent element

  if( id ) element.id = id;

  if( classList ) {
    // I kept passing a list of classes in a string, like I would have in HTML, so let's just deal with that case by making it an array if it isn't
    if( typeof classList == "string" )  classList = classList.split(" ");
    for( let aClass of classList )      element.classList.add( aClass );
  }

  return element;
}


//
// Shuffle an array (typically for a deck of cards)
//
// This is the popular Fisher–Yates algorythm
//
function shuffle( array ) {
  for( let curCard = array.length-1; curCard; --curCard ) {
    let randCard = Math.floor(Math.random() * curCard + 1)  // The +1 allows for swapping with ourselves (noop)
    let tempValue = array[curCard]
    array[curCard] = array[randCard]
    array[randCard] = tempValue;
  }
}
// Almost as good as Fisher–Yates shuffle
function shuffleRandom(array) {
  var randomValues = array.map(Math.random);
  array.sort(function(a, b) {
    return randomValues[a] - randomValues[b];
  });
}


//
// return random real number in range
//
// Has three forms
//   random( )           --- Number between 0 and 1 (not including 1)  (i.e. same as Math.random() )
//   random( max )       --- Number between 0 and max (not including max)
//   random( min, max )  --- Number between min and max (not including max)
//
function random( ...args ) {
  let min = 0  // Defaults
  let max = 1

  if( args.length == 1 )  max = args[0]
  else if( args.length > 1 )  {
    min = args[0]
    max = args[1]
  }

  return Math.random() * (max - min) + min
}


//
// return random integer number in range
//
// Has three forms
//   random( )           --- Integer between 0 and 1 (not including 1)
//   random( max )       --- Integer between 0 and max (not including max)
//   random( min, max )  --- Integer between min and max (not including max)
//
function randomInt( ...args ) {
  let min = 0  // Defaults
  let max = 1

  if( args.length == 1 )  max = args[0]
  else if( args.length > 1 )  {
    min = args[0]
    max = args[1]
  }

  return Math.floor( Math.random() * (max - min) + min )
}


//
// map value from being in the min max range to being the newMin newMax range
//
// Daniel Shiffman uses the p5 map() function so much, I decided it would be useful to have an implementation in my library
//
function map( value, min, max, newMin, newMax ) {
  let range = max - min
  let newRange = newMax - newMin
  let scale = newRange / range

  return newMin + ((value-min) * scale)
}


//
// Return HSB {hue, saturation, brightness} or {h, s, b} or {h, s, v} or {hue, saturation, value} equivalent to the RGB
//   hue is 0 to 360
//   saturation is 0 to 1   (you can multiply by 100 to get a %)
//   brightness (or value) is 0 to 1   (you can multiply by 100 to get a %)
//
// Got description of algorythm from:
//  https://www.codeproject.com/Articles/19045/Manipulating-colors-in-NET-Part-1#rgb2
//
function hsb( red, green, blue ) {
  let normRed   = Math.min(red, 255)   / 255     // Normalize after clamping to 255
  let normGreen = Math.min(green, 255) / 255
  let normBlue  = Math.min(blue, 255)  / 255
  let min = Math.min( Math.min(normRed, normGreen), normBlue )
  let max = Math.max( Math.max(normRed, normGreen), normBlue )

  let B = max
  let S = max ? (1 - min / max) : 0
  let H

  // H
  if( max == min )  H = 0  // "undefined"
  else if( max == normRed && normGreen >= normBlue )  H = 60 * (normGreen-normBlue) / (max-min)
  else if( max == normRed && normGreen < normBlue )   H = 60 * (normGreen-normBlue) / (max-min) + 360
  else if( max == normGreen )                         H = 60 * (normBlue-normRed) / (max-min)   + 120
  else if( max == normBlue )                          H = 60 * (normRed-normGreen) / (max-min)  + 240

  // Limit the number of decimals
  H = +( H.toFixed(4) )
  S = +( S.toFixed(4) )
  B = +( B.toFixed(4) )
  return {hue: H, h: H, saturation: S, s: S, brightness: B, b: B, value: B, v: B}
}


//
// Same as hsb(), just with brightness beging called value.
//
function hsv( red, green, blue ) {
  return hsb( red, green, blue )
}


//
// Return the humanly percieved brightness (i.e. colors weighted how our eye sees colors)
//
// NOTE This is way different than the brightness value in HSB.
//      It is also a way better representation of the (monochrome) brightness of a color.
//
function brightness( red, green, blue ) {
  return Math.sqrt( 0.299 * red * red + 0.587 * green * green + 0.114 * blue * blue )
}

function isWindows( ) {
  // mdn gives the example results of:   "MacIntel", "Win32", "Linux x86_64", "Linux armv81"
  // w3schools lists: "MacIntel", "Mac68k", "MacPPC", "Win32", "Win16", "Linux i686", "Linux armv81", WebTV OS
  // return navigator.platform.includes("Win")
  return navigator.platform.indexOf("Win") === 0
}


function isLinux( ) {
  // mdn gives the example results of:   "MacIntel", "Win32", "Linux x86_64", "Linux armv81"
  // w3schools lists: "MacIntel", "Mac68k", "MacPPC", "Win32", "Win16", "Linux i686", "Linux armv81", WebTV OS
  // return navigator.platform.includes("Linux")
  return navigator.platform.indexOf("Linux") === 0
}


function isMac( ) {
  // mdn gives the example results of:   "MacIntel", "Win32", "Linux x86_64", "Linux armv81"
  // w3schools lists: "MacIntel", "Mac68k", "MacPPC", "Win32", "Win16", "Linux i686", "Linux armv81", WebTV OS
  // return navigator.platform.includes("Mac")
  return navigator.platform.indexOf("Mac") === 0
}



//
// RWWJ Check userAgent for word "Mobi" (i.e. Mobile) or "Phone"
//   Most phone browsers include Mobile but NOT Phone
//   Some iPhone browsers include Phone but NOT Mobile
//   Some versions of Opera include Mobi but NOT Mobile, so we just use Mobi for our search string
//
// Seems to be no good way to check for cell phone, but if I just want to run my test code on my phone...
//
function isCellPhone( ) {
  return (navigator.userAgent.indexOf("Mobi") > 0) || (navigator.userAgent.indexOf("Phone") > 0);

  // Dom (dcode on youtube) uses the line below in his video "How to Easily Detect Mobile Devices with JavaScript"
  // return /Android|iPhone/i.test(navigator.userAgent);
}






//
