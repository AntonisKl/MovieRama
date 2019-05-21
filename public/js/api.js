const apiKey = "";
let moviesListElem, searchBarElem; // elements that are found and saved only once for optimization reasons

$(document).ready(function() {
    moviesListElem = $("#moviesList");
    searchBarElem = $("#searchBar");
})

// getUrl: creates the GET request's url and sends it to the function httpGet
function getUrl(endPoint, params, callback) {
    let paramsS = "";
    params.forEach(element => {
        paramsS += ("&" + element);
    })

    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}

let allGenres = null;

// matchMovieGenres: returns a string that contains the genre names that correspond to the genreIds
function matchMovieGenres(genreIds) {
    let movieGenresS = "";
    genreIds.forEach(genreId => {
        let foundGenre = allGenres.find(function(genre) {
            return genre["id"] == genreId;
        });

        movieGenresS += foundGenre["name"] + ", ";
    });

    return movieGenresS;
}

// getGenresS: sends a GET request for getting all genres only once, and passes the genre names that correspond to the genreIds to the mainCallback
function getGenresS(genreIds, resolve, mainCallback) {
    let genresS = "";

    if (!allGenres) { // genres need to be fetched for the first time
        getUrl("/genre/movie/list", [], function callback(responseJson) {
            allGenres = responseJson["genres"]; // save genres' array
            genresS += matchMovieGenres(genreIds); // create a string that contains the genre names that correspond to the genreIds

            mainCallback(genresS, resolve);
        });
    } else { // genres are already fetched
        genresS += matchMovieGenres(genreIds); // create a string that contains the genre names that correspond to the genreIds

        mainCallback(genresS, resolve);
    }
}

// getVideosReviewsSimilar: gets videos, reviews and similar movies of movie with id movieId by sending a single GET request
function getVideosReviewsSimilar(movieId, mainCallback) {
    let movieDetails = {};

    getUrl("/movie/" + movieId, ["append_to_response=videos,reviews,similar"], function callback(responseJson) {
        movieDetails["videos"] = responseJson["videos"]["results"];
        movieDetails["reviews"] = responseJson["reviews"]["results"];
        movieDetails["similar"] = responseJson["similar"]["results"];

        mainCallback(movieDetails); // pass the necessary response data to the callback
    });
}

let prevSearchText = null, // previous search input text
    curSearchText = null, // current search input text
    prevPage = null; // previous page requested

// this callback is used both when we show all movies and when we search for movies
function getMoviesCallback(responseJson) {
    let movies = responseJson["results"];
    // console.log(movies);
    if (movies.length === 0 && nextPage === 1) {
        moviesListElem.html(`<div class="no-results">
                                No Results :(
                            </div>`);

        return;
    }

    if (nextPage > responseJson["total_pages"]) {
        // not any more pages in the database, so reset nextPage counter and return
        nextPage--;
        return;
    }

    if ((curSearchText && prevSearchText !== curSearchText) || prevPage && (prevPage >= nextPage)) {
        // empty movies' list to prepare it for the new movies to be shown
        moviesListElem.empty();
    }

    let i = 0;

    showCards(movies, function callback() {
        startObserving(); // start observing images for lazy load
        infiniteScrollEnabled = true; // ready to make the next request (if any) of infinite scroll
        prevPage = nextPage++; // update prevPage and progress nextPage
        prevSearchText = curSearchText; // update prevSearchText
    })
}

// showMovies: shows all movies or the movies that are corresponding to the given search input
// searchText === null -> shows all movies
// searchText != null && searchText !== "" -> shows movies by searching
function showMovies(searchText) {
    curSearchText = searchText; // update curSearchText

    if (!curSearchText) {
        if (prevSearchText) {
            moviesListElem.empty();
        }
        infiniteScrollEnabled = false; // disable infinite scroll requests while processing the current request
        prevSearchText = null; // update prevSearchText
        getUrl("/movie/now_playing", ["page=" + nextPage], getMoviesCallback); // send GET request for all movies
    } else {
        infiniteScrollEnabled = false; // disable infinite scroll requests while processing the current request
        getUrl("/search/movie", ["page=" + nextPage, "query=" + curSearchText], getMoviesCallback); // send GET request for search movies
    }
}