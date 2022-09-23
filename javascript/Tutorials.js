//
//	        Tutorials.js
//
//        Misc Helper Classes and functions
//
//  19 Sep 2022 	Created
//



function tutorialsInit( pageName ) {
  let container = document.querySelector( ".Tutorials" );

  fileReadText( `${pageName()}/TutorialList.txt`, textObj => {
    container.innerHTML = textObj.text.split("\n")[0];
    let htmlFile = textObj.text.split("\n")[0];

    fileReadText( `${pageName()}/${htmlFile}`, textObj => {
      container.innerHTML = textObj.text;
    } );
  } );
}


function showTutorials( ) {


}











//
