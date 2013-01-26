var express = require('express');
var DEFAULT_PORT = 4000;
app = express();
app.use(express.static(__dirname + '/public'));
app.listen(DEFAULT_PORT);
console.log('Listening on port ' + DEFAULT_PORT);