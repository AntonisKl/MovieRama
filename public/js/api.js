// global variables
const apiKey = "";
let allGenres = null; // variable in which all the movie DB's genres are stored
let prevSearchText = null, // previous search input text
    curSearchText = null, // current search input text
    prevPage = null; // previous page requested

// getUrl: creates the GET request's url and sends it to the function httpGet
function getUrl(endPoint, params, callback) {
    let paramsS = "";
    params.forEach(element => {
        paramsS += ("&" + element);
    })

    let url = "https://api.themoviedb.org/3" + endPoint + "?api_key=" + apiKey + paramsS;

    httpGet(url, callback);
}


// getAndStoreAllGenres: gets all genres and stores them in the global variable allGenres
function getAndStoreAllGenres(mainCallback) {
    getUrl("/genre/movie/list", [], function callback(responseJson) {
        allGenres = responseJson["genres"]; // store genres' array

        mainCallback();
    });
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

// afterShowCards: called after showCards function
// function afterShowCards() {
//     startObserving(); // start observing images for lazy load
//     infiniteScrollEnabled = true; // ready to make the next request (if any) of infinite scroll
//     prevPage = nextPage++; // update prevPage and progress nextPage
//     prevSearchText = curSearchText; // update prevSearchText
// }

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
        moviesListElem.get(0).scrollTop = 0; // scroll list to top
    }

    let i = 0;

    if (!allGenres) {
        // fetch all genres because there aren't any stored
        getAndStoreAllGenres(function callback() {
            showCards(movies);
            // afterShowCards();
        });
    } else { // genres are stored so we can proceed to show the movies' cards
        showCards(movies);
        // afterShowCards();
    }

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