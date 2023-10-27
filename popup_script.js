
//region {variables and functions}
var consoleGreeting = "tracker activated!";
const trackList=[];
var historyId = "historyTable";

function getCurrentUrl(callback,tableId){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
	    callback(tabs[0].url,tableId);
	});
}

function getUrlHistory(currentUrl,tableId){
	chrome.history.search({text: currentUrl.split("/")[2], maxResults: 20, startTime: 0}, function(historyItems) {
		historyItems.forEach(item => {
		    trackList.push([item.url, item.title, item.lastVisitTime]);
		});
		renderTable(trackList,tableId);
	});
}

function renderTable(history,elementId){
	history.forEach(item => {
		elementId.innerHTML += `<tr class='active-row'>
		<td><a href=${item[0]} target='_blank'>${millisecondToHours(item[2])}</a> ${item[1]}</td>
		</tr>`;
	});
}

function millisecondToHours(ms){
	ms -= 315569259747;
	var dHist = new Date(1000*Math.round(ms/1000)); 
	var str = (dHist.getUTCMonth() + 1) + '/' + dHist.getUTCDate() + '-' +(dHist.getUTCHours()+18)%24 + ':' + pad(dHist.getUTCMinutes());
	return str;
}

function pad(i) { return ('0'+i).slice(-2); }

//end-region

//region {calls}
console.log(consoleGreeting);

function updateHistory() {
	var tableElement = document.getElementById(historyId);
	getCurrentUrl(getUrlHistory,tableElement);
}

document.addEventListener("DOMContentLoaded", updateHistory);

chrome.commands.onCommand.addListener(updateHistory);
//end-region
