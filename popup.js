var mainTitle, textReport, detailedReport, date, temp, dew, wind_dir, wind_speed, win_gust;
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

window.onload = function() {
  mainTitle = document.getElementById("main-title");
  textReport = document.getElementById("text-report");
  detailedReport = document.getElementById("detailed-report");
  date = document.getElementById("detailed-date");
  temp = document.getElementById("detailed-temp");
  dew = document.getElementById("detailed-dew");
  wind_dir = document.getElementById("detailed-wind-dir");
  wind_speed = document.getElementById("detailed-wind-speed");
  wind_gust = document.getElementById("detailed-wind-gust");

  document.body.addEventListener("click", function() {
    document.body.style.height = "500px";
    detailedReport.style.display = "block";
  });

  var result = httpGet("https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=LFMT&hoursBeforeNow=1");
  parseReport(result);
}

/*
* Takes the result from the HTTP request and extracts all the information
*/
function parseReport(report) {
  parser = new DOMParser();
  xmlDoc = parser.parseFromString(report,"text/xml");
  var metar = xmlDoc.getElementsByTagName("METAR")[0];

  mainTitle.innerHTML = "METAR report for " + metar.getElementsByTagName("station_id")[0].childNodes[0].nodeValue;

  // RAW REPORT
  textReport.innerHTML = metar.getElementsByTagName("raw_text")[0].childNodes[0].nodeValue;

  /*
  * DETAILED REPORT *
  */

  // DATE
  date.innerHTML = cleanDate(metar.getElementsByTagName("observation_time")[0].childNodes[0].nodeValue);

  // TEMPERATURE
  temp.innerHTML = metar.getElementsByTagName("temp_c")[0].childNodes[0].nodeValue + " °C";

  // DEW POINT
  dew.innerHTML = metar.getElementsByTagName("dewpoint_c")[0].childNodes[0].nodeValue + " °C";

  // WIND
  wind_dir.innerHTML = metar.getElementsByTagName("wind_dir_degrees")[0].childNodes[0].nodeValue + "°";
  wind_speed.innerHTML = metar.getElementsByTagName("wind_speed_kt")[0].childNodes[0].nodeValue + " knots";
  wind_gust.innerHTML = metar.getElementsByTagName("wind_gust_kt")[0].childNodes[0].nodeValue + " knots";
}

/*
* Does a HTTP request to the given URL and returns the result
*/
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/*
* Takes a given time in ISO8601 format and returns it as clean text
*/
function cleanDate(date) {
  var y = date.substring(0, 4);
  var m = months[Number(date.substring(5, 7))-1];
  var d = date.substring(8, 10);

  var t = date.substring(11, 19);
  return d+" "+m+" "+y+" at "+t;
}
