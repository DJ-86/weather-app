/* ## Acceptance Criteria

* Create a weather dashboard with form inputs.
  * When a user searches for a city they are presented with current and future conditions for that city and that city is added to the search history
  * When a user views the current weather conditions for that city they are presented with:
    * The city name
    * The date
    * An icon representation of weather conditions
    * The temperature
    * The humidity
    * The wind speed
  * When a user view future weather conditions for that city they are presented with a 5-day forecast that displays:
    * The date
    * An icon representation of weather conditions
    * The temperature
    * The humidity
  * When a user click on a city in the search history they are again presented with current and future conditions for that city
------------------------------------------------------

pseudo

check to see if stored data if so display
    probably easier to store the last searched city and auto fire the api on load
get a response from the weather api
    grab value from input when search is pressed
    store it into local storage
    add eventlistener for button
create a list of buttons
    button name comes from api result of user input
    6 max
    store the user inputs into an array (remember to empty it)
fill the box with the last searched api data
    city name
    date
    temp
    wind
    humidity
5day forecast
    create the parent element and 5 cards.
*/

let currentDay = moment().format('dddd, MMMM Do YYYY');
let tomorrow = moment().format('dddd')
console.log(tomorrow)
// Targets the currentDay html element and sets it's text to the variable currentDay
$('#current-day').text(currentDay);




// variables 
$('button').on('click', function(event){
    event.preventDefault();
    let searchVal = $('#search-input').val();
    
    var APIKey = "002a4fd1a988cedec1b101f5b9ba6c8b";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchVal + "&appid=" + APIKey;
    

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    

    let lat = response.coord.lat.toFixed(2);
    let lon = response.coord.lon.toFixed(2);
    console.log(lat, lon)
    
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=" + lat +  "&lon=" + lon + "&appid=" + APIKey;

    $.ajax({
        
        url: fiveDayURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        $('#today').text(response.city.name + ' ' + currentDay);
        let temp = $('<div>').append(response.list[0].main.temp + "\u00B0" + 'C');
        let wind = $('<div>').append(response.list[0].wind.speed +'mph');
        let humidity = $('<div>').append(response.list[0].main.humidity + '%');
        $('#today').append(temp, wind, humidity);

        for(let i = 0; i < 40; i+=8) {
            let forecastDate  = moment().add([i],'days').format('dddd')
            let newDiv = $('<div>').attr('class', 'card').css({'background-color':'lightgrey'});
            let fiveDayTemp = $('<div>').append(response.list[i].main.temp + "\u00B0" + 'C');
            let fiveDayDate = $('<div>').append(forecastDate)
            console.log(forecastDate)
            let fiveDayWind = $('<div>').append(response.list[i].wind.speed +'mph');
            let fiveDayHumidity = $('<div>').append(response.list[i].main.humidity + '%');

            $(newDiv).append(fiveDayDate, fiveDayTemp, fiveDayWind, fiveDayHumidity);
            $('#forecast').append(newDiv);
        }
    })
});
})


