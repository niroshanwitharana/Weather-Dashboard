//create all the nessary variables as global 
var apiKey = "f68f42a233dfc085c09407e74772c844";

var city;

var cityName;
var date;
var tempK;
var tempF;
var uvIndex;
var itemArr = [""];
var humidity;
var windSpeed;
var lan;
var lon;
 function weather(){
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0099f738ebda222dd6c29bb134bde51a";

    // Creating an AJAX call for the search button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {       

        //important data what we going o use put in to variables
        cityName = response.city.name;
        date = (response.list[0].dt_txt).slice(0, 10);
        tempK = response.list[0].main.temp;
        tempF = (tempK * 9 / 5 - 459.67).toFixed(2);

        humidity = response.list[0].main.humidity;
        windSpeed = response.list[0].wind.speed;
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        getForecastWeather();

        //had to used different URL for get the uvIndex
        
            var uvRequest = "https://api.openweathermap.org/data/2.5/uvi?appid=0099f738ebda222dd6c29bb134bde51a&lat=" + lat + "&lon=" + lon;
            console.log(uvRequest);
    
            $.ajax({
                url: uvRequest,
                method: "GET"
            }).then(function (uvResponse) {
                //create <p> tag and 
                var uvLable = $("<p>").text("uvIndex: "); 
                uvIndex= $("<span>").addClass("uvindex").text(uvResponse.value); 

                uvLable.append(uvIndex)
                $(".currentWeather").append(uvLable);
                

                $(".uvindex").removeClass("green yellow orange red purple");
                
                var currentUVIndex = Math.round(parseInt(uvResponse.value));
              
                // If statement to change the colour of the UV span depending on the UV index
    
                if(currentUVIndex < 2){
                    $(".uvindex").addClass("green");
                } if(2.5<currentUVIndex && currentUVIndex< 5.5) {
                    $(".uvindex").addClass("yellow");
                } if(6<currentUVIndex && currentUVIndex < 7.5) {
                    $(".uvindex").addClass("orange");
                } if(8<currentUVIndex && currentUVIndex < 10.5) {
                    $(".uvindex").addClass("red");
                } if(currentUVIndex>11){
                    $(".uvindex").addClass("purple");
                }
            })
        


        //this functions will call when search button clicked

        getCurrentWeather(response);
        
        
        
        
    });
    

 }
// When the document has loaded, display the weather for the last searched city
$(document).ready(function() {
//itemArr variable use for get the data from local storage and convert them to object(only if there are any data)
    itemArr = JSON.parse(localStorage.getItem("currentCity")) || []
    var lastCity = itemArr[itemArr.length-1];
    city = lastCity;
   weather();
//use a for loop to get all the string data and create a button and save them under the search area
// this data will not go away till you clear the local storage
for (let i = 0; i < itemArr.length; i++) {
    var cities = $("<p>").text(itemArr[i]);
    //create a link button
    var searchCity = $("<a>").attr({ href: "#", class: "list-group-item list-group-item-action searchLink" });
    searchCity.append(cities);
    $(".list").append(searchCity);
}


$(".list").on("click", function (event) { 
    city = event.target.innerText;	
  weather();
    
});

});

