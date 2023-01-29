var storedNames = JSON.parse(localStorage.getItem("userSearches"))||[];
let userSearches = [];
const myKey = config.MY_KEY;



let currentDay = moment().format('dddd, MMMM Do YYYY');
$('#current-day').text(currentDay);

$(document).ready(displayArr);

function displayArr() {
    
    console.log(storedNames[0]);
    let lat = localStorage.getItem('lat');
    let lon = localStorage.getItem('lon');
    apiCalls(storedNames[0]);

}    

function apiCalls() {
    
    let searchVal = $('#search-input').val()
    if (storedNames[0]) {
        searchVal = storedNames[0];
    } else if(searchVal == '') {
        console.log(this)
        searchVal = this.button.value;
    }
    

    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&appid=" + myKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log()
        
        if(!$('#search-input').val() == '') {
            userSearches.unshift(response.name)
        }
        $('#search-input').val('');
        
        
        localStorage.setItem("userSearches", JSON.stringify(userSearches));
        lat = response.coord.lat.toFixed(2);
        lon = response.coord.lon.toFixed(2);
        localStorage.setItem('lat' , lat);
        localStorage.setItem('lon' , lon);
        var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&cnt=41&lat=" + lat +  "&lon=" + lon + "&appid=" + myKey;
    $.ajax({
        url: fiveDayURL,
        method: "GET",
        dataType: 'JSON'
    }).then(function(response) {
        dynamicEls(response);
    })
    })
}

function dynamicEls(response) {
    let iconEl = response.list[0].weather[0].icon;
    let imageEl = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + iconEl + '@2x.png')
    $('#today').text(response.city.name + ' ' + currentDay).append(imageEl);
    let temp = $('<div>').append(response.list[0].main.temp + "\u00B0" + 'C');
    let wind = $('<div>').append(response.list[0].wind.speed +'mph');
    let humidity = $('<div>').append(response.list[0].main.humidity + '%');
    $('#today').append(temp, wind, humidity);

    for(let i = 7; i <= 39; i+=8) {
        let fiveDayIcon = response.list[i].weather[0].icon;
        let fiveDayImg = $('<img>').attr('src', 'https://openweathermap.org/img/wn/' + fiveDayIcon + '@2x.png')
        let forecastDate  = moment().add([i + 1],'days').format('dddd')
        let newDiv = $('<div>').attr('class', 'card').css({'background-color':'lightgrey'});
        let fiveDayTemp = $('<div>').append(response.list[i].main.temp + "\u00B0" + 'C');
        let fiveDayDate = $('<div>').append(forecastDate)
        let fiveDayWind = $('<div>').append(response.list[i].wind.speed +'mph');
        let fiveDayHumidity = $('<div>').append(response.list[i].main.humidity + '%');
        $(newDiv).append(fiveDayDate, fiveDayImg,  fiveDayTemp, fiveDayWind, fiveDayHumidity);
        $('#forecast').append(newDiv);
    }
    addButtons();
}

$(document).on('click', 'button', function(event){
    event.preventDefault();
    $('#forecast').empty();
    button = this
    apiCalls(button);
})

function addButtons() {
    $('.list-group').empty();
    if (userSearches.length > 5) {
        userSearches.length = 5;
    }
    for(let i = 0; i < userSearches.length; i++) {
        let newButton = $('<button>').text(userSearches[i]).val(userSearches[i])
        console.log(newButton)
        $('.list-group').append(newButton)
    }
}

