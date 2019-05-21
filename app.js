var express = require('express');
var app = express();
var path = require('path');
app.set('port', 4200);

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log("Listening on port " + port);
}, 'localhost');

console.log("Starting the app on port " + app.get('port'));