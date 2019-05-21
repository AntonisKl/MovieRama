let nextPage = 1;
let infiniteScrollEnabled = true;

$(document).ready(function startInfiniteScroll() {
    let listElm = document.getElementById('moviesList');

    // Detect when scrolled to bottom.
    listElm.addEventListener('scroll', function() {
        // console.log("scrollTop = " + listElm.scrollTop + ", clientHeight = " + listElm.clientHeight + ", scrollHeight = " + listElm.scrollHeight + ", SUM = " + (listElm.scrollTop + listElm.clientHeight) + ", SUB = " + (listElm.scrollHeight - (0.1 * listElm.scrollHeight)));
        if (infiniteScrollEnabled === true && listElm.scrollTop !== 0 && listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight - (0.1 * listElm.scrollHeight)) {
            // show the next 20 movies (the nextPage variable is progressed inside showMovies function)
            showMovies(curSearchText);
        }
    });

    // initially load the first 20 movies
    showMovies(null);
});