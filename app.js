var gpio = require('rpi-gpio');
 
gpio.setup(4, gpio.DIR_IN, readInput);
 
function readInput() {
    gpio.read(4, function(err, value) {
        console.log('The value is ' + value);
    });
}