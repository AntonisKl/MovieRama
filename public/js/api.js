// import { getDate } from './utils.js'; // or './module'

let apiKey = "";

function getUrl(endPoint, params, callback) {
    let paramsS = "";
    params.forEach(element => {
        paramsS += ("&" + element);
    });
    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}

function getInTheaterMovies() {
    // primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    let movies;
    getUrl("/movie/now_playing", [], function callback(responseText) {
        movies = JSON.parse(responseText)["results"];
        console.log(movies);
    });
}

console.log("api loaded");