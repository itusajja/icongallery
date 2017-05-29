function getJSON(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      callback(data);
    } else {
      console.log('Target server reached, but returned error: ', request.status, request.statusText);
    }
  };

  request.onerror = function() {
    console.log('There was a connection error of some sort.', request.status, request.statusText)
  };

  request.send();
}

module.exports = getJSON;