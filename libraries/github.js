//
//    github.js
//

//  20 Feb 2023  Created

let VersionGithubJS = "1.0";


//        DOCUMENTATION
//
//  Access github via api
//
//   https://medium.com/axlewebtech/upload-a-file-in-github-using-github-apis-dbb6f38cc63
//
// Github api token with repo scope
//   For RayWallacePhotos - RayWallacePhotos@GMail.com
//   30 days from 19 Feb 2023
//     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
//
// Create new tokens at https://github.com/settings/tokens
//   "Personal access tokens (classic) function like ordinary OAuth access tokens. They can be used instead
//   of a password for Git over HTTPS, or can be used to authenticate to the API over Basic Authentication."
//
// API ENDPOINTS
//    https://api.github.com/
//  Will list them all
//  i.e. https://api.github.com/emojis
//    Lists LOTS of github emoji png url's
//
// UPDATING : To update/replace a file, you need to provide the SHA for the file you will be replacing.
//            The easiest way would be to query github for that too. For example:
// > curl https://api.github.com/repos/{owner}/{repo}/contents/path_filename.ext
// returned json is {
//   "name": "test.txt",
//   "path": "test.txt",
//   "sha": "4f8a0fd8ab3537b85a64dcffa1487f4196164d78",
//   "size": 13,
//    ...
//  }
// So, you can see what the SHA is in the "sha" field of the JSON response. Use that when you formulate your request
// to update the file with a new version. After you have successfully updated the file, the
// file will have a new SHA that you will need to request before it can be updated again.
//
//
// File Create
//   PUT https://api.github.com//repos/{owner}/{repo}/contents/{path}
//
// File Update (simillar to create, but need to GET and send the SHA of the file)
//   PUT https://api.github.com//repos/{owner}/{repo}/contents/{path}
//
// File Delete
//   DELETE https://api.github.com//repos/{owner}/{repo}/contents/{path}
//
//
// Example query
//   https://api.github.com/repos/{owner}/{repo}/contents/{file name}
//
//   https://api.github.com/repos/RayWallacePhotos/necc/contents/MeetingsList.csv
//     Response json:
//      .name: "...."
//      .path: ".../...."
//      .download_url: "https://...."
//      .content:"......."
//      .encoding:"base64"
//      etc..
//
//   https://api.github.com/users?client_id=...&client_secret=...
//
//
//  headers: {
//   Authorization: `Token ${token}`,
//   'Content-Type': 'application/json'
//   accept: "application/vnd.github+json"    // Recomended data type (seems to be default)
//   // accept: "application/vnd.github.raw"  // Get "raw" file, instead of base64 encoded (only for BlOBS)
//  }
//
//
// let content = btoa( fileContents );  // Encode in base64
//
//    Authorization: `Token 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`,
//  ---OR---
//    Authorization: `Bearer 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`,
//
// options = {
//   method: 'PUT',
//   headers: {
//     Authorization:  `Token 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`,
//     'Content-Type': 'application/json'
//   },
//   data: JSON.stringify( { message: "Submitting file", content } )
// }
//
// Can add committer to the headers. Defaults to the authenticated user
//   committer: { name: "Ray", email: "HoudiniJr@GMail.com" },  // Defaults to the authenticated user
//
// fetch( 'https://api.github.com/repos/RayWallacePhotos/necc/contents/MeetingsList.csv', options )
// .then( response => response.json() )
// .then( json => {
//    console.log( json );
// } );
//


// A quick test
randomEmoji( );
setInterval( randomEmoji, 61 * 1000 );



//
//  Returns sha to callback()
//
//  Example call:
//    fileFromGitHub( "XXXMeetingsList.csv", "RayWallacePhotos", "necc", callback );
//
function fileShaGitHub( filename, user, repo, callback ) {
  options = {
    method: 'GET',
    headers: {
// BUG DEBUG FIX --- github revoked this peronal token, so it is NO longer useable
//        It was revoked because this file was part of a commit, which is a SECURITY issue!!!!!
//        I need to be reading this from a .env file (or simillar file that i add to .gitignore)
      Authorization:  `Token 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`, // Don't need this for reading, but allows 5000/hour instead of 60/hour
    }
  };

  // GET The file to github
  fetch( `https://api.github.com/repos/${user}/${repo}/contents/${filename}` , options )
  .then( response => response.json() )
  .then( jsonObj => {
     callback( jsonObj.sha );
  } );
}



