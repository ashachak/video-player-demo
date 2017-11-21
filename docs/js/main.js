function motion(element) {
    var base = "https://res.cloudinary.com/demo/video/upload/so_0,du_3/vs_30,e_loop/w_260,h_105,c_fill/q_50,r_5,b_white/fl_lossy.animated,f_auto/";
    var suffix = ".gif";
    switchImage(element.getElementsByTagName('img')[0],element.id,base,suffix);
}
function still(element) {
	var base = "https://res.cloudinary.com/demo/video/upload/so_0,w_260,h_105,c_fill,r_5,b_white,q_auto,f_auto/";
	var suffix = ".jpg";
	switchImage(element.getElementsByTagName('img')[0],element.id,base,suffix);
}
function switchImage(elm,id,base,suffix) { 
    switch (id) {
		case "sec01":
			elm.setAttribute('src', base+"rafting_short"+suffix);
			break;
		case "sec02":
			elm.setAttribute('src', base+"forest_bike"+suffix);
			break;
		case "sec03":
			elm.setAttribute('src', base+"snow_horses"+suffix);
			break;
		case "sec04":
			elm.setAttribute('src', base+"snow_deer"+suffix);
			break;
		default:
			console.log("switchImage id=",id);
		}
}
function toggleClass() {
    var theme = document.getElementById("theme-area");
    theme.classList.toggle("active");
}
function setTheme(btn) {
    var newTheme = "cld-video-player-skin-" + btn.value;
    var oldTheme = "cld-video-player-skin-";
    var pagination = document.getElementById("video-pagination");
    if(btn.value == "dark") {
        oldTheme += "light"; 
        pagination.classList.remove("style01");
    }
    else {
        oldTheme += "dark";
        pagination.classList.add("style01");
    }
    var vplayers = document.getElementsByClassName("cld-video-player");
    for(var i = 0; i < vplayers.length; i++) {
        vplayers[i].classList.remove(oldTheme);
        vplayers[i].classList.add(newTheme);
    }
    toggleClass();
}

window.addEventListener('scroll',checkPosition,false);
function checkPosition()
{
    var themeArea = document.getElementById("theme-area");
    if(window.scrollY > 50)
    {
        themeArea.classList.add("scrolling");
    } else {
        themeArea.classList.remove("scrolling");
    }
}

function playerSizeChange(input) {
  var area = document.getElementById("video-area-adaptive");
  var border = document.getElementById("player-border");
  var val = input.value + "%";
  area.style.width = val;
  border.style.width = val;
  var pwidth = document.getElementById("player-width");
  pwidth.innerHTML = area.clientWidth;
}
function updateOnResize() {
  var width = demoplayer.videojs.videoWidth();
  var current = document.getElementById(width);
  var oldactive = document.getElementsByClassName("range-info active");
  for (var i = 0; i < oldactive.length; i++) {
    oldactive[i].setAttribute("class","range-info");
  }
  current.setAttribute("class","range-info active");
}
function requestResolution(btn) {
  if(!safari)
  {
    document.getElementById("checkbox").checked = false;
    document.getElementById("checkboxLabel").classList.add("disabled");
    for (var i = 0; i < qualityLevels.length; i++) {
      qualityLevels[i].enabled = (Number(btn.id) == qualityLevels[i].width);
    }
  }
}
function requestAuto(auto) {
  console.log("requestAuto() ",auto.checked);
  if(auto.checked) {
    for (var i = 0; i < qualityLevels.length; i++) {
        qualityLevels[i].enabled = true;
    }
  }
  document.getElementById("checkboxLabel").classList.toggle("disabled");
}

function changeOfResolution() {
  var index = qualityLevels.selectedIndex;
  var res = document.getElementById(qualityLevels[index].width);
  var old = document.getElementsByClassName("range-info second-hover");
  for (var i = 0; i < old.length; i++) {
    old[i].setAttribute("class","range-info");
  }
  res.setAttribute("class","range-info second-hover");
}

function setProfile(profile) {
  updateResolutionRange(profile.value);
  demoplayer.source("kayak", { sourceTypes: ['hls'], transformation: {streaming_profile: profile.value } }).play();
}

function updateResolutionRange(profileVal) {
  var elements = document.getElementsByClassName('range-info');
  var i = elements.length;

    while(i--) {
        if(elements[i].getElementsByClassName(profileVal).length > 0)
          elements[i].setAttribute("class","range-info");
        else
          elements[i].setAttribute("class","range-info out-of-range");
          
    }
  document.getElementById("checkbox").checked = true;
  document.getElementById("checkboxLabel").classList.remove("disabled");
}

var chrome   = navigator.userAgent.indexOf('Chrome') > -1;
var safari   = navigator.userAgent.indexOf("Safari") > -1;
if ((chrome) && (safari)) safari = false;

if(safari)
  document.getElementById("checkbox").disabled = true;

playerSizeChange(document.getElementById("player-slider"));

var cld = cloudinary.Cloudinary.new({ cloud_name: 'demo' });

