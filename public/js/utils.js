function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // console.log(JSON.parse(xmlHttp.responseText)["genres"]);
            callback(JSON.parse(xmlHttp.responseText));
        }
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function dateGetYear(dateS) {
    if (!dateS)
        return null;

    return (new Date(dateS)).getFullYear();
}

function buildReview(review) {
    return `<li class="list-group-item"> <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-3" style="font-style:oblique">By ` + review["author"] + `</h6>
                </div>
                <p class="mb-1" style="text-align: left">` + review["content"] + `</p>
            </li>`;
}

function buildSimilarCard(similarMovie) {
    return `<div class='col-lg-3 d-flex align-items-strech' style="max-width: 14rem;">
            <div class="card bg-light mb-3">
            <img src="http://image.tmdb.org/t/p/w300` + similarMovie["poster_path"] + `" class="card-img-top" alt="Movie poster">
            <div class="card-body align-items-center d-flex justify-content-center" style="padding:0.5em">
                <h6 style="font-weight:300;margin:0;">` + similarMovie["original_title"] + `</h6>
            </div>
            </div>
        </div>`;
}

// function addListeners(thisElem) {
//     // let collapseElem = $("#" + collapseId);
//     // console.log(collapseElem.html());

//     $(thisElem).on('shown.bs.collapse', function() {
//         console.log("collapsed");
//         // window.location = "#" + $(this).attr("id");
//         thisElem.scrollIntoView({
//             block: 'start',
//             behavior: 'smooth'
//         });

//     });
//     // collapseElem.on('hidden.bs.collapse', function() {
//     //     console.log("collapsed");
//     //     let videoContainer = $("#" + $(this).attr("id") + " #videoContainer");
//     //     videoContainer.attr("src", "");
//     //     console.log("hidden");
//     //     // window.location = "#" + $(this).attr("id");
//     //     document.getElementById(collapseId).scrollIntoView({
//     //         block: 'start',
//     //         behavior: 'smooth'
//     //     });
//     //     // document.getElementById($(this).attr("id")).scrollTop -= 60;
//     //     // window.scrollBy(0, 10);
//     //     // do something…
//     // });
// }

function getElementY(elem) {
    return window.pageYOffset + elem.getBoundingClientRect().top
}

function doScrolling(element, duration) {
    var startingY = window.pageYOffset
    var elementY = getElementY(element)
        // If element is close to page's bottom then window will scroll only to some position above the element.
    var targetY = document.body.scrollHeight - elementY < window.innerHeight ? document.body.scrollHeight - window.innerHeight : elementY
    var diff = targetY - startingY
        // Easing function: easeInOutCubic
        // From: https://gist.github.com/gre/1650294
    var easing = function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
    var start

    if (!diff) return

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
        if (!start) start = timestamp
            // Elapsed miliseconds since start of scrolling.
        var time = timestamp - start
            // Get percent of completion in range [0, 1].
        var percent = Math.min(time / duration, 1)
            // Apply the easing.
            // It can cause bad-looking slow frames in browser performance tool, so be careful.
        percent = easing(percent)

        window.scrollTo(0, startingY + diff * percent)

        // Proceed with animation as long as we wanted it to.
        if (time < duration) {
            window.requestAnimationFrame(step)
        }
    })
}

