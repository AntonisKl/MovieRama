// import { getDate } from './utils.js'; // or './module'

let apiKey = "";
let firstSearch = false;

function getUrl(endPoint, params, callback) {
    let paramsS = "";
    params.forEach(element => {
        paramsS += ("&" + element);
    })

    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}

let allGenres = null;

function matchMovieGenres(genreIds) {
    let movieGenresS = "";
    genreIds.forEach(genreId => {
        let foundGenre = allGenres.find(function(genre) {
            return genre["id"] == genreId;
        });

        movieGenresS += foundGenre["name"] + ", ";
        // console.log("genres " + allGenres[genreId]);
    });

    return movieGenresS;
}

function getGenresS(genreIds, resolve, mainCallback) {
    let genresS = "";

    if (!allGenres) {
        getUrl("/genre/movie/list", [], function callback(responseJson) {
            allGenres = responseJson["genres"];
            // console.log(allGenres[0]["id"]);
            genresS += matchMovieGenres(genreIds);

            mainCallback(genresS, resolve);
        });
    } else {
        genresS += matchMovieGenres(genreIds);

        mainCallback(genresS, resolve);
    }
}

function getVideosReviewsSimilar(movieId, mainCallback) {
    let movieDetails = {};

    getUrl("/movie/" + movieId, ["append_to_response=videos,reviews,similar"], function callback(responseJson) {
        // let allGenres = responseJson["genres"];
        // console.log(responseJson);
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

function showMoviesCallback(responseJson) {
    let movies = responseJson["results"];
    // console.log(movies);
    if (nextPage > responseJson["total_pages"]) {
        nextPage--;
        return;
    }
    let i = 0;

    if ($("#searchBar").val()) {
        $("#moviesList").empty();
    }

    buildCards(movies, function callback(moviesCardsS) {
        // console.log(moviesCardsS);

        document.getElementById("moviesList").innerHTML += moviesCardsS;
    })
}

let lastSearchText = null;

function showMovies(pageNum) {
    // primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    let moviesCardsS;
    let searchText = $("#searchBar").val();

    if (!searchText) {
        if (lastSearchText) {
            $("#moviesList").empty();
        }
        getUrl("/movie/now_playing", ["page=" + pageNum], showMoviesCallback);
        lastSearchText = null;
    } else {
        // console.log("ssssssssssssssssssssssssss----------->" + searchText + ", " + lastSearchText);
        // if (lastSearchText == null || (lastSearchText != searchText)) {
        // }
        firstSearch = true;
        getUrl("/search/movie", ["page=" + pageNum, "query=" + searchText], showMoviesCallback);
        lastSearchText = searchText;
    }
}

// function showMoviesSearchResults(searchText) {
//     // primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
//     let moviesCardsS;
//     getUrl("/search/movie", ["page=" + pageNum], function callback(responseJson) {
//         let movies = responseJson["results"];
//         console.log(movies);

//         let i = 0;

//         buildCards(movies, function callback(moviesCardsS) {
//             // console.log(moviesCardsS);

//             document.getElementById("moviesList").innerHTML += moviesCardsS;
//         })

//     });
// }

function showMovie(movieId) {
    getUrl("/movie/" + movieId, [], function callback(movie) {
        console.log(movie);
    });
}

console.log("api loaded");