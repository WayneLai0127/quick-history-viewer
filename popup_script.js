//region {variables and functions}
var consoleGreeting = "tracker activated!";
const trackList=[];
var currentUrl="";

var timeId = "time";
var dateId = "date";
var historyId = "historyTable";
var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getCurrentUrl(callback,tableId){
	//currentWindow: true to replace lastFocusWindow
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
	    callback(tabs[0].url,tableId);
	    // use `url` here inside the callback because it's asynchronous!
	});
}
//currentUrl.split("/")[2], maxResults: 10
function getUrlHistory(currentUrl,tableId){
		chrome.history.search({text: currentUrl.split("/")[2], maxResults: 20, startTime: 0}, function(historyItems) {
		  // For each history item, get details on all visits.
		  for (var i = 0; i < historyItems.length; i++) {
		    trackList.push([historyItems[i].url,historyItems[i].title,historyItems[i].lastVisitTime]);
		  }
		toTable(trackList,tableId);
		});
}

function toTable(history,elementId){
	for (var j = 0; j < history.length ; j++){
		elementId.innerHTML+="<tr class='active-row'>";
		elementId.innerHTML+="<td> <a href="+history[j][0]+" target='_blank'>"+millisecondToHours(history[j][2])+" </a>"+history[j][1]+"</td>";
		elementId.innerHTML+="</tr>";
	}
}
function millisecondToHours(ms){
	ms=ms-315569259747;
	var nowMs = Date.now();
	//1313452944893.86
	//1629022145278
	//ms=nowDate-ms;
	/**
	//ms for ten years 315569259747
	var min,sec,hour;
	hour = Math.floor((ms/1000/60/60) << 0);
	min = Math.floor((ms/1000/60) << 0);
	sec = Math.floor((ms/1000) % 60);
	return hour +":"+min+":"+sec;
	**/
	
	var dHist = new Date(1000*Math.round(ms/1000)); // round to nearest second
	var dNow = new Date(1000*Math.round(nowMs/1000));
	var d = new Date(1000*Math.round((nowMs-ms)/1000));
	var str = dHist.getUTCDate() + '. ' +(dHist.getUTCHours()+18)%24 + ':' + pad(dHist.getUTCMinutes()) ;
	return str;
}
function pad(i) { return ('0'+i).slice(-2); }

//end-region
//region {calls}
console.log(consoleGreeting);
document.addEventListener("DOMContentLoaded",function(dcle) {
	var tableElement = document.getElementById(historyId);
	getCurrentUrl(getUrlHistory,tableElement);
});

chrome.commands.onCommand.addListener(function(command) {
	var tableElement = document.getElementById(historyId);
	getCurrentUrl(getUrlHistory,tableElement);
});
//end-region