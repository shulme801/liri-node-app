/* The Language Interpretation and Response Interface (LIRI) is a node.js app that is run from the *NIX command line. 
   takes in a command (limited to the 4 items discussed below), and command parameters.
   LIRI then uses the appropriate API to retrieve the desired data from an external data source, and 
   outputs the data to the bash console.  

   Each command run and the data that has been displayed are output to a file called log.txt. This is a "cumulative" log in which
   data from new commands is appended to the file (nothing is overwritten). In a production environment, a log rotation facility 
   is needed to keep the log file from filling up the disk.  

   LIRI responds to 4 valid input commands. These valid input commands are
   -- my-tweets: return the last 20 tweets I've sent and the date stamp for each.
   -- spotify-this-song, followed by a song name: This command will show the folling info about a song in the bash window:
 		 Artist(s)
         The song's name
         A preview link of the song from Spotify
         The album that the song is from
         If no song is found, we'll default to "The Sign" by Ace of Base.
   -- movie-this, followed by a movie name: 
	   * Title of the movie.
	   * Year the movie came out.
	   * IMDB Rating of the movie.
	   * Rotten Tomatoes Rating of the movie.
	   * Country where the movie was produced.
	   * Language of the movie.
	   * Plot of the movie.
	   * Actors in the movie.

	   If no movie found, we'll default to 'Mr. Nobody.'
   -- do-what-it-says:  The app (using the fs node package) will open the random.txt file, read the contents, and
       use the contents to call one of the other three commands ("my-tweets", "spotify-this-song", or "movie-this").

   

*/ 


var keys 	  = require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs 		  = require('fs');


var tClient = new twitter({
	consumer_key:        keys.consumer_key,
	consumer_secret:     keys.consumer_secret,
	access_token_key:    keys.access_token_key,
	access_token_secret: keys.access_token_secret 
});

var screenName = {screen_name: 'Real_SteveHulme'};
var dividerLine = "\n++++++++++++++++++++++++\n";

/* grab the command line parameters from the process.argv array.  The first element is the node command and the second is the file name of this file
   the actual Liri command we're interested in is at index 2 in the argv array. Following the Liri command will be the
   command's parameters (e.g., name of the song to spotify or name of the movie to put out the info for). We'll look for those parms
   when we process the Liri command.
*/

var cmdLineParams  = process.argv;
var liriCommandPos = 2;
var liriParamPos   = 3;

var nodeParams = process.argv; // Copy those arguments off the command line.
var liriCommand = cmdLineParams[liriCommandPos]; //Save off the command to Liri
console.log("liriCommand is "+liriCommand);
var liriParams = "";


// Spotify info
//Client ID af17d5b6dd4441abb9980e095aae3ac9
//Client Secret 516c037d3f5448fab7918e5d402dc910


switch(liriCommand) {
	case "my-tweets":
		 showTweets();
		 break;

	case "spotify-this-song":
		if (nodeParams.length <= 3) { // there's no 4th argument on cmd line, so we know user forgot to give us song info
			forgotParameter(liriCommand);
		} else {
			grabLiriParams(nodeParams); //Pass the command line arguments into the function that going to build the Liri parm string
			time2Spotify(liriParams); // Now that we have the liri command parameters (that is, song info), let's call Spotify
		}
		
		break;

	case "movie-this":
		if (nodeParams.length <= 3) { // there's no 4th argument on cmd line, so we know user forgot to give us movie info
			forgotParameter(liriCommand);
		} else {
			grabLiriParams(nodeParams); //Pass the command line arguments into the function that going to build the Liri parm string
			getOMDBData(liriParams); // Now that we have the liri command parameters (that is, movie info), let's call OMDB
		}
		break;

	case "do-what-it-says":
		doCommand();
		break;

	default:
		console.log("Unknown command entered");
		console.log("Please enter one of the following commands");
		console.log("my-tweets, spotify-this-song, movie-this, do-what-it-says");
		break;
}

function forgotParameter(liriCommand) {
		console.log("Error -- command is "+liriCommand+" but no parameter supplied");
		console.log("Try again!");
}

function grabLiriParams() {

	liriParams = cmdLineParams[3];

	liriParams = cmdLineParams[liriParamPos]; //get that first parameter word from cmdLineParams
	for (var i=liriParamPos+1; i<cmdLineParams.length; i++){ //start at second work in the parameter (if there is on)
		liriParams += " "+cmdLineParams[i];
	}

	console.log("liriParams is ")+liriParams;

}

function logIt (logString){
        //adds text to log.txt file
        fs.appendFile('log.txt', logString,function(err) {
          if (err) throw err;
        });
}

function showTweets(){
  //Display last 20 Tweets and their dates

  tClient.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@Real_SteveHulme: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log(dividerLine);
        logString = "@Real_SteveHulme: " + tweets[i].text + " Created At: " + date.substring(0, 19)+dividerLine;
        logIt(logString);
      }
    }else{
      console.log('Error occurred');
    }
  });
}



function time2Spotify(song) {
	
  spotify.search({ type: 'track', query: song}, function(error, data){
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++){
        var songData = data.tracks.items[i];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
        
        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name,(err) => {
        	if (err) throw err;
        });
        fs.appendFile('log.txt', songData.name,(err) => {
        	if (err) throw err;
        });
        fs.appendFile('log.txt', songData.preview_url, (err) => {
        	if (err) throw err;
        });
        fs.appendFile('log.txt', songData.album.name,(err) => {
        	if (err) throw err;
        });
        fs.appendFile('log.txt', "-----------------------", (err) => {
        	if (err) throw err;
        });
      }
    } else{
      console.log('Error occurred.');
    }
  });
}

function getOMDBData(){

}

function doCommand() {

}



// tClient.post('statuses/update', {status: 'I Love Twitter'},  function(error, tweet, response) {
// if(error) throw error;
// console.log(tweet);  // Tweet body. 
// console.log(response);  // Raw response object. 
// });

//request('http://www.google.com', function (error, response, body) {
//  console.log('error:', error);
//  console.log('statusCode:', response && response.statusCode); 
//});
