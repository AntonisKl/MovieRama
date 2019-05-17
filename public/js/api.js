// import { getDate } from './utils.js'; // or './module'

let apiKey = "";

function getUrl(endPoint, params, callback) {
    let paramsS = "";
    params.forEach(element => {
        paramsS += ("&" + element);
    })

    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}

function showInTheaterMovies(pageNum) {
    // primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    let moviesCardsS;
    getUrl("/movie/now_playing", ["page=" + pageNum], function callback(responseJson) {
        let movies = responseJson["results"];
        console.log(movies);

        let i = 0;

        buildCards(movies, function callback(moviesCardsS) {
            // console.log(moviesCardsS);

            document.getElementById("moviesList").innerHTML += moviesCardsS;
        })

    });
}

console.log("api loaded");