var fs = require("fs");
var https = require("https");
var http = require("http");
var icalendar = require("icalendar");

var calendarStr = "";
var tmpData = "";

const timeInterval = 1000 * 60 * 60 * 6; // 1 day

const Port = 10888;

var options = {
  hostname: 'planif.esiee.fr',
  path: '/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=3346,5234,5235,5236,5237,5534,5535&projectId=0&calType=ical&nbWeeks=4',
  method: 'GET'
};

var timer = setInterval(fetchCalendar, timeInterval);

fetchCalendar();

function fetchCalendar(){
  var req = https.request(options, function(res) {
    console.log("statusCode: ", res.statusCode);
    //console.log("headers: ", res.headers);

    res.on('data', function(d) {
      tmpData += d.toString('utf-8');
    });
    res.on('end', function(){
      calendarStr = tmpData;
      tmpData = "";
    });
  });
  req.end();

  req.on('error', function(e) {
    console.error(e);
  });
}

var server = http.createServer(function(request, response){
  console.log("received request");
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Request-Method', '*');
  response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  response.setHeader('Access-Control-Allow-Headers', '*');
  response.end(calendarStr);
});

server.listen(Port, function(){
  console.log("Server listening on port : " + Port);
});