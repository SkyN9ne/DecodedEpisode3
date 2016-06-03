var express = require('express');
var app = express();
var url = require('url');
var request = require('request');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 9001));

app.get('/', function(req, res){
  res.send('It works!');
});

app.post('/meme', function(req, res){
  var commandtext = req.body.text;
  console.log(commandtext);
  var cmds = commandtext.split(';');
  console.log(cmds);
  var name = cmds[0];
  var toptext = cmds[1];
  var bottomtext = cmds[2];
  console.log(name);
  console.log(toptext);
  console.log(bottomtext);
  if(name == "templates"){
    var parsed_url = url.format({
      pathname: 'http://memegen.link/templates'
    });

    request(parsed_url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        var jsonobj = JSON.parse(body);
        var links = "";
        for (var key in jsonobj) {
          links += key + "\n";
        }
        var result = {
            "text": links
        }
        res.send(result);
      }
    });
    
  }else{
      var parsed_url = url.format({
        pathname: 'http://memegen.link/templates'
      });

      request(parsed_url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          var jsonobj = JSON.parse(body);
          var link = "";
          console.log("start");
          
          for (var key in jsonobj) {
            if(key.toUpperCase() == name.toUpperCase()){
                link = jsonobj[key] + "/" + toptext + "/" + bottomtext;
            }
          }
          console.log(link);
          request(link, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              var jsonobj = JSON.parse(body);
              var imglink = jsonobj.direct.visible;
              console.log(imglink);
              var result = {
                      "parse": "full",
                      "response_type": "in_channel",
                      "attachments":[
                          {
                              "image_url": imglink
                          }
                      ],
                      "unfurl_media":true,
                  "unfurl_links":true
              }
              res.send(result);
            }
          });
        }
    });
  }
  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
