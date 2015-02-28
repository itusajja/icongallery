// Require node dependencies
var http = require('http');
var readline = require('readline');

// Kick off
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});



//askForItunesLink();
// alsdkfjalksjdfhlakjsdf
function prompt(key, cb) {
  rl.question(key + ': ', function(input) {
    cb(input, key);
  });
}
//var args = ['icon-designer', 'icon-designer-url', 'tags'];
// prompt('icon-designer', addToPost);
// prompt('icon-designer-url', addToPost);
askForItunesLink();

function addToPost(input, key) {
  if(input != '') {
    post[key] = input;
  }
  console.log(post);
}
function addDesignerToPost(input) {
  addToPost(input, 'icon-designer');
  prompt('Designer URL: ', addDesignerUrlToPost);
}
function addDesignerUrlToPost(input) {
  addToPost(input, 'icon-designer-url');
  prompt('Tags (space separated):', addTagsToPost);
}
function addTagsToPost(input) {
  addToPost(input, 'tags');
  console.log(post);
}

// Red Function for console
function red(str) {
  return '\x1b[31m' + str + '\x1b[0m';
}

// Globals
var post = {};
// var post = {
//     "title": "",
//     "slug": "",
//     "date": "",
//     "category": "",
//     "itunes-url": "",
//     "app-developer": "",
//     "app-developer-url": "",
//     "icon-designer": "",
//     "icon-designer-url": "",
//     "tags": "",
// };

var itunes = {
  'url': '',
  'id': '',
  'response' : {}
}

function askForItunesLink() {
  rl.question("What's the iTunes ID or URL: ", function(input) {
    if(inputIsValid(input)) {
      makeItunesRequest(itunes.id);
    }
    else {
      askForItunesLink();
    }
  }); 
}

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
      itunes.response = response.results[0];
      createPost();
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


function createPost() {
  
  post['date'] = (function(){
    function pad(n) {return n<10 ? '0'+n : n}
    var d = new Date();
    var year = pad(d.getFullYear());
    var month = pad(d.getMonth() + 1);
    var day = pad(d.getDate());
    return year + '-' + month + '-' + day;
  })();

  post['slug'] = (function(){
    // Url
    var url = itunes.response.trackViewUrl;

    // Starting point
    var start = url.search('/app/'); // look for `/app/`
    start += 5; // offset the result by the length of `/app/`, i.e. 5
    
    // Ending point
    var id = url.match(/\/id([0-9]+)/); // returns ['/id343200656', '343200656']
    var end = url.search(id[0]);

    // Return what's inbetween start and end
    // i.e. what's between `/app/` and `/id9348818`
    return url.substring(start, end);
  })();

  if(itunes.response.trackName) {
    post['title'] = itunes.response.trackName;
  }
  
  if(itunes.response.primaryGenreName) {
    post['category'] = itunes.response.primaryGenreName;
  }

  if(itunes.response.trackViewUrl) {
    post['itunes-url'] = itunes.response.trackViewUrl;
  }

  if(itunes.response.artistName) {
    post['app-developer'] = itunes.response.artistName;
  }

  if(itunes.response.sellerUrl){
    post['app-developer-url'] = itunes.response.sellerUrl;
  }

  // if(createPostIconDesigner()) {
  //   post['icon-designer'] = createPostIconDesigner();
  // }

  post['icon-designer'] = (function(){
    rl.question("icon-designer: ", function(input) {
      if(input != '') {
        post['icon-designer'] = input;
        rl.question("icon-designer-url: ", function(input) {
          post['icon-designer-url'] = input;
        });
      }
    });
  })();

  post['tags'] = (function(){
    rl.question("tags (space separated): ", function(input) {
      if(input != '') {
        post['tags'] = input;
      }
    });
  })();

  


  //createPostIconDesigner();
  rl.close();
  
  afterMakePost();
}

function afterMakePost() {
  console.log(post);
}

function createPostIconDesigner() {
  rl.question("Icon designer: ", function(input) {
    if(input != '') {
      post['icon-designer'] = input;
      
      rl.question("Icon designer URL: ", function(input) {
        post['icon-designer-url'] = input;
        afterIconDesigner();
      });
    } else {
      afterIconDesigner();
    }
  });
}

function afterIconDesigner() {
  console.log(post);
}