import fs from 'fs';
import request from 'request';
import path from 'path';
import prompt from 'prompt';

// Take a watchOS image URL
// http://is4.mzstatic.com/image/thumb/Purple128/v4/59/27/c2/5927c2c8-4ff4-4488-8d51-31682f3b26e3/source/399x399bb.jpg
// And fetch the 1024 PNG version of it then write to file

prompt.start();
prompt.get(['imgUrl', 'imgFilename'], (err, result) => {  
  download(
    result.imgUrl.replace('399x399', '1024x1024').replace('.jpg', '.png'),
    path.resolve('../../../img/1024/' + result.imgFilename),
    () => { console.log('saved!') }
  );
});


function download(uri, file, callback) {
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(file)).on('close', callback);
  });
};