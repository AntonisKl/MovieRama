let nextPage = 1, // indicates the next page's number that is about to be fetched
    infiniteScrollEnabled = true; // used to disable/enable infinite scroll depending on whether a request is already being processed or not

$(document).ready(function startInfiniteScroll() {
    let listElm = document.getElementById('moviesList');

    // Detect when scrolled to bottom.
    listElm.addEventListener('scroll', function() {
        if (infiniteScrollEnabled === true && listElm.scrollTop !== 0 && listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight - (0.1 * listElm.scrollHeight)) {
            // show the next 20 movies (the nextPage global variable is progressed inside showMovies function)
            showMovies(curSearchText);
        }
    });

    // initially load the first 20 movies
    showMovies(null);
});