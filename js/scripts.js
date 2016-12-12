var movie_1; // data of movie 1
var movie_2; // data of movie 2
var search_history_div = document.getElementById('search_history');
var search_results_div = document.getElementById('search_results');

search_history_div.innerHTML = getHistory();

document.getElementById("formSubmit").addEventListener("click", function(){
	document.forms["search_form"]["movie_1"].classList.add("validation");
	document.forms["search_form"]["movie_2"].classList.add("validation");
});

function formSend(){
	movie_1 = undefined;
	movie_2 = undefined;
	var movie_1_input = document.forms["search_form"]["movie_1"].value;
	var movie_2_input = document.forms["search_form"]["movie_2"].value;
	var movie_1_title = movie_1_input.toLowerCase().trim().replace(/\s/g, "+");
	var movie_2_title = movie_2_input.toLowerCase().trim().replace(/\s/g, "+");
  var api_url = '//omdbapi.com/?t=';
  var api_url_1 = api_url + movie_1_title;
  var api_url_2 = api_url + movie_2_title;
  setHistory(movie_1_input, movie_2_input);
  search_history_div.innerHTML = getHistory();
  getMovie_1(api_url_1);
  getMovie_2(api_url_2);
  var refresh = setInterval(function(){
  	if ((movie_1 != undefined) && (movie_2 != undefined)){
			search_results_div.innerHTML = compareMovie(movie_1_input, movie_2_input, movie_1, movie_2);	
			clearInterval(refresh);
  	}
	}, 100);
}

var getJSON = function(url, success, error) {
  var xhr = typeof XMLHttpRequest != 'undefined'
		? new XMLHttpRequest()
		: new ActiveXObject('Microsoft.XMLHTTP');
  xhr.onreadystatechange = function() {
	var status;
	var data;
		if (xhr.readyState == 4) {
			status = xhr.status;
			if (status == 200) {
				success(xhr.response);
			} else {
				error(status);
			}
		}
	}
	xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.send();
};

function getMovie_1(url){
	return getJSON(url, function(data) {
		movie_1 = data;
	}, function(status) {
		console.error('Connect error');
	});
}

function getMovie_2(url){
	return getJSON(url, function(data) {
		movie_2 = data;
	}, function(status) {
		console.error('Connect error');
	});
}

function compareMovie(movie_1_input, movie_2_input, movie_1, movie_2){
	var content = new String();
	var error = new String();
	var common = false;
	var arrActors_1 = [];
	var arrActors_2 = [];
	var actors = [];
	if ((movie_1.Response == "False") || (movie_2.Response == "False")){
		if (movie_1.Response == "False") {
			if (movie_2.Response == "False"){
				error = movie_1_input+', '+movie_2_input;
			}else{
				error = movie_1_input;
			}
		}else{
			error = movie_2_input;
		}
		search_results_div.classList.remove("--success");
		search_results_div.classList.add("--error");
		content = '<p>Nie znaleziono filmu: '+error+'</p>'; // <p>'+movie_1.Error+'</p>
  } else{
		if ( (movie_1.Director != "N/A") && (movie_1.Director == movie_2.Director)){
			search_results_div.classList.remove("--error");
			search_results_div.classList.add("--success");
			content = '<h2>Wspólna obsada</h2>';
		  content += '<p class="movie__director"><strong>Reżyser:</strong> '+movie_1.Director+'</p>';
		  common = true;
		}
		arrActors_1 = _.map(movie_1.Actors.split(","), function(n){ return n.trim(); });			
		arrActors_2 = _.map(movie_2.Actors.split(","), function(n){ return n.trim(); });
		actors = _.intersection(arrActors_1, arrActors_2);
		if (actors != ''){
			actors = _.map(actors, function(n){ return ' '+ n; });	
			if (!common) {
				search_results_div.classList.remove("--error");
				search_results_div.classList.add("--success");
				content = '<h2>Wspólna obsada</h2>';
			}
			content += '<p class="movie__actors"><strong>Aktorzy:</strong>'+actors+'</p>';
		}
		if (content == ''){
			search_results_div.classList.remove("--success");
			search_results_div.classList.add("--error");
			content = "<p>Brak wspólnej obsady.</p>";	
		}
	}
	return content; 		
}

function getDateTime() {
	var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
    var month = '0'+month;
  }
  if(day.toString().length == 1) {
    var day = '0'+day;
  }   
  if(hour.toString().length == 1) {
    var hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
  	var minute = '0'+minute;
 	}
  if(second.toString().length == 1) {
    var second = '0'+second;
  }   
  var dateTime = day+'.'+month+'.'+year+' '+hour+':'+minute+':'+second;   
  return dateTime;		
}

function getHistory(){
	var myHistory = localStorage.getItem('myHistory');
	var result = new String;
  if(myHistory) {
  	var history_list = myHistory.split(";");
  	history_list = _.map(history_list, function(n){ 
  		return _.object(['date', 'movie1', 'movie2'], n.split(","));
  	});
  	result =  '<h2>Ostatnie wyszukiwania</h2>';
  	result +=  '<table>';
  	result += '<thead>';
  	result += '<tr>';
  	result += '<th>Data</th><th>Film 1</th><th>Film 2</th>';
  	result += '</tr>';
  	result += '</thead>';
  	result += '<tbody>';
  	_.each(history_list, function(n) {
  		result += '<tr>';
  		result += '<td>'+n.date+'</td><td>'+n.movie1+'</td><td>'+n.movie2.trim()+'</td>';
  		result += '</tr>';
		});
  	result += '</tbody>';
  	result += '</table>'		
	}
	return result;
}

function setHistory(movie_1_input, movie_2_input){
	var myHistory = localStorage.getItem('myHistory');
	var result = new String;
  var date = getDateTime();
  if(!myHistory) {
		result = date+','+movie_1_input+', '+movie_2_input;
	} else {
		var history_list = myHistory.split(";");
		if (history_list.length >= 10){
			history_list.pop();	
			myHistory = history_list.join(";");
		}
		result = date+','+movie_1_input+', '+movie_2_input+';'+myHistory; 		
	}
	localStorage.setItem('myHistory', result);
}
