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
	
	// Search Bar
	var markers = [];
    var input = (document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	var searchBox = new google.maps.places.SearchBox(input);
    google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();
	
    if (places.length == 0) {
      return;
    }
	
    for (var i = 0, marker; marker = markers[i]; i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
  });
}

function calcRoute() 
{
  var start = document.getElementById('start').value;
  var end = document.getElementById('end').value;  
  
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
 
function checkTimes (totalMins, totalSecs) 
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

google.maps.event.addDomListener(window, 'load', initialize);