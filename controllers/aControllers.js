const express = require('express');
const aController = express.Router();
const request = require('request');

// middleware that is specific to this router
aController.use((req, res, next) => { next() })
    // define the User Routes 

aController.post('/getWeather', async(req, res) => {
    let city;
    let zipcode = req.body.zipcode;
    let postalcode = req.body.postalcode;
    // let countrycode = req.body.countrycode;
    let apiKey = 'f14f51cb7f4f137ad628d4f32cea72d8';
    // let apiKey1 = 'CVTMYR4BJ98GV8KPK7SX';
    let apiKey2 = 'CVTMYR4BJ98GV8KPK7SX';

    // Use that city zip-code and country-code to fetch data
    // let countrycode = 'ca';
    let url1 = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${apiKey}`;
    // let url2 = `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${countrycode}&appid=${apiKey}`;
    // let url3 = `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipcode}?key=${apiKey1}`;
    let url5 = `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${postalcode}?key=${apiKey2}`;
    let url6 = `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/${zipcode}?key=${apiKey2}`;
    // let url4 = `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zipcode}&country=ca&username=${username}`;
    if (zipcode || postalcode) {
        console.log(zipcode, postalcode);

        function validateZipCode(zipCode) {
            // Regular expression pattern to match ZIP codes
            var zipPattern = /^\d{5}(?:[-\s]\d{4})?$/;

            // Test the zipCode against the pattern
            return zipPattern.test(zipCode);
        }
        let validuscode = (validateZipCode(zipcode));
        console.log(validuscode);

        function validatePostalCode(zipCode) {
            // Regular expression pattern to match Canadian postal codes
            var postalPattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

            // Test the postalCode against the pattern
            return postalPattern.test(zipCode);
        }
        let validcacode = (validatePostalCode(postalcode));
        console.log(validcacode);

        // function validatePostalCode1(postalCode) {
        //     // Regular expression pattern to match Canadian three-digit postal codes
        //     var postalPattern = /^[A-Za-z]\d[A-Za-z]$/;

        //     // Test the postalCode against the pattern
        //     return postalPattern.test(postalCode);
        // }
        // let validcacode1 = (validatePostalCode1(postalcode));
        // console.log(validcacode1);

        if (validuscode == true) {
            var state1;
            request(url6, function(err, response, body) {
                if (err) {
                    res.render('index', { weather: null, error: 'Error, please try again' });
                } else {
                    let weather = JSON.parse(body);
                    console.log(weather);
                    state1 = weather.State;

                    request(url1, function(err, response, body) {
                        // On return, check the json data fetched
                        if (err) {
                            res.render('index', { weather: null, error: 'Error, please try again' });
                        } else {
                            let weather = JSON.parse(body);
                            console.log(weather);
                            let cod = weather.cod;
                            if (cod == '404') {
                                res.send({ status: err, message: "An Error Occured ! Please try Again !" });
                            } else {
                                let current_weather = weather.weather[0];
                                current_weather = current_weather.main;
                                if (current_weather == 'Snow') {
                                    res.send({ status: true, message: "Its currently Snowing !!" });
                                } else {
                                    console.log(weather);
                                    let city_name = weather.name;
                                    let main = weather.main;
                                    let wind_speed = weather.wind.speed;
                                    let temp = main.temp;
                                    let temp1 = main.temp;
                                    temp = (temp - 273.15) * 9 / 5 + 32;
                                    let temp_min = main.temp_min;
                                    temp_min = (temp_min - 273.15) * 9 / 5 + 32
                                    let temp_max = main.temp_max;
                                    temp_max = (temp_max - 273.15) * 9 / 5 + 32
                                    let humidity = main.humidity;
                                    let snow_percentage = [(temp_min + temp_max) / 2] - 32;
                                    snow_percentage = snow_percentage.toFixed(2);
                                    let e = 2.71828;
                                    let s = (1 - e ^ (-0.05 * (temp1 - 273.15))) * (humidity / 100) * (wind_speed / 10) ^ 2
                                    console.log(s);
                                    // If percentage is negative then convert it into zero
                                    if (snow_percentage < 0) {
                                        snow_percentage = 0;
                                    }
                                    let z = (0.14 * temp) + (0.03 * humidity) + (0.12 * wind_speed) - 14.8;
                                    let snow_percentage1 = (100 / (1 + e ^ (-z))) - 50;
                                    console.log(`Chance of snow day in ${city_name} is ${snow_percentage} %.`);
                                    res.send({ status: true, message: `Chance of snow day in ${city_name},${state1}  is ${snow_percentage} %`, result: snow_percentage });
                                }
                            }
                        }
                    })
                }
            })

        } else if (validcacode == true) {
            request(url5, function(err, response, body) {
                // On return, check the json data fetched
                if (err) {
                    res.render('index', { weather: null, error: 'Error. Please try again !!' });
                } else {
                    let weather = JSON.parse(body);
                    console.log(weather);
                    var state = weather.State;
                    if (weather.City) {
                        city = weather.City;
                    } else {
                        city = weather.Cities[0];
                    }
                    console.log(city);
                    // Use that city name to fetch data
                    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                    request(url, function(err, response, body) {
                        if (err) {
                            res.send({ status: false, weather: null, error: 'Error. Please try again !!' });
                        } else {
                            console.log(body);
                            let weather1 = JSON.parse(body);
                            console.log(weather1);
                            let cod = weather1.cod;
                            if (cod == '404') {
                                res.send({ status: err, message: "City not Found !! Please try Again !!" });
                            } else {
                                let current_weather1 = weather1.weather[0];
                                current_weather1 = current_weather1.main;
                                if (current_weather1 == 'Snow') {
                                    res.send({ status: true, message: "Its currently Snowing !!" });
                                } else {
                                    let city_name = weather1.name;
                                    let main = weather1.main;
                                    let wind_speed = weather1.wind.speed;
                                    let temp = main.temp;
                                    let temp1 = main.temp;
                                    temp = (temp - 273.15) * 9 / 5 + 32;
                                    let temp_min = main.temp_min;
                                    temp_min = (temp_min - 273.15) * 9 / 5 + 32
                                    let temp_max = main.temp_max;
                                    temp_max = (temp_max - 273.15) * 9 / 5 + 32
                                    let humidity = main.humidity;
                                    let snow_percentage = [(temp_min + temp_max) / 2] - 32;
                                    snow_percentage = snow_percentage.toFixed(2);
                                    let e = 2.71828;
                                    let s = (1 - e ^ (-0.05 * (temp1 - 273.15))) * (humidity / 100) * (wind_speed / 10) ^ 2;
                                    console.log(s);

                                    // If percentage is negative then convert it into zero
                                    if (snow_percentage < 0) {
                                        snow_percentage = 0;
                                    }

                                    let z = (0.14 * temp) + (0.03 * humidity) + (0.12 * wind_speed) - 14.8;
                                    let snow_percentage1 = (100 / (1 + e ^ (-z))) - 50;
                                    console.log(`Chance of snow day in ${city_name} is ${snow_percentage} %`);
                                    res.send({ status: true, message: `Chance of snow day in ${city_name},${state}  is ${snow_percentage} %`, result: snow_percentage });
                                }
                            }
                        }
                    })
                }
            })
        } else {
            res.send({ status: false, message: "Please Enter a valid Us zip code or Canada Postal code." })
        }
    } else {
        res.send({ status: false, message: 'Kindly Provide Zip Code' });
    }
});

module.exports = aController;