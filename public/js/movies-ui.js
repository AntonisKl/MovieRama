// global variables
let prevSearchText = null, // previous search input text
    curSearchText = null, // current search input text
    prevPage = null; // previous page requested

// buildReview: returns review's html
function buildReview(review) {
    let reviewContentSizeBig = review["content"].length > 1450; // >1450 characters is more than 6 lines on full hd screen
    return `<li class="list-group-item"> 
                <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-3" style="font-style:oblique">` + getString("by_user") + ` ` + review["author"] + `</h6>
                </div>
                <p id="` + review["id"] + `" class="` + (reviewContentSizeBig === true ? `review` : `review-whole`) + ` mb-1" style="text-align: left">` + review["content"] + `</p>
                ` + (reviewContentSizeBig === true ? `<div style="text-align: right;width: 100%;"><button class="btn btn-secondary btn-sm text-white mr-0" onclick="showWholeReview(this, '` + review["id"] + `');">` + getString("read_more") + `</button></div>` : ``) +
        `</li>`;
}

// buildSimilarCard: returns a similar movie's card inside a responsive column
function buildSimilarCard(similarMovie) {
    return `<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9 d-flex align-items-stretch' style="max-width: 14rem;">
            <div onclick="searchForMovie('` + similarMovie["original_title"] + `')" class="card card-hoverable bg-light my-3">
            <div class="text-center bg-light">

            <img src="http://image.tmdb.org/t/p/w185_and_h278_bestv2` + similarMovie["poster_path"] + `" class="card-img-top similar-card-img-top w-auto" alt="Movie poster">
            </div>

            <div class="card-body align-items-center d-flex justify-content-center" style="padding:0.5em">
                <h6 style="font-weight:300;margin:0;">` + similarMovie["original_title"] + `</h6>
            </div>
            </div>
        </div>`;
}

// fillMovieDetails: puts the details of the movie with id movieId into the corresponding dropdown/collapsible and handles the showing/hiding of the collapsible
// thisElem: current movie's card element
function fillMovieDetails(thisElem, movieId) {
    let openedIconElem = $(thisElem).find("#openedIcon" + movieId);
    let movieCollapse = $("#" + movieId); // collapsible element

    if ($(thisElem).attr("data-expanded") === "true") { // if current collapsible is open, close it and return
        movieCollapse.collapse("hide");
        return;
    }

    getVideosReviewsSimilar(movieId, function callback(movieDetails) {
        let videos = movieDetails["videos"],
            reviews = movieDetails["reviews"],
            similarMovies = movieDetails["similar"];

        let videoIframeContainer = movieCollapse.find("#videoIframeContainer");

        // add on shown delegate
        $('body').on('shown.bs.collapse', "#" + movieId, function() {
            openedIconElem.show();

            movieCollapse.get(0).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
            $('body').off('shown.bs.collapse', "#" + movieId, this);

            $(thisElem).attr("data-expanded", "true");
        });

        // add on hidden delegate
        $('body').on('hidden.bs.collapse', "#" + movieId, function() {
            openedIconElem.hide();

            $('body').off('hidden.bs.collapse', "#" + movieId, this);

            $(thisElem).attr("data-expanded", "false");
        });

        // trailer
        if (videos[0] != null) {
            // add iframe element
            videoIframeContainer.append(`<iframe class="embed-responsive-item" id="videoContainer" style="align-self:center" width="50%" height="50%">
                                                </iframe>`);
            movieCollapse.find("#trailerTitle").show();

            let videoContainer = movieCollapse.find("#videoContainer");
            let video = videos[0]; // first trailer
            let videoUrl = "";
            if (video["site"] === "YouTube") {
                videoUrl = "https://www.youtube-nocookie.com/embed/" + video["key"] + "?rel=0";
            } else if (video["site"] === "Vimeo") {
                videoUrl = "https://player.vimeo.com/video/" + video["key"];
            }


            videoContainer.attr("src", videoUrl);
            videoIframeContainer.show(); // show trailer element
        } else { // no trailers
            // hide trailer related elements
            movieCollapse.find("#trailerTitle").hide();
            videoIframeContainer.hide();
        }

        // reviews
        let reviewsList = movieCollapse.find("#reviewsList");

        reviewsList.empty(); // empty reviews list element

        // add the first two reviews if they are valid
        for (let i = 0; i < 2; i++) {
            if (reviews[i] == null)
                continue;
            reviewsList.append(buildReview(reviews[i])); // show to reviews list
        }

        if (reviews.length === 0) { // no reviews
            movieCollapse.find("#reviewsTitle").hide();
            reviewsList.hide();
        } else {
            movieCollapse.find("#reviewsTitle").show();
            reviewsList.show();
        }

        // similar movies
        let similarCardsElem = $("#" + movieId + " #similarCards");

        similarCardsElem.empty(); // empty reviews list element

        if (similarMovies.length === 0) { // no similar movies
            movieCollapse.find("#similarMoviesTitle").hide();
            movieCollapse.collapse("show"); // show current collapsible to the user
            return;
        } else {
            movieCollapse.find("#similarMoviesTitle").show();
        }

        similarMovies.forEach(similarMovie => {
            similarCardsElem.append(buildSimilarCard(similarMovie)); // add similar movie's card to similar movies list element
        });

        movieCollapse.collapse("show"); // show current collapsible to the user
    });
}

// showCards: shows movies' cards (5 in each row) by using a Promise chain to make sure that the movies will be shown in the correct order every time
function showCards(movies) {
    let i = 0;
    let movieDetailsS = "";
    let cardsS = "";

    // create rows each of which contains 5 movie cards
    movies.forEach(movie => {
        let genresS = matchMovieGenres(movie["genre_ids"]);

        if (i % 5 == 0) {
            if (i != 0) { // if this isn't the first movie
                cardsS += "</div>"; // close row's div
                moviesListElem.append(cardsS); // show row of 5 cards
                moviesListElem.append(movieDetailsS); // add the hidden dropdowns/collapsibles for the current 5 cards
            }

            movieDetailsS = ""; // reset movies collapsibles string
            cardsS = ""; // reset movies cards string
            cardsS += "<div class='row justify-content-center'>"; // start new row
        }

        // build current movie's card inside a responsive column
        cardsS += `
                <div class='col-lg-2 d-flex align-items-strech mx-2 my-4'>
                    <div onclick= "fillMovieDetails(this, ` + movie["id"] + `);" data-expanded="false" class="card card-hoverable hoverable">
                        ` + (!movie["poster_path"] ? `` : `<img class="card-img-top" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 2 3%22 /%3E" data-src="http://image.tmdb.org/t/p/w300_and_h450_bestv2` + movie["poster_path"] + `" alt="Movie poster">`) +
            `<div class="card-body d-flex flex-column">
                            <h5 class="card-title main-card-title">` + movie["original_title"] + `</h5>
                            ` + (!movie["overview"] ? `` : ` <p class="movie-overview">` + movie["overview"] + `</p>`) +
            `<div class="card-items-container mt-auto">` +
            (!dateGetYear(movie["release_date"]) ? `` : `<div align="left" class="movie-item"><img title="` + getString("release_year") + `" class="card-icon" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22 /%3E" data-src="assets/calendar.png" />` + dateGetYear(movie["release_date"]) + `</div>`) +
            (!genresS ? `` : `<div align="left" class="movie-item"><img title="` + getString("genres") + `" class="card-icon" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22 /%3E"
                     data-src="assets/masks.png" />` + genresS + `</div>`) +
            `<div align="left" class="movie-item"><img title="` + getString("rating") + `" class="card-icon" src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22 /%3E" data-src="assets/star.png" /> ` + movie["vote_average"] + `</div>
                     </div>
                     <i id="openedIcon` + movie["id"] + `" class="card-opened-icon fa fa-chevron-circle-down mx-auto"> </i>
                        </div>
                    </div>
                </div>
                    `;

        // build current movie's dropdown/collapsible
        movieDetailsS += `<div class="collapse my-3" id="` + movie["id"] + `">
                                    <div class="card text-white bg-secondary">
                                        <div class="card-body" style="text-align:center;width: 80%;text-align: center;align-self: center;" >
                                            <h5 class="card-title" style="align-self:center">` + movie["original_title"] + `</h5>
                                            ` + (!movie["overview"] ? `` : `<h5 style="align-self:center;font-weight: 200;">` + getString("overview") + `</h5>
                                            <p>` + movie["overview"] + `</p>`) + `  
                                            <h5 style="align-self:center;font-weight: 200;">` + getString("genres") + `</h5>
                                            <p>` + genresS + `</p>
                                            <h5 id="trailerTitle" style="align-self:center;font-weight: 200;">` + getString("trailer") + `</h5>
                                            <div id="videoIframeContainer" class="embed-responsive embed-responsive-16by9" style="margin-bottom:1rem;">
                                            </div>
                                            <h5 id="reviewsTitle" style="align-self:center;font-weight: 200;">` + getString("reviews") + `</h5>
                                            <ul class="list-group" id="reviewsList"> 
                                            </ul>
                                            <h5 id="similarMoviesTitle" style="align-self:center;font-weight: 200;">` + getString("similar_movies") + `</h5>
                                            <div class="container-fluid"> 
                                                <div id="similarCards" class="row similar-cards-row flex-row">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;

        if (i === movies.length - 1) { // last movie to be shown
            cardsS += "</div>";
            moviesListElem.append(cardsS); // show row of 5 cards
            moviesListElem.append(movieDetailsS); // add the hidden dropdowns/collapsibles for the current 5 cards
        }

        i++;
    });

    startObserving(); // start observing images for lazy load
    infiniteScrollEnabled = true; // ready to make the next request (if any) of infinite scroll
    prevPage = nextPage++; // update prevPage and progress nextPage
    prevSearchText = curSearchText; // update prevSearchText
}

// this callback is used both when we show all movies and when we search for movies
function getMoviesCallback(responseJson) {
    let movies = responseJson["results"];

    if (movies.length === 0 && nextPage === 1) { // no results
        moviesListElem.html(`<div class="no-results">
                                ` + (language === "el" ? `Δεν βρέθηκαν αποτελέσματα` : `No results`) + ` :(
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
        // fetch all genres first because there aren't any stored
        getAndStoreAllGenres(function callback() {
            showCards(movies);
        });
    } else { // genres are stored so we can proceed to show the movies' cards
        showCards(movies);
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