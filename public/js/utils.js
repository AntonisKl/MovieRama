function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            console.log(JSON.parse(xmlHttp.responseText)["genres"]);
            callback(JSON.parse(xmlHttp.responseText));
        }
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function dateGetYear(dateS) {
    return (new Date(dateS)).getFullYear();
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

function buildCards(movies, mainCallback) {
    let i = 0;
    let moviesCardsS = "";

    let requests = movies.reduce((promiseChain, movie) => {
        return promiseChain.then(() => new Promise((resolve) => {
            getGenresS(movie["genre_ids"], resolve, function callback(genresS, resolve) {
                let cardS = "";

                if (i % 5 == 0) {
                    if (i != 0) {
                        // if (i == 20) {
                        //     cardS += `<div class="card">
                        //             </div>
                        //             `
                        // }
                        cardS += "</div>";
                    }
                    if (i != 20) {
                        cardS += "<div class='row justify-content-center'>";
                    }
                }

                cardS += `
                <div class='col-lg-2 d-flex align-items-stretch'>
                <div class="card">
                        <img class="card-img-top" src="` + "http://image.tmdb.org/t/p/w300" + movie["poster_path"] + `" alt="Card image cap">
                        <div class="card-body">
                            <h5 class="card-title">` + movie["original_title"] + `</h5>
                            <p class="card-text">
                                <p class="movie-overview">` + movie["overview"] + `</p>
                                <div align="left" class="movie-item"><img class="card-icon" src="assets/calendar.png" />` + dateGetYear(movie["release_date"]) + `</div>
                                <div align="left" class="movie-item"><img class="card-icon" src="assets/masks.png" />` + genresS.substring(0, genresS.length - 2) + `</div>
                                <div align="left" class="movie-item"><img class="card-icon" src="assets/star.png" /> ` + movie["vote_average"] + `</div>
                            </p>
                        </div>
                    </div>
                    </div>`;

                // if (i % 2 == 0) {
                //     cardS += "</div>";
                // }

                moviesCardsS += cardS;

                i++;

                // console.log(moviesCardsS);

                resolve();
            });
        }));
    }, Promise.resolve());

    // console.log(moviesCardsS);

    requests.then(() => mainCallback(moviesCardsS))
}

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