// create a function to get current weather condition
function getCurrentWeather(response) {
    //before add created element to the div make it sure it's empty
    $('.card-body').empty();

    //create all the necesary eliments, add text or data in to them and append to the right element
    var temperature = $("<p>").addClass("card-text temperature").text("Temperature: " + tempF + " °F");
    var humidityCurrent = $("<p>").addClass("card-text humidityCurrent").text("Humidity: " + humidity + " %");
    var windSpeedCurrent = $("<p>").addClass("card-text windSpeedCurrent").text("Windspeed: " + windSpeed + " MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + (response.list[0].weather[0].icon) + ".png");
    var cityDate = $("<h4>").addClass("card-title").append(cityName + " " + "(" + date + ")");
    console.log(temperature);
    console.log(response.list[0].weather[0].icon);

    //append element to the right div
    $(".currentWeather").append(cityDate, image, temperature, humidityCurrent, windSpeedCurrent);


}

function getForecastWeather() {
    
    // to get 5 days forcast had to use different URL and ajax call
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0099f738ebda222dd6c29bb134bde51a",
        method: "GET"
    }).then(function (response) {

        //before appen the new data or text make the div empty
        $("#futureForecast").empty();
        // doing same thing for header
        $(".h5Tag").empty();
        console.log(response.city.name);
        
        //created an array to put the response.list array data 
        var forcastArray = [];
            forcastArray = response.list;

        //this is the header for 5 day weather forecast
        $(".h5Tag").html("5-Day Weather Forecaste in " + response.city.name);

        // use a for loop to get 5 days data
        for (var i = 0; i < forcastArray.length; i += 8) {
            tempK = response.list[i].main.temp;

            //convert kelvin to F and round it to second decimal point
            tempF = (tempK * 9 / 5 - 459.67).toFixed(2);

            // create an element and set class attribute
            var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
            var cardBody = $("<div>").addClass("card-body p-3 futureForecast cardList");

            // add text, html in to it
            var cityDate = $("<p>").addClass("card-title title").append((response.list[i].dt_txt).slice(0, 10));
            var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + (response.list[i].weather[0].icon) + ".png");
            var temperature = $("<p>").addClass("card-text temperature text").text("Temp: " + tempF + " °F");
            var humidityCurrent = $("<p>").addClass("card-text humidityCurrent text").text("Humid: " + response.list[i].main.humidity + " %");

            console.log(temperature);
            console.log(response.list[0].weather[0].icon);
            //append the element
            cardBody.append(cityDate, image, temperature, humidityCurrent);
            card.append(cardBody);
            $("#futureForecast").append(card);


        }
    });
}

//create all the nessary variables as global 

//after enter city name in to date area even if you click enter button(instead of click on search button)
//it will still take as a clicked search button
var searchBT = document.querySelector(".list");

$("#searchArea").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
});

// add eventListner to search button

$("#searchBtn").on("click", function () {

    //after enter city to the search area take that value to a variable
     city = $("#searchArea").val();
    //and make sure to empty the value before you enter an another city
    $("#searchArea").val("");
    //Api URL
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=0099f738ebda222dd6c29bb134bde51a";

    // Creating an AJAX call for the search button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        //when we search a city, create a button and put that city in to it and append to a div under the search area
        var searchCity = $("<a>").attr({ href: "#", class: "list-group-item list-group-item-action searchLink" });
        searchCity.append(city);
        $(".list").append(searchCity);


        // push the searched city in to an array
        itemArr.push(city);
        //and set in to local storage
        localStorage.setItem("currentCity", JSON.stringify(itemArr));

        //important data what we going o use put in to variables
        cityName = response.city.name;
        date = (response.list[0].dt_txt).slice(0, 10);
        tempK = response.list[0].main.temp;
        tempF = (tempK * 9 / 5 - 459.67).toFixed(2);

        humidity = response.list[0].main.humidity;
        windSpeed = response.list[0].wind.speed;
        lat = response.city.coord.lat;
        lon = response.city.coord.lon;

        getForecastWeather();

        //had to used different URL for get the uvIndex
        
            var uvRequest = "https://api.openweathermap.org/data/2.5/uvi?appid=0099f738ebda222dd6c29bb134bde51a&lat=" + lat + "&lon=" + lon;
            console.log(uvRequest);
    
            $.ajax({
                url: uvRequest,
                method: "GET"
            }).then(function (uvResponse) {
                //create <p> tag and 
                var uvLable = $("<p>").text("uvIndex: "); 
                uvIndex= $("<span>").addClass("uvindex").text(uvResponse.value); 

                uvLable.append(uvIndex)
                $(".currentWeather").append(uvLable);
                

                $(".uvindex").removeClass("green yellow orange red purple");
                
                var currentUVIndex = Math.round(parseInt(uvResponse.value));
              
                // If statement to change the colour of the UV span depending on the UV index
    
                if(currentUVIndex < 2){
                    $(".uvindex").addClass("green");
                } if(2.5<currentUVIndex && currentUVIndex< 5.5) {
                    $(".uvindex").addClass("yellow");
                } if(6<currentUVIndex && currentUVIndex < 7.5) {
                    $(".uvindex").addClass("orange");
                } if(8<currentUVIndex && currentUVIndex < 10.5) {
                    $(".uvindex").addClass("red");
                } if(currentUVIndex>11){
                    $(".uvindex").addClass("purple");
                }
            })
        


        //this functions will call when search button clicked

        getCurrentWeather(response);
        
        
        
        
    });
    
});