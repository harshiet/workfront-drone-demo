var arDrone = require('ar-drone');
var client = arDrone.createClient({'ip': '192.168.1.12'});
client.ftrim()
client.stop();
client.land();
client.ftrim()

