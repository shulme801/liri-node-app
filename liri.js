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


var keys 	= require('./keys.js');
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs 		= require('fs');

// console.log(keys.consumer_key);
// console.log(keys.consumer_secret);
// console.log(keys.access_token_key);
// console.log(keys.access_token_secret);

var tClient = new twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret 
});

/* grab the command line parameters.  The first is the node command and the second is the file name of this file
   the actual Liri command we're interested in is at index 2 in the argv array. Following the Liri command will be the
   command's parameters (e.g., name of the song to spotify or name of the movie to put out the info for).
*/



// Spotify info
//Client ID af17d5b6dd4441abb9980e095aae3ac9
//Client Secret 516c037d3f5448fab7918e5d402dc910
var nodeParams = process.argv;
var command = process.argv[2];

showTweets();


function showTweets(){
  //Display last 20 Tweets and their dates

  var screenName = {screen_name: 'Real_SteveHulme'};

  tClient.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@Real_SteveHulme: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFile('log.txt', "@Real_SteveHulme: " + tweets[i].text + " Created At: " + date.substring(0, 19),(err) => {
        	if (err) throw err;
        });
      }
    }else{
      console.log('Error occurred');
    }
  });
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
