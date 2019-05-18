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

function getGenresS(genreIds, resolve, mainCallback) {
    let genresS = "";

    getUrl("/genre/movie/list", [], function callback(responseJson) {
        let allGenres = responseJson["genres"];
        console.log(allGenres[0]["id"]);
        genreIds.forEach(genreId => {
            let foundGenre = allGenres.find(function(genre) {
                return genre["id"] == genreId;
            });

            genresS += foundGenre["name"] + ", ";
            // console.log("genres " + allGenres[genreId]);
        });

        mainCallback(genresS, resolve);
    });
}

function getVideosReviewsSimilar(movieId, mainCallback) {
    let movieDetails = {};

    getUrl("/movie/" + movieId, ["append_to_response=videos,reviews,similar"], function callback(responseJson) {
        // let allGenres = responseJson["genres"];
        console.log(responseJson);
        // genreIds.forEach(genreId => {
        //     let foundGenre = allGenres.find(function(genre) {
        //         return genre["id"] == genreId;
        //     });

        //     genresS += foundGenre["name"] + ", ";
        //     // console.log("genres " + allGenres[genreId]);
        // });
        movieDetails["videos"] = responseJson["videos"]["results"];
        movieDetails["reviews"] = responseJson["reviews"]["results"];
        movieDetails["similar"] = responseJson["similar"]["results"];
        mainCallback(movieDetails);
    });
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

function showMovie(movieId) {
    getUrl("/movie/" + movieId, [], function callback(movie) {
        console.log(movie);
    });
}

console.log("api loaded");