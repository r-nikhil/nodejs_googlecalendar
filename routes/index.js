var express = require('express');
var router = express.Router();
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
// var googleAuth = require('google-auth-library');
// var auth = new googleAuth();
var urls = require('url')
var redirect_url = "http://localhost:3000/all"
var client_id = "521694941079-0ejb07oln59cha748p1atv69029bs4q8.apps.googleusercontent.com"
var client_secret = "C2TJAse90baRiLVJ1IzMyApM"
var oauth2Client = new OAuth2(client_id, client_secret, redirect_url);
google.options({ auth:oauth2Client});

// var oauth2Client = new OAuth2(client_id, client_secret, redirect_url);
// var gcal = require('google-calendar');

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/calendar'
];

/* GET home page. */
router.get('/', function(req, res, next) {
// res.render('index', { title: 'Express' });

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
  scope: scopes // If you only need one scope you can pass it as string
});
res.redirect(url);
// store the access token somewhere in the database, then redirect to /all
});
//----------------------------------------------------------------
router.get('/all', function(req,res,next){

// var obj = $.parseJSON(code);
// res.send(req.query.code);
code = req.query.code;
oauth2Client.getToken(code, function(err, tokens) {
	if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      else{
      oauth2Client.setCredentials(tokens);
      res.json(tokens);
      // res.redirect('/calendar');
}
  // Now tokens contains an access_token and an optional refresh_token. Save them.
// if(!err) {
//     oauth2Client.setCredentials(tokens);
//   }
// a= tokens[access_token];
// res.send(a);
// res.send(tokens);
});


 
});

router.get('/calendar', function(req,res,next){
var max = "2020-06-03T10:00:00-07:00"
var min = "2000-06-03T10:00:00-07:00"
function listEvents() {
  var calendar = google.calendar('v3');
  calendar.events.list({
    calendarId: 'primary',
    // timeMin: (new Date()).toISOString(),
    // timeMax: max,
    // timeMin: min,
    maxResults: 1500,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    res.json(events);
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming time events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
    }
  });
}
 
listEvents();

});






module.exports = router;
