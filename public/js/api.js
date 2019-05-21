// import { getDate } from './utils.js'; // or './module'

let apiKey = "";
let firstSearch = false;
let moviesListElem, searchBarElem;

$(document).ready(function() {
    moviesListElem = $("#moviesList");
    searchBarElem = $("#searchBar");
})

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

let prevSearchText = null,
    curSearchText = null,
    prevPage = null;

function getMoviesCallback(responseJson) {
    let movies = responseJson["results"];
    console.log(movies);
    if (movies.length === 0 && nextPage === 1) {
        // moviesListElem.html("no results");
        moviesListElem.html(`<div class="no-results">
                                No Results :(
                            </div>`);

        return;
    }

    console.log(nextPage);
    if (nextPage > responseJson["total_pages"]) {
        nextPage--;
        return;
    }
    console.log("prev " + prevSearchText + ", cur " + curSearchText);
    if ((curSearchText && prevSearchText !== curSearchText) || prevPage && (prevPage >= nextPage)) {
        console.log("empty");
        moviesListElem.empty();
    }

    let i = 0;

    // if (searchBarElem.val()) {
    //     moviesListElem.empty();
    // }
    // if (lastSearchText == null || (lastSearchText != searchText)) {
    //     moviesListElem.empty();
    // }

    showCards(movies, function callback() {
        // console.log("heey");

        startObjerving();
        // console.log("heey");
        // moviesListElem.append(moviesCardsS);
        infiniteScrollEnabled = true;
        prevPage = nextPage++;
        prevSearchText = curSearchText;
    })
}


function showMovies(searchText) {
    // primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22
    let moviesCardsS;
    curSearchText = searchText;

    // if (prevSearchText && curSearchText && prevSearchText === curSearchText)
    //     return;

    if (!curSearchText) {
        if (prevSearchText) {
            moviesListElem.empty();
        }
        infiniteScrollEnabled = false;
        prevSearchText = null;
        getUrl("/movie/now_playing", ["page=" + nextPage], getMoviesCallback);
    } else {
        // console.log("ssssssssssssssssssssssssss----------->" + curSearchText + ", " + prevSearchText);
        // if (lastSearchText == null || (lastSearchText != searchText)) {
        //     moviesListElem.empty();
        // }

        // if (lastSearchText != searchText) {
        //     moviesListElem.empty();
        // }

        firstSearch = true;
        infiniteScrollEnabled = false;
        getUrl("/search/movie", ["page=" + nextPage, "query=" + curSearchText], getMoviesCallback);
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

console.log("api loaded")