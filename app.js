/*jshint node:true*/

// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express'),
	routes = require('./routes'),
	_post = require('./routes/_post'),
	http = require('http'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
  fs = require('fs'),
  busboy = require('connect-busboy');

// setup middleware
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(busboy());
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var mongoUrl;

if(process && process.env && process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  for (var svcName in vcapServices) {
    if (svcName.match(/^mongo.*/)) {
      mongoUrl = vcapServices[svcName][0].credentials.uri;
      mongoUrl = mongoUrl || vcapServices[svcName][0].credentials.url;
      break;
    }
  }
} 
else {
  mongoUrl = "localhost:27017/FordSessions";
}

mongoose.connect(mongoUrl);

var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

var host = (process.env.VCAP_APP_HOST || 'localhost');

var port = (process.env.VCAP_APP_PORT || 3000);

app.get('/', routes.index);
app.get('/api/GET/dirs', _post.getDirs);
app.get('/api/GET/dirs/:dirId', _post.getFilesForDir);
app.get('/api/GET/', _post.getAll);
app.get('/api/GET/file/:fileId', _post.getFile);
app.post('/api/addFolder', _post.addFolder);
app.post('/api/DELETE/:fileId',_post.deleteFile);

app.post('/upload', _post.upload);

 
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");

var services = JSON.parse(process.env.VCAP_SERVICES || "{}");

var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('App started on port ' + port);