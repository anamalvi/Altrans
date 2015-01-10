var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var bahen = new google.maps.LatLng(43.6596, -79.3972);

var transportFactors = 
{
	'WALKING': 1.0,
	'BICYCLING': 0.5,
	'SKATEBOARDING': 0.65,
	'SWIMMING': 0.9,
	'RUNNING': 0.7,
	'SPEED-WALKING': 0.8
}

var buildings = 
{
	"Bahen": "43.6596, -79.3972",
	"Robarts": "43.6644, -79.3994",
	"Bancroft": "43.660888, -79.399931",
	"Brennan": "",
	"Carr": "",
	"Chestnut": "",
	"Earth Science": "",
	"Exam Centre": "",
	"Fitzgerald": "",
	"Galbraith": "",
}

function initialize() 
{
	// Rendering Directions & Times
	directionsDisplay = new google.maps.DirectionsRenderer();
	
	var mapOptions = 
	{
	zoom: 17,
	center: bahen
	}
	
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	directionsDisplay.setMap(map);
	directionsDisplay.setPanel(document.getElementById('directionsPanel'));
	google.maps.event.addListener(directionsDisplay, 'directions_changed', function() 
	{
	computeTotalDistance(directionsDisplay.directions);
	computeTotalTime(directionsDisplay.directions);  
	});
	
	//Initialize bounds to keep the map in
	var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(43.669097, -79.392308),
      new google.maps.LatLng(43.656528, -79.384032));
	  
	map.fitBounds(defaultBounds);
  
	map.setZoom(14);  
}

function calcRoute() 
{
  var start = buildings[document.getElementById('start').value];
  var end = buildings[document.getElementById('end').value];  
 
 var request = 
  {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.WALKING
  };
  
  directionsService.route(request, function(response, status) 
  {
	if (status == google.maps.DirectionsStatus.OK) 
	{
    directionsDisplay.setDirections(response);
	} 	
  });
}

function computeTotalDistance(result) 
{
  var total = 0;
  var myroute = result.routes[0];
  
  for (var i = 0; i < myroute.legs.length; i++) 
  {
	total += myroute.legs[i].distance.value;
  }
  
  total = total / 1000.0;
  document.getElementById('totalDist').innerHTML = total + ' km';
  return total;
}
 
function checkTimes(totalMins, totalSecs) 
{
  var totalMinutes, totalSeconds, totalTime;
  
  if (totalMins == 1) 
  {
	totalMinutes = parseInt(totalMins) + 'min ';
  }  
  
  else if (totalMins > 1) 
  {
	
	totalMinutes = parseInt(totalMins) + 'mins ';
  }

  else if (totalMins == 0) 
  {
    totalMinutes = "";
  }
  
  else 
  {
	totalMinutes = "";
  }
   
  
  if (totalSecs == 1) 
  {
	totalSeconds = totalSecs + 'sec';
  }  
  
  else if (totalSecs > 1) 
  {
	totalSeconds = totalSecs + 'secs';
  }
  
  else if (totalSecs == 0) 
  {
    totalSeconds = "";
  }
  
  if ((totalSeconds == "") && (totalMinutes == "")) 
  {
	totalMinutes = "";
	totalSeconds = "0 secs";
  }
  
  totalTime = [totalMinutes, totalSeconds];
  return totalTime;
}

function computeTotalTime(result) 
{
  var total = 0;
  var myroute = result.routes[0];
  var totalTimes;
  
  for (var i = 0; i < myroute.legs.length; i++) 
  {
    total += myroute.legs[i].duration.value;
  }
  
  total = total * transportFactors[document.getElementById('mode').value];
  totalMins = total / 60.0;
  totalSecs = parseInt((totalMins % 1) * 60);
  totalTimes = checkTimes(totalMins, totalSecs)
  totalMins = totalTimes[0];
  totalSecs = totalTimes[1];
 
  document.getElementById('totalMins').innerHTML = totalMins + totalSecs;
  return total;
}

function startPrediction()
{
	// Start box prediction
}

function endPrediction()
{
	// End box prediction
}

google.maps.event.addDomListener(window, 'load', initialize);