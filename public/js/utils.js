// global variables
let moviesListElem, searchClearElem; // elements that are found and saved only once for optimization reasons 

// initialize global element variables and set language
$(document).ready(function() {
    moviesListElem = $("#moviesList");
    searchClearElem = $("#searchClear");
})

// httpGet: sends an http GET request and calls callback when a response is received
// also, it passes the response text as JSON to the callback function
function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(JSON.parse(xmlHttp.responseText));
        }
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

// dateGetYear: returns the full year in which dateS string refers to
function dateGetYear(dateS) {
    if (!dateS) // empty, null or undefined date string
        return null;

    return (new Date(dateS)).getFullYear();
}

function toggleSearchClearIconVisibility(searchText) {
    if (searchText) {
        searchClearElem.css('visibility', 'visible');
        searchClearElem.css('opacity', '1');
    } else {
        searchClearElem.css('opacity', '0');
        searchClearElem.css('visibility', 'hidden');
    }
}

// showWholeReview: shows the whole review with id reviewId and hides read more button
function showWholeReview(readMoreElem, reviewId) {
    $(readMoreElem).hide();
    $("#" + reviewId).attr("class", "review-whole mb-1");
}

// searchForMovie: changes search input text value and triggers search
function searchForMovie(movieTitle) {
    searchBarElem.val(movieTitle);
    searchBarElem.keyup(); // trigger search
}

// matchMovieGenres: returns a string that contains the genre names that correspond to the genreIds
function matchMovieGenres(genreIds) {
    let movieGenresS = "";
    genreIds.forEach(genreId => {
        let foundGenre = allGenres.find(function(genre) {
            return genre["id"] == genreId;
        });

        movieGenresS += foundGenre["name"] + ", ";
    });

    return movieGenresS.substring(0, movieGenresS.length - 2);
}