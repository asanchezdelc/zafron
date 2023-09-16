var Cayenne = require('cayennejs');

const TIME_INTERVAL = 5000; // 15 seconds

var options = {
  username: "test",
  password: "password",
  clientId: "83442730",
  broker: "localhost:1883"
};


var round = function(number, precision) {
    var factor = Math.pow(10, precision);
    var tempNumber = number * factor;
    var roundedTempNumber = Math.round(tempNumber);
    return roundedTempNumber / factor;
};

var getRandom = function() {
  return round(Math.random() * 100, 5);
}

var getTime = function() {
    return ((new Date()).getTime()) / 1000;
}

// Initiate MQTT API
// USE THE CORRCT ENVERIONMENT DETAILS
const cayenneClient = new Cayenne.MQTT(options);

cayenneClient.connect((err, mqttClient) => {

  console.log('%d - Connected', getTime());
  
  setInterval(function(){

      const below10 = getRandom() / 10;
      const motion = (below10 < 5) ? 1: 0;
   
      cayenneClient.kelvinWrite(12, below10);
      cayenneClient.luxWrite(10, getRandom());
      cayenneClient.celsiusWrite(11, getRandom());
      cayenneClient.rawWrite(9, motion);

    console.log('%d - Sending data ', getTime());

  }, TIME_INTERVAL);

  cayenneClient.on('error', function(err) {
      console.log()
  });

  // subscribe to data channel for actions (actuators)
  cayenneClient.on("cmd5", function(data) {
    console.log('Received...');
    console.log(data);
  });

});
