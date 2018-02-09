 // Connecting to ROS
  // -----------------
var ros;

  ros = new ROSLIB.Ros({
    url : 'ws://' + window.location.hostname + ':9090'
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });
  
  // Subscribing to a Topic
  // ----------------------

var listenering = new ROSLIB.Topic({
   ros          : ros,
   name         : 'battery_percentage',
   messageType  : 'std_msgs/Float32'
 });



listenering.subscribe(function(message) {
    //console.log( 'Received message on ' + listenering.name + ': ' + message.data);
    document.getElementById("batteryValue").innerHTML = (message.data.toFixed(2) + ' %');
 });