'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var app = new Alexa.app('airportinfo');
var FAADataHelper = require('./faa_data_helper');

app.launch(function(req, res) {
  var prompt = 'For delay information, tell me an Aiport code.';
  var reprompt = 'Tell me an Aiport code';
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
      var prompt = 'I didn\'t hear an airport code. Tell me an airport code.';
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
        var prompt = 'I don\'t have data for an airport code of ' + airportCode;
        res.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
      });
      //return false;
    }
  }
);

// utterance hack
var utterancesMethod = app.utterances;
app.utterances = function () {
  return utterancesMethod().replace(/\{\-\|/g, '{');
};

module.exports = app;