//
//  Example call:
//    fileFromGitHub( "XXXMeetingsList.csv", "RayWallacePhotos", "necc" );
//
function fileFromGitHub( filename, user, repo ) {
  let options = {
    method: 'GET',
    headers: {
      Authorization:  `Token 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`, // Don't need this for reading, but allows 5000/hour instead of 60/hour
      // accept: "application/vnd.github+json"      // Recomended data type (seems to be default)
      // accept: "application/vnd.github.raw+json"  // Get "raw" file, instead of base64 encoded (only for BlOBS)
    }
  };

  // GET The file to github
  fetch( `https://api.github.com/repos/${user}/${repo}/contents/${filename}` , options )
  .then( response => {
    console.log( `${response.headers.get("x-ratelimit-remaining")} requests left of ${response.headers.get("x-ratelimit-limit")}/hour` );
    if( !response.headers.get("x-ratelimit-remaining") ) console.log( `Wait ${response.headers.get("x-ratelimit-reset")}`);
    else console.log( `Time left in the ratelimit hour ${response.headers.get("x-ratelimit-reset")/1000/60/60}`);

    return response.json();
  } )
  .then( jsonObj => {
     // console.log( jsonObj );
     console.log( `name: ${jsonObj.name}, size: ${jsonObj.size/1024}kb, type: ${jsonObj.type}` );
     console.log( `path: ${jsonObj.path}, sha: ${jsonObj.sha}` );
     console.log( atob(jsonObj.content) );
  } );
}


//
//  Example call:
//    let fileContents = "Hello.\nFrom me to you.\nThat is all I have to say.\n";
//    fileToGitHub( "XXXMeetingsList.csv", "RayWallacePhotos", "necc", fileContents );
//
function fileToGitHub( filename, user, repo, content, sha = null ) {
  let body = {
    message: "API Test upload file to repo",
   // committer: { name: "Ray", email: "HoudiniJr@GMail.com" },        // Defaults to the authenticated user
    content: btoa(content)
  };
  if( sha ) body.sha = sha;  // Need to GET SHA of file in order to update an existing file

//  console.log( "body: ", body );

  let options = {
    method: 'PUT',
    headers: {
      Authorization:  `Token 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`, // Ether "Token ..." OR "Bearer ..."
      'Content-Type': 'application/json',
    },
    body : JSON.stringify( body )
  };

//  console.log( "options: ", options );

  // PUT The file to github
  fetch( `https://api.github.com/repos/${user}/${repo}/contents/${filename}`, options )
  // .then( response => response.json() )
  .then( response => response.json() )
  .then( jsonObj => {
     console.log( jsonObj );
  } );
}


function fileFromGitHubOnClick( event ) {
  let filename = "XXXMeetingsList.txt";
  let user = "RayWallacePhotos";
  let repo = "necc";

  fileFromGitHub( filename, user, repo );
}


function fileToGitHubOnClick( event ) {
  let fileContents = "Now I see!\nSay what!???\nHello.\nFrom me to you.\nThat is all I have to say.\n";
  let filename = "XXXMeetingsList.txt";
  let user = "RayWallacePhotos";
  let repo = "necc";

  fileShaGitHub( filename, user, repo, sha => {
    fileToGitHub( filename, user, repo, fileContents, sha );
  } );
}


function randomEmoji( ) {
  let url = "https://api.github.com/emojis";

  fetch( url )
  .then( response => response.json() )
  .then( json => {
    let keys = Object.keys( json );
    let index = Math.floor( Math.random() * keys.length );
    let emojiUrl = json[keys[index]];

    RandomEMojiID.src = emojiUrl;
  });

  // requestAnimationFrame( randomEmoji );

}


// Get a list of ALL top level files (.type == "file") and directories (.type == "dir") with:
//  https://api.github.com/repos/RayWallacePhotos/necc/contents/

// Get a list of ALL subdirectory files (.type == "file") and it's directories (.type == "dir") with:
//  https://api.github.com/repos/RayWallacePhotos/necc/contents/sub_directory






//