var adaptive = document.getElementById("adaptive");
document.getElementById("demo-adaptive-player").addEventListener('resize',updateOnResize, false);
 
var demoplayer = cld.videoPlayer('demo-adaptive-player');
 
var qualityLevels = demoplayer.videojs.qualityLevels();
qualityLevels.on('change', changeOfResolution);
demoplayer.on('ended', requestAuto);
	
if(window.innerWidth < 960) {
	document.getElementById('streaming4').checked = true;
	updateResolutionRange("sd");
	demoplayer.source("kayak", { sourceTypes: ['hls'], 
				    transformation: {streaming_profile: 'sd' },
			  poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}
                          });
}
else {
	demoplayer.source('kayak',{ sourceTypes: ['hls'], 
                            transformation: {streaming_profile: 'full_hd' },
                            poster: { transformation: { width: 1920, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}
                          });
}

function updateOnEvent(eventStr,automatic) {
  var list = document.getElementById('events-list');
  var entry = document.createElement('li');
  if(automatic) 
      entry.className = "orange";
  entry.appendChild(document.createTextNode(eventStr));
  list.appendChild(entry);
  list.scrollTop = list.scrollHeight;
}

function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }

function startTime() {
        var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
        return (h + ":" + m + ":" + s);
}

var eventplayer = cld.videoPlayer('demo-events-player', 
  { playedEventTimes: [3, 10],
    analytics: { // Enable player analytics
    events: [
    'play',
    'pause',
    'percentsplayed',
    'start',
    'ended',
    'fullscreenchange']}});

var autoEventTypes = ['sourcechanged', 'timeplayed', 'percentsplayed', 'ended'];

var manualEventTypes = ['play', 'pause', 'volumechange', 'mute', 'unmute', 'fullscreenchange',
      'seek'];

autoEventTypes.forEach(function(eventType) {
      eventplayer.on(eventType, function(event) {
        var eventStr = startTime() + " " + eventType;
        if (event.eventData) {
          eventStr = eventStr + ": " + JSON.stringify(event.eventData)
        }
        updateOnEvent(eventStr,true);
      })
    });

manualEventTypes.forEach(function(eventType) {
      eventplayer.on(eventType, function(event) {
        var eventStr = startTime() + " " + eventType;
        if (event.eventData) {
          eventStr = eventStr + ": " + JSON.stringify(event.eventData)
        }
        updateOnEvent(eventStr,false);
      })
    });
  
 eventplayer.source('forest_bike',{ sourceTypes: ['hls'], 
                                    transformation: {streaming_profile: 'full_hd' },
                                    poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}
                                  });

function playMe(btn) {
    var val = parseInt(btn.value);
    plistplayer.playlist().playAtIndex(val);
  }

  function updateOnSrc() {
    var plist = plistplayer.playlist();
    var playing = plist.currentIndex();
    var loop = plist.length();
    for(var i=0; i<loop; i++) {
      var label = "plist"+i;
      var btn = document.getElementById(label);
      if(i == playing)
        btn.setAttribute("class", "active");
      else
        btn.setAttribute("class", " ");
  }
}

var plistplayer = cld.videoPlayer('demo-playlist-player');
plistplayer.on('sourcechanged', updateOnSrc);
plistplayer.playlist([{ publicId: 'snow_horses', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
 poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}},
 { publicId: 'snow_deer', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
 poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}},
 { publicId: 'sea_turtle', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
 poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}},
 { publicId: 'elephants', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
 poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}}], 
 { autoAdvance: 0, repeat: true, presentUpcoming: 5 });
 /* 
 plistplayer.source('snow_horses',{ sourceTypes: ['hls'], 
                                   transformation: {streaming_profile: 'full_hd' },
                                   poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }}
                                  });*/

var recplayer = cld.videoPlayer('demo-recommendation-player',{ autoShowRecommendations: true });

var source1 = { publicId: 'snow_deer_short', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
               poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }},
               info: { title: 'Snow Deer', subtitle: 'Snow Deer Movie' } };
var source2 = { publicId: 'snow_horses', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
               poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }},
               info: { title: 'Snow Horses', subtitle: 'Snow Horses Movie' } };
var source3 = { publicId: 'sea_turtle', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
               poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }},
               info: { title: 'Sea Turtle', subtitle: 'Sea Turtle Movie' } };
var source4 = { publicId: 'elephants', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'},
	       poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }},
               info: { title: 'Elephants', subtitle: 'Elephants' } };
var source5 = { publicId: 'marmots', sourceTypes: ['hls'], transformation: {streaming_profile: 'full_hd'}, 
               poster: { transformation: { width: 960, crop: 'limit', quality: 'auto', fetch_format: 'auto' }},
               info: { title: 'Marmots', subtitle: 'Marmots' } };

source1.recommendations = [source2, source3, source4, source5];
source2.recommendations = [source3];
source3.recommendations = [source4];
source4.recommendations = [source5];
source5.recommendations = [source2, source3, source4, source1];
var first = true;
recplayer.on('sourcechanged', function(event) {if (first) {first = false;} else {recplayer.play();}});
recplayer.source(source1);

