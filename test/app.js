
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, user = require('./routes/user')
, http = require('http')
, path = require('path');
var gpio = require('rpi-gpio');

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);



var server = http.createServer(app);
server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	
		setInterval(function(){
			gpio.setup(7, gpio.DIR_IN, readInput);
			function readInput() {
				gpio.read(7, function(err, value) {
					socket.emit('value', value);
				});
			}
		}, 5000);
	});

//	var subscribe = io.of('/subscribe');

//	subscribe.on('connection', function (socket) {
//	console.log('connected');
//	})

	function onError(error) {
		throw error;
	}

	function onListening() {
		console.log('Listening on ' + 'Port ' + 3000);
	}