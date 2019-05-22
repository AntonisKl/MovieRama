// global variables
const apiKey = "";
let allGenres = null; // variable in which all the movie DB's genres are stored

// getUrl: creates the GET request's url and sends it to the function httpGet
function getUrl(endPoint, params, callback) {
    let paramsS = "";

    if (params.length === 0 || (params.length > 0 && params[0].indexOf("language") === -1)) { // language isn't explicitly set
        paramsS += "&language=" + language; // set language
    }

    params.forEach(element => {
        paramsS += ("&" + element);
    })

    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}

// getAndStoreAllGenres: gets all genres and stores them in the global variable allGenres
function getAndStoreAllGenres(callback) {
    getUrl("/genre/movie/list", [], function(responseJson) {
        allGenres = responseJson["genres"]; // store genres' array

        callback();
    });
}

// getVideosReviewsSimilar: gets videos, reviews and similar movies of movie with id movieId by sending a single GET request
function getVideosReviewsSimilar(movieId, callback) {
    let movieDetails = {};

    getUrl("/movie/" + movieId, ["append_to_response=videos,reviews,similar"], function(responseJson) {
        movieDetails["videos"] = responseJson["videos"]["results"];
        movieDetails["similar"] = responseJson["similar"]["results"];
        movieDetails["reviews"] = responseJson["reviews"]["results"];

        if (movieDetails["reviews"].length === 0 && language === "el") { // if no greek review exists, get the english ones
            getUrl("/movie/" + movieId + "/reviews", ["language=en"], function(responseJson) {
                movieDetails["reviews"] = responseJson["results"];
                callback(movieDetails); // pass the necessary response data to the callback
            });
        } else {
            callback(movieDetails); // pass the necessary response data to the callback
        }
    });
}