var dataKeys = require("./keys.js");
var fs = require("fs");
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

//setting commands to run LIRI 
var userCommand = function(caseData, functionData) {
  switch (caseData) {
    case 'my-tweets':
      myTweets();
      break;
    case 'spotify-this-song':
      mySpotify(functionData);
      break;
    case 'movie-this':
      myMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
      console.log('LIRI doesn\'t know that');
  }
}//end of commands

//calling user tweets to be displayed
var myTweets = function() {
  var client = new twitter(dataKeys.twitterKeys);

  var params = { screen_name: 'joshuascottwood', count: 10 };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    if (!error) {
      var data = []; //empty array to hold data

      for (var i = 0; i < tweets.length; i++) {
        data.push({

            'created at: ' : tweets[i].created_at,
            'Tweets: ' : tweets[i].text,
        });
      }
      console.log(data);
      writeLog(data);
    }
  });
};//end myTweets function

//calling spotify to properly display artist name 
var getArtistNames = function(artist) {
  return artist.name;
};//end getArtistNames function

//calling spotify to find songs
var mySpotify = function(songName) {

  //If a song or artist isn't specified, will auto find Shakira's Whenever, Wherever
  if (songName === undefined) {

    songName = 'Whenever, wherever';
  };

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }

    var songs = data.tracks.items;
    var data = []; //empty array to hold data

    for (var i = 0; i < songs.length; i++) {
      data.push({
        'artist(s)': songs[i].artists.map(getArtistNames),
        'song name: ': songs[i].name,
        'preview song: ': songs[i].preview_url,
        'album: ': songs[i].album.name,
      });
    }
    console.log(data);
    writeLog(data);
  });
};//end mySpotify function

//calling omdb to return movie title info
var myMovie = function(movieName) {

  if (movieName === undefined) {
    movieName = "Howl's Moving Castle";
  }

  var movieURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&r=json";

  request(movieURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = [];
      var jsonData = JSON.parse(body);

      data.push({
      'Title: ' : jsonData.Title,
      'Year: ' : jsonData.Year,
      'Rated: ' : jsonData.Rated,
      'IMDB Rating: ' : jsonData.imdbRating,
      'Country: ' : jsonData.Country,
      'Language: ' : jsonData.Language,
      'Plot: ' : jsonData.Plot,
      'Actors: ' : jsonData.Actors,
      'Rotten Tomatoes Rating: ' : jsonData.tomatoRating,
      'Rotton Tomatoes URL: ' : jsonData.tomatoURL,
  });
      console.log(data);
      writeLog(data);
}
  });

}//end myMovie function

//function to run command stored in random.txt file
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
    writeToLog(data);
    var dataArr = data.split(',')

    if (dataArr.length == 2) {
      pick(dataArr[0], dataArr[1]);
    } else if (dataArr.length == 1) {
      pick(dataArr[0]);
    }

  });
}//end of doWhatItSays function

//will update log.txt file will results from user search
var writeLog = function(data) {
  fs.appendFile("log.txt", '\r\n\r\n');

  fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    if (err) {
      return console.log(err);
    }

    console.log("log.txt was updated!");
  });
}//end writeToLog function

//will run on load of js file
var load = function(argOne, argTwo) {
  userCommand(argOne, argTwo);
};

load(process.argv[2], process.argv[3]);