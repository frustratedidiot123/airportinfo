'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');
var FAADataHelper = require('./faa_data_helper');

app.launch(function(req, res) {
  var prompt = 'For delay information, give me an Airport code.';
  var reprompt = 'Please tell me your Airport code';
  res.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

app.intent('airportinfo', {
  'slots': {
    'AIRPORTCODE': 'FAACODES'
  },
  'utterances': ['{|flight|airport} {|delay|status} {|info} {|for} {-|AIRPORTCODE}']
},
  function(req, res) {
    //get the slot
    var airportCode = req.slot('AIRPORTCODE');
    var reprompt = 'Tell me an airport code to get delay information.';
    if (_.isEmpty(airportCode)) {
      var prompt = 'I didn\'t hear an airport code. Please give me an airport code.';
      res.say(prompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    } else {
      var faaHelper = new FAADataHelper();

      //faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {
      return faaHelper.requestAirportStatus(airportCode).then(function(airportStatus) {
        console.log(airportStatus);
        res.say(faaHelper.formatAirportStatus(airportStatus)).send();
      }).catch(function(err) {
        console.log('err.statusCode: ',err.statusCode);
        var prompt = 'I don\'t have data for any ' + airportCode;
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      //return false;
    }
  }
);

alexaApp.intent("AMAZON.HelpIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
  var HELP_MESSAGE =  "To hear delay information for a particular airport, just tell me the Airport code. You can say stop to exit.";
var HELP_REPROMPT = "Tell me an airport code to hear about delays.";
 response.say(HELP_MESSAGE).reprompt(HELP_REPROMPT).shouldEndSession(false);
  }
 );

alexaApp.intent("AMAZON.StopIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Ok. Goodbye!").shouldEndSession(true);
  }
 );

alexaApp.intent("AMAZON.CancelIntent", {
  "slots": {} },
//"utterances": [ 
 //              "help", "help me"
  //              ]
//  },
  function(request, response) {
    response.say("Ok. Goodbye!").shouldEndSession(true);
  }
 );


// utterance hack
var utterancesMethod = app.utterances;
app.utterances = function () {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
