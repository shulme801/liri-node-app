# #LIRI README#
## Overview
The Language Interpretation and Response Interface (LIRI) is a node.js app that is run from the *NIX command line. 

LIRI takes in a command (limited to the 4 items discussed below), and command parameters. LIRI then uses the appropriate API to retrieve the desired data from an external data source, and outputs the data to the bash console.  

Each command that has been run, and the data that has been displayed, are output to a file called log.txt. This is a "cumulative" log in which data from new commands is appended to the file (nothing is overwritten).
In a production environment, a log rotation facility  is needed to keep the log file from filling up the disk.  
## Command Syntax
LIRI responds to 4 valid input commands. These valid input commands are

*   ***my-tweets***: return the last 20 tweets I've sent and the date stamp for each.
*   ***spotify-this-song***, followed by a song name: This command will show the following info about a song in the bash window:
			* Artist(s)
			* The song's name
			* A preview link of the song from Spotify
			* The album that the song is from
         If no song is found, we'll default to "The Sign" by Ace of Base.
* ***movie-this***, followed by a movie name: 
		* Title of the movie.
		* Year the movie came out.
		* IMDB Rating of the movie.
		* Rotten Tomatoes Rating of the movie.
		* Country where the movie was produced.
		* Language of the movie.
		* Plot of the movie.
		* Actors in the movie.
			* If no movie found, we'll default to 'Mr. Nobody.'
	* ***do-what-it-says:***  The app (using the fs node package) will open the random.txt file in the same directory, read the contents, and use the contents to call one of the other three commands ("my-tweets", "spotify-this-song", or "movie-this").

## Technology Used
* Node.js
* NPM packages
	* twitter
	* spotify
	* request (to get the Open Movie DB information)
	* fs (for file manipulations — including opening, reading, appending)

## Author
Steve Hulme

