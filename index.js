var fs = require('fs');
const { request } = require('http');
var fetch = require('node-fetch'); // requires node-fetch as dependency

// adapted from: https://gist.github.com/tanaikech/40c9284e91d209356395b43022ffc5cc

// set filename
var upfile = 'image.jpg';

// set auth token and query
var API_KEY = "YourSuperSecretAPIkey"
var query = 'mutation ($file: File!, $itemId: ItemId!, $columnId: columnId!) { add_file_to_column (file: $file, item_id: $itemId, column_id: $columnId { id } }';
var variables = {"itemId": 1104589433,"columnId":"files"};

// set URL and boundary
var url = "https://api.monday.com/v2/file";
var boundary = "xxxxxxxxxx";
var data = "";

fs.readFile(upfile, function(err, content){

    // simple catch error
    if(err){
        console.error(err);
    }

    // construct query part
    data += "--" + boundary + "\r\n";
    data += "Content-Disposition: form-data; name=\"query\"; \r\n";
    data += "Content-Type:application/json\r\n\r\n";
    data += "\r\n" + query + "\r\n";
    data += "Content-Disposition: form-data; name=\"variables\"; \r\n";
    data += "Content-Type:application/json\r\n\r\n";
    data += "\r\n" + variables + "\r\n";

    // construct file part
    data += "--" + boundary + "\r\n";
    data += "Content-Disposition: form-data; name=\"variables[file]\"; filename=\"" + upfile + "\"\r\n";
    data += "Content-Type:application/octet-stream\r\n\r\n";
    var payload = Buffer.concat([
            Buffer.from(data, "utf8"),
            new Buffer.from(content, 'binary'),
            Buffer.from("\r\n--" + boundary + "--\r\n", "utf8"),
    ]);

    // construct request options
    var options = {
        method: 'post',
        headers: {
          "Content-Type": "multipart/form-data; boundary=" + boundary,
          "Authorization" : API_KEY
        },
        body: payload,
    };

    // make request
    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json));
});
