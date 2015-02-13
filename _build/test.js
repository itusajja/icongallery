// Require node dependencies
var http = require('http');
var readline = require('readline');

function red(str) {
  return '\x1b[31m' + str + '\x1b[0m';
}

// Globals
var post = {
    "title": "",
    "slug": "",
    "date": "",
    "category": "",
    "itunes-url": "",
    "app-developer": "",
    "app-developer-url": "",
    "icon-designer": "",
    "icon-designer-url": "",
    "tags": ""
};
var itunes = {
  'url': '',
  'id': ''
}

askForItunesLink();

function askForItunesLink() {
  
  function inputIsValid(input) {
    // Trim any whitespace
    input = input.trim();

    // Test if input begins with http://itunes.apple.com
    var itunesRegex = /^(http|https):\/\/itunes.apple.com/;
    if(itunesRegex.test(input)) {
      // Extract the ID from the itunes link
      var idRegex = /\/id(\d+)/;
      if(idRegex.test(input)) {
        var id = idRegex.exec(input); // returns array like ['/id342', '342']
        itunes.url = input;
        itunes.id = id[1];
        return true;
      } else {
        console.error(red('Cannot find an app ID in that URL. Try again.'));
        return false;
      }
    } 
    else {
      console.log(red('Not an iTunes URL. Try again.') + ' Follow this pattern: https://itunes.apple.com/us/app/angry-birds/id343200656');
      return false;
    }
  }

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.question("What's the iTunes ID or URL: ", function(input) {
    if(inputIsValid(input)) {
      console.log(itunes);
      makeItunesRequest(itunes.id);
    }
    else {
      askForItunesLink();
    }
  });
}

function makeItunesRequest(id) {
  var options = {
    host : 'itunes.apple.com',
    path : '/lookup?id=' + id
  }
  var request = http.request(options, function(response){
    var body = ""
    response.on('data', function(data) {
      body += data;
    });
    response.on('end', function() {
      var data = JSON.parse(body);
      validateItunesResponse(data);
    });
  });
  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
  request.end();
}

function validateItunesResponse(response) {
  if(response.results.length === 1 ) {
    if(typeof response.results[0].artworkUrl512 === 'string') {
      handleValidItunesResponse(response.results[0]);
    } else {
      console.log(response);
      console.error(red('Weird. No artwork exists for this response. Check your URL & try again.'));
      askForItunesLink();
    }
  } else {
    console.log(response);
    console.error(red('Weird. An incorrect number of responses was returned by iTunes. Check your URL & try again.'));
    askForItunesLink();
  }
}

// Format the date how we want
// use pad() to add leading zeros
function getDateToday() {
  function pad(n) {return n<10 ? '0'+n : n}
  var d = new Date();
  var year = pad(d.getFullYear());
  var month = pad(d.getMonth() + 1);
  var day = pad(d.getDate());
  return year + '-' + month + '-' + day;
}

/* 
  Search the url for the iTunes slug, i.e. in this string:
  https://itunes.apple.com/us/app/angry-birds/id343200656
  We find `angry-birds`
*/
function getSlug(url) {
  // Starting point
  var start = url.search('/app/'); // look for `/app/`
  start += 5; // offset the result by the length of `/app/`, i.e. 5
  
  // Ending point
  var id = url.match(/\/id([0-9]+)/); // returns ['/id343200656', '343200656']
  var end = url.search(id[0]);

  // Return what's inbetween start and end
  // i.e. what's between `/app/` and `/id9348818`
  return url.substring(start, end);
}

function handleValidItunesResponse(app) {
  post['date'] = getDateToday();
  post['slug'] = getSlug(app.trackViewUrl);
  post['title'] = app.trackName;
  post['category'] = app.primaryGenreName;
  post['itunes-url'] = app.trackViewUrl;
  post['app-developer'] = app.artistName;
  post['app-developer-url'] = app.sellerUrl;
  console.log(post);
}