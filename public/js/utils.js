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

// showWholeReview: shows the whole review with id reviewId and hides read more button
function showWholeReview(readMoreElem, reviewId) {
    $(readMoreElem).hide();
    $("#" + reviewId).attr("class", "review-whole mb-1");
}

// buildReview: returns review's html
function buildReview(review) {
    let reviewContentSizeBig = review["content"].length > 1450; // >1450 characters is more than 6 lines on full hd screen
    return `<li class="list-group-item"> 
                <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-3" style="font-style:oblique">By ` + review["author"] + `</h6>
                </div>
                <p id="` + review["id"] + `" class="` + (reviewContentSizeBig === true ? `review` : `review-whole`) + ` mb-1" style="text-align: left">` + review["content"] + `</p>
                ` + (reviewContentSizeBig === true ? `<div style="text-align: right;width: 100%;"><button class="btn btn-secondary btn-sm text-white mr-0" onclick="showWholeReview(this, '` + review["id"] + `');">Read more</button></div>` : ``) +
        `</li>`;
}

// buildSimilarCard: returns a similar movie's card inside a responsive column
function buildSimilarCard(similarMovie) {
    return `<div class='col-xs-9 col-sm-9 col-md-9 col-lg-9 d-flex align-items-stretch' style="max-width: 14rem;">
            <div class="card bg-light mb-3">
            <img src="http://image.tmdb.org/t/p/w300` + similarMovie["poster_path"] + `" class="card-img-top" alt="Movie poster">
            <div class="card-body align-items-center d-flex justify-content-center" style="padding:0.5em">
                <h6 style="font-weight:300;margin:0;">` + similarMovie["original_title"] + `</h6>
            </div>
            </div>
        </div>`;
}

// function getElementY(elem) {
//     return window.pageYOffset + elem.getBoundingClientRect().top
// }

// function doScrolling(element, duration) {
//     var startingY = window.pageYOffset
//     var elementY = getElementY(element)
//         // If element is close to page's bottom then window will scroll only to some position above the element.
//     var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
//     var diff = targetY - startingY
//         // Easing function: easeInOutCubic
//         // From: https://gist.github.com/gre/1650294
//     var easing = function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
//     var start

//     if (!diff) return

//     // Bootstrap our animation - it will get called right before next frame shall be rendered.
//     window.requestAnimationFrame(function step(timestamp) {
//         if (!start) start = timestamp
//             // Elapsed miliseconds since start of scrolling.
//         var time = timestamp - start
//             // Get percent of completion in range [0, 1].
//         var percent = Math.min(time / duration, 1)
//             // Apply the easing.
//             // It can cause bad-looking slow frames in browser performance tool, so be careful.
//         percent = easing(percent)

//         window.scrollTo(0, startingY + diff * percent)

//         // Proceed with animation as long as we wanted it to.
//         if (time < duration) {
//             window.requestAnimationFrame(step)
//         }
//     })
// }

// fillMovieDetails: puts the details of the movie with id movieId into the corresponding dropdown/collapsible
// thisElem: current movie's collapsible element
function fillMovieDetails(thisElem, movieId) {
    let openedIconElem = $(thisElem).find("#openedIcon" + movieId);

    if ($(thisElem).attr("aria-expanded") === "true") // if current collapsible is closing return
        return;

    getVideosReviewsSimilar(movieId, function callback(movieDetails) {
        let videos = movieDetails["videos"],
            reviews = movieDetails["reviews"],
            similarMovies = movieDetails["similar"];

        let movieCollapse = $("#" + movieId); // collapsible element
        let videoIframeContainer = movieCollapse.find("#videoIframeContainer");

        movieCollapse.off('shown.bs.collapse');
        // add on shown listener
        movieCollapse.on('shown.bs.collapse', function() {
            console.log("hi");
            openedIconElem.show();

            movieCollapse.get(0).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });

            // $([document.documentElement, document.body]).animate({
            //     scrollTop: movieCollapse.offset().top
            // }, 2000);
            // moviesListElem.scroll({
            //     top: $(this).position().top,
            //     left: 0,
            //     behavior: 'smooth'
            // });
            // doScrolling.bind(null, movieCollapse.get(0), 1000);

            // if (movieCollapse.hash !== "") {
            // Prevent default anchor click behavior
            // event.preventDefault();

            // // Store hash
            // var hash = movieCollapse.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            // moviesListElem.animate({
            //     scrollTop: $(this).position().top
            // }, 800);
            // } // End if

        });

        movieCollapse.off('hidden.bs.collapse');
        // add on hidden listener
        movieCollapse.on('hidden.bs.collapse', function() {
            openedIconElem.hide();
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

        console.log(reviews);
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
            return;
        } else {
            movieCollapse.find("#similarMoviesTitle").show();
        }

        similarMovies.forEach(similarMovie => {
            similarCardsElem.append(buildSimilarCard(similarMovie)); // add similar movie's card to similar movies list element
        });
    });
}