function fillMovieDetails(thisElem, movieId) {
    let openedIconElem = $(thisElem).find("#openedIcon" + movieId);

    if ($(thisElem).attr("aria-expanded") === "true")
        return;

    console.log("fill movie details");


    getVideosReviewsSimilar(movieId, function callback(movieDetails) {
        // console.log(movieDetails);
        let videos = movieDetails["videos"],
            reviews = movieDetails["reviews"],
            similarMovies = movieDetails["similar"];
        // console.log(reviews[0]);

        let movieCollapse = $("#" + movieId);
        let videoIframeContainer = movieCollapse.find("#videoIframeContainer");

        movieCollapse.on('shown.bs.collapse', function() {
            console.log("collapsed");
            // window.location = "#" + $(this).attr("id");
            openedIconElem.show();

            movieCollapse.get(0).scrollIntoView({
                block: 'start',
                behavior: 'smooth'
            });
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

        movieCollapse.on('hidden.bs.collapse', function() {
            openedIconElem.hide();
        });

        // video
        if (videos[0] != null) {
            videoIframeContainer.append(`<iframe class="embed-responsive-item" id="videoContainer" style="align-self:center" width="50%" height="50%">
                                                </iframe>`);
            movieCollapse.find("#trailerTitle").show();

            let videoContainer = $("#" + movieId + " #videoContainer");
            let video = videos[0];
            let videoUrl = "";
            if (video["site"] === "YouTube") {
                videoUrl = "https://www.youtube-nocookie.com/embed/" + video["key"] + "?rel=0";
            } else if (video["site"] === "Vimeo") {
                videoUrl = "https://player.vimeo.com/video/" + video["key"];
            }


            // let source = $("#" + movieId + " #video");
            videoContainer.attr("src", videoUrl);
            videoIframeContainer.show();
            // videoContainer.load();
        } else {
            $("#" + movieId + " #trailerTitle").hide();
            videoIframeContainer.hide();
        }

        // reviews
        // console.log($("#" + movieId + " #reviewsList").html("hi"));
        let reviewsList = movieCollapse.find("#reviewsList");
        // console.log(reviewsList.html());
        reviewsList.empty();

        for (let i = 0; i < 2; i++) {
            if (reviews[i] == null)
                continue;
            reviewsList.append(buildReview(reviews[i]));
        }
        if (reviews.length === 0) {
            movieCollapse.find("#reviewsTitle").hide();
            reviewsList.hide();
        } else {
            movieCollapse.find("#reviewsTitle").show();
            reviewsList.show();
        }

        let similarCardsElem = $("#" + movieId + " #similarCards");
        similarCardsElem.empty();

        if (similarMovies.length === 0) {
            movieCollapse.find("#similarMoviesTitle").hide();
        } else {
            movieCollapse.find("#similarMoviesTitle").show();
        }

        similarMovies.forEach(similarMovie => {
            similarCardsElem.append(buildSimilarCard(similarMovie));
        });

    });
}

function showCards(movies, mainCallback) {
    let i = 0;
    // let moviesCardsS = "",
    let movieDetailsS = "";
    let cardsS = "";
    console.log("ooo");

    let requests = movies.reduce((promiseChain, movie) => {
        return promiseChain.then(() => new Promise((resolve) => {
            getGenresS(movie["genre_ids"], resolve, function callback(genresS, resolve) {

                if (i % 5 == 0) {
                    if (i != 0) {
                        // if (i == 20) {
                        //     cardS += `<div class="card">
                        //             </div>
                        //             `
                        // }
                        cardsS += "</div>";
                        moviesListElem.append(cardsS);
                        // cardsS += movieDetailsS;
                        moviesListElem.append(movieDetailsS);
                        // console.log(movieDetailsS);
                    }

                    if (i != 20) {
                        movieDetailsS = "";
                        cardsS = "";
                        cardsS += "<div class='row justify-content-center'>";
                    }
                }

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

                // if (i % 2 == 0) {
                //     cardS += "</div>";
                // }
                // getVideosReviewsSimilar(movie["id", ])
                if (i === movies.length - 1) {
                    console.log("haaa");
                    cardsS += "</div>";
                    moviesListElem.append(cardsS);
                    // cardsS += movieDetailsS;
                    moviesListElem.append(movieDetailsS);
                }
                // moviesCardsS += cardsS;

                i++;

                // console.log(moviesCardsS);

                resolve();
            });
        }));
    }, Promise.resolve());

    // console.log(moviesCardsS);

    requests.then(() => mainCallback())
}

// function showDetails(detailsId) {
//     var movieDetails = document.getElementById(detailsId);
//     var height = movieDetails.clientHeight;
//     var width = movieDetails.clientWidth;
//     // console.log(width + 'x' + height);
//     // initialize them (within hint.style)
//     movieDetails.style.height = height + 'px';
//     movieDetails.style.width = width + 'px';

//     if (movieDetails.style.display == 'none') {
//         movieDetails.style.display = 'block';
//         //movieDetails.style.opacity = '1';
//         movieDetails.style.height = height + 'px';
//         movieDetails.style.width = width + 'px';
//         movieDetails.style.padding = '.5em';
//     } else {
//         movieDetails.style.display = 'none';
//         //movieDetails.style.opacity = '0';
//         movieDetails.style.height = '0';
//         movieDetails.style.width = '0';
//         movieDetails.style.padding = '0';
//     }
// }
// function getDate(daysAgo) {
//     var today = new Date();

//     if (daysAgo > 0) {
//         today.setDate(today.getDate() - daysAgo);
//     }

//     var dd = today.getDate();
//     var mm = today.getMonth() + 1; //January is 0!
//     var yyyy = today.getFullYear();

//     if (dd < 10) {
//         dd = '0' + dd
//     }

//     if (mm < 10) {
//         mm = '0' + mm
//     }

//     return yyyy + '-' + mm + '-' + dd;
// }