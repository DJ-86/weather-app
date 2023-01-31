let storedNames = JSON.parse(localStorage.getItem("userSearches")) || [];
let userSearches = [];
let lat = localStorage.getItem('lat');
let lon = localStorage.getItem('lon');
const myKey = config.MY_KEY;


// Shows the current time and date in the current day element
let currentDay = moment().format('dddd, MMMM Do YYYY');
$('#current-day').text(currentDay);


// when ready run this function
$(document).ready(displayArr);

// create buttons from local storage
function displayArr() {
        userSearches = storedNames;
        for(let i = 0; i < userSearches.length; i++) {
            let newButton = $('<button>').text(userSearches[i]).val(userSearches[i])
            console.log(newButton)
            $('.list-group').append(newButton)
    }
    let button = userSearches[0]
    apiCalls(button);
}   


// API calls
function apiCalls(button) {
    $('#forecast').empty();
    // input validation 
    if(button !== '') {
        searchVal = button;
        console.log('button input')    
    }   else if ($('#search-input').val() !== '') {
        searchVal = $('#search-input').val();
        console.log('#text input')
    } else { 
        searchVal = userSearches[0]        
    }
    // Query string for api call using the validated input
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&appid=" + myKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // if the search-input text field is not blank add the response name to beginning of userSearches array 
        if($('#search-input').val() !== '') {
            userSearches.unshift(response.name)
        }
        // set search input val to and empty string
        $('#search-input').val('');
        // add userSearches, lat and lon to local storage
        localStorage.setItem("userSearches", JSON.stringify(userSearches));
        // trim lat and lon to the correct length
        lat = response.coord.lat.toFixed(2);
        lon = response.coord.lon.toFixed(2);
        localStorage.setItem('lat' , lat);
        localStorage.setItem('lon' , lon);
        // the query string for a 5 day forecast
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&cnt=41&lat=" + lat +  "&lon=" + lon + "&appid=" + myKey;
    $.ajax({
        url: fiveDayURL,
        method: "GET",
        dataType: 'JSON'
    }).then(function(response) {
        // once we get a response pass it into dynamicELs function
        dynamicEls(response);
    })
    })
}

// create dynamic elements onto the page using the response from our 2nd api call
// today
function dynamicEls(response) {
    let iconEl = response.list[0].weather[0].icon;
    let imageEl = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + iconEl + '@2x.png')
    $('#today').text(response.city.name + ' ' + currentDay).append(imageEl);
    let temp = $('<div>').text('Temp: ').append(response.list[0].main.temp + "\u00B0" + 'C');
    let wind = $('<div>').text('Wind: ').append(response.list[0].wind.speed +'mph');
    let humidity = $('<div>').text('Humidity: ').append(response.list[0].main.humidity + '%');
    $('#today').append(temp, wind, humidity);
// forecast
    for(let i = 7; i <= 39; i+=8) {
        let fiveDayIcon = response.list[i].weather[0].icon;
        let fiveDayImg = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + fiveDayIcon + '@2x.png')
        let forecastDate  = moment().add([i + 1],'days').format('dddd')
        let newDiv = $('<div>').attr('class', 'card');
        let fiveDayTemp = $('<div>').text('Temp: ').attr('class', 'card-elements').append(response.list[i].main.temp + "\u00B0" + 'C');
        let fiveDayDate = $('<div>').append(forecastDate).attr('class', 'card-headers')
        let fiveDayWind = $('<div>').text('Wind: ').attr('class', 'card-elements').append(response.list[i].wind.speed +'mph');
        let fiveDayHumidity = $('<div>').text('Humidity: ').attr('class', 'card-elements').append(response.list[i].main.humidity + '%');
        $(newDiv).append(fiveDayDate, fiveDayImg,  fiveDayTemp, fiveDayWind, fiveDayHumidity);
        $('#forecast').append(newDiv);
    }
    addButtons();
}

// adds buttons to the dom that can be click to fire another api call
function addButtons() {
    // empties the list-group element before creating new buttons
    $('.list-group').empty();
    // sets the maximum length of the array
    if (userSearches.length > 5) {
        userSearches.length = 5;
    }
    // give each new button the value of the array[i]
    for(let i = 0; i < userSearches.length; i++) {
        let newButton = $('<button>').text(userSearches[i]).val(userSearches[i]).attr('class', 'btn btn-info mt-1 p3')
    // appends each new button to the page
        $('.list-group').append(newButton)
    }
}

$(document).on('click', 'button', function(event){
    event.preventDefault();
    
    button = this.value
    console.log(button)
    apiCalls(button);
})


