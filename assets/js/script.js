var apiKey= "2c60483ae11d359c437a72879a3e6846";
var storedSearch = []; 


// list of previouisly searched cities that shows up on the left side
// function expression
var pastSearch = function(nameOfCity) {
    $('.search-before:contains("' + nameOfCity + '")').remove();

    // create entry with city name
    var pastSearchEnter = $("<p>");
    pastSearchEnter.addClass("search-before");
    pastSearchEnter.text(nameOfCity);

    // create the container
    var pastSearchBox = $("<div>");
    pastSearchBox.addClass("search-before-container")

    // append entry to container 
    pastSearchBox.append(pastSearchEnter);

    // append enter container to search history container 
    var pastSearchBoxEl = $("#past-stuff-container");
    pastSearchBoxEl.append(pastSearchBox);

    if (storedSearch.length > 0){
        var beforeStoredSearch = localStorage.getItem("storedSearch");
        storedSearch = JSON.parse(beforeStoredSearch);
    }

    // add city name to array of saved searches

    storedSearch.push(nameOfCity);
    localStorage.setItem("storedSearch", JSON.stringify(storedSearch));

    $("#city-input").val("")

};

///////////

// load saved search history entries into search history container 
var loadHistSearch = function() {
    // get saved search history 
    var savedHistSearch = localStorage.getItem("storedSearch");

    // return false if there is no previous saved searches 
    if (!savedHistSearch) {
        return false;
    }

    savedHistSearch = JSON.parse(savedHistSearch);

    // go through savedHistSearch array and make entry for each item on the list
    for (var i = 0; i < savedHistSearch.length; i++) {
        pastSearch(savedHistSearch[i]);
    }
};

//////

var theCurrentWeather = function(nameOfCity) {
    // get and use data from open weather current weather 
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}`)

        // get response and turn it into objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get city's longitude and latitude - aka a city's location 
            var theLonCity = response.coord.lon;
            var theLatCity = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${theLatCity}&lon=${theLonCity}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // get response from one call api and turn it into objects
                .then(function(response) {
                    return response.json();
                })
                // get data from response and apply them to current weather section 
                .then(function(response) {
                    pastSearch(nameOfCity);

                    // add current weather container with border to page
                    var presentWeatherContain = $("#present-weather-container");
                    presentWeatherContain.addClass("current-weather-all");

                    // add city name, date, and weather image to current weather section title
                    var currentCityAllCool = $("#current-city-all-cool");
                    var presentDay = moment().format("M/D/YYYY");
                    currentCityAllCool.text(`${nameOfCity} (${presentDay})`);
                    var picCurrent = $("#current-weather-icon");
                    //console.log(picCurrent)
                    picCurrent.addClass("current-weather-icon");
                    var picCode = response.current.weather[0].icon;
                    picCurrent.attr("src", `https://openweathermap.org/img/wn/${picCode}@2x.png`);
                

                    // add temperature to page
                    var currentTemp = $("#current-temperature");
                    currentTemp.text("Temperature: " + response.current.temp + " \u00B0F");

                    // add humidity to page 
                    var currentHumid = $("#current-humidity");
                    currentHumid.text("Humidity: " + response.current.humidity + "%");

                    // add wind speed
                    var currentWind = $("#current-wind-speed");
                    currentWind.text("Wind Speed: " + response.current.wind_speed + "MPH");

                    // UV index 
                    var currentUV = $("#current-uv-index");
                    currentUV.text("UV Index: ");
                    var currentNum = $("#current-number");
                    currentNum.text(response.current.uvi);

                    // colors according to uv index
                    if (response.current.uvi <= 2) {
                        currentNum.addClass("nice");
                    } else if (response.current.uvi >= 3 && response.current.uvi <= 7) {
                        currentNum.addClass("not-bad");
                    } else {
                        currentNum.addClass("not-looking-good");
                    }
                })
        })
                .catch(function(err) {
                    // reset search
                    $("#city-input").val("");

                    // show error
                    alert("Unable to find city. Pleas try searching for a valid city.");
                });
};                 

//Five-Day Section
var fiveDayArea = function(nameOfCity) {
    // grab and show data from open weather api
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nameOfCity}&appid=${apiKey}`)
        // get response and become objects
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // get long nad lat
            var lonCity = response.coord.lon;
            var latCity = response.coord.lat;

            fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latCity}&lon=${lonCity}&exclude=minutely,hourly,alerts&units=imperial&appid=${apiKey}`)
                // get response from one call and become objects
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response);
                
                    // add forecast title
                    var titleForecast = $("#forward-forecast-font");
                    titleForecast.text("5-Day Forecast")

                    // data from response = set up all the 5 day forecasts 
                    for (var i = 1; i <= 5; i++) {
                        // add class for future cards
                        var lookAheadCard = $(".forward-card");
                        lookAheadCard.addClass("forward-card-details");

                        // add dates to forecasts 
                        var dateFuture = $("#forward-date-" + i);
                        date = moment().add(i, "d").format("M/D/YYYY");
                        dateFuture.text(date);

                        // add icon to 5 day forecast
                        var futureIcon = $("#future-pic-" + i);
                        futureIcon.addClass("future-pic");
                        var codeIconFuture = response.daily[i].weather[0].icon;
                        futureIcon.attr("src", `https://openweathermap.org/img/wn/${codeIconFuture}@2x.png`);


                        // add temp to forecasts 
                        var tempFuture = $("#forward-temp-" + i);
                        tempFuture.text("Temp: " + response.daily[i].temp.day + " \u00B0");

                        // add humidity to 5 day forecast
                        var humidFuture = $("#forward-humidity-" + i);
                        humidFuture.text("Humidity: " + response.daily[i].humidity + "%");
                    }
                })
        })
};

// call after search from submitted
$("#the-search-form").on("submit", function(event) {
    event.preventDefault();

    var nameCity = $("#city-input").val();

    if (nameCity === "" || nameCity === null) {
        alert("Please enter city name.");
        event.preventDefault();
    } else {
        theCurrentWeather(nameCity);
        fiveDayArea(nameCity);

    }
});

// called when a search history entry is clicked
$("#past-stuff-container").on("click", "p", function() {
    // get text (city name) of entry and pass it as a parameter to display weather conditions
    var previousCity = $(this).text();
    theCurrentWeather(previousCity);
    fiveDayArea(previousCity);

    //
    var previousCityPress = $(this);
    previousCityPress.remove();
});

loadHistSearch();
                
                
                
                
                
        