// showCards: shows movies' cards (5 in each row) by using a Promise chain to make sure that the movies will be shown in the correct order every time
function showCards(movies, mainCallback) {
    let i = 0;
    let movieDetailsS = "";
    let cardsS = "";

    let requests = movies.reduce((promiseChain, movie) => {
        return promiseChain.then(() => new Promise((resolve) => {
            getGenresS(movie["genre_ids"], resolve, function callback(genresS, resolve) {

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
                    <div onclick= "fillMovieDetails(this, ` + movie["id"] + `);" data-toggle="collapse" data-target="#` + movie["id"] + `" aria-expanded="false" aria-controls="movieDetails" class="card hoverable">
                        ` + (!movie["poster_path"] ? `` : `<img class="card-img-top" data-src="http://image.tmdb.org/t/p/w300` + movie["poster_path"] + `" alt="Movie poster">`) +
                    `<div class="card-body d-flex flex-column">
                            <h5 class="card-title main-card-title">` + movie["original_title"] + `</h5>
                            ` + (!movie["overview"] ? `` : ` <p class="movie-overview">` + movie["overview"] + `</p>`) +
                    `<div class="card-items-container mt-auto">` +
                    (!dateGetYear(movie["release_date"]) ? `` : `<div align="left" class="movie-item"><img class="card-icon" data-src="assets/calendar.png" />` + dateGetYear(movie["release_date"]) + `</div>`) +
                    (!genresS ? `` : `<div align="left" class="movie-item"><img class="card-icon" data-src="assets/masks.png" />` + genresS.substring(0, genresS.length - 2) + `</div>`) +
                    `<div align="left" class="movie-item"><img class="card-icon" data-src="assets/star.png" /> ` + movie["vote_average"] + `</div>
                     </div>
                     <i id="openedIcon` + movie["id"] + `" class="card-opened-icon fa fa-circle mx-auto"> </i>
                        </div>
                    </div>
                </div>
                    `;

                // build current movie's dropdown/collapsible
                movieDetailsS += `<div class="collapse my-3" id="` + movie["id"] + `">
                                    <div class="card text-white bg-secondary">
                                        <div class="card-body" style="text-align:center;width: 80%;text-align: center;align-self: center;" >
                                            <h5 class="card-title" style="align-self:center">` + movie["original_title"] + `</h5>
                                            <h5 id="trailerTitle" style="align-self:center;font-weight: 200;">Trailer</h5>
                                            <div id="videoIframeContainer" class="embed-responsive embed-responsive-16by9" style="margin-bottom:1rem;">
                                            </div>
                                            ` + (!movie["overview"] ? `` : `<h5 style="align-self:center;font-weight: 200;">Overview</h5>
                                            <p>` + movie["overview"] + `</p>`) + `  
                                            <h5 id="reviewsTitle" style="align-self:center;font-weight: 200;">Reviews</h5>
                                            <ul class="list-group" id="reviewsList"> 
                                            </ul>
                                            <h5 id="similarMoviesTitle" style="align-self:center;font-weight: 200;">Similar movies</h5>
                                            <div class="container-fluid"     style="padding-top: 1rem;"> 
                                                <div id="similarCards" class="row flex-row flex-nowrap" style="margin:0;overflow:auto;">
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

                resolve(); // resolve promise
            });
        }));
    }, Promise.resolve());

    requests.then(() => mainCallback()) // after all movies' card have been shown in the correct order, call the mainCallback function
}