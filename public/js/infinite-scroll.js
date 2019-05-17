$(document).ready(function startInfiniteScroll() {
    let listElm = document.getElementById('moviesList');

    // Add 20 items.
    let nextPage = 1;
    // var loadMore = function() {
    //     showInTheaterMovies()
    // }

    // Detect when scrolled to bottom.
    listElm.addEventListener('scroll', function() {
        // console.log("scrollTop = " + listElm.scrollTop + ", clientHeight = " + listElm.clientHeight + ", scrollHeight = " + listElm.scrollHeight);
        if (listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight) {
            showInTheaterMovies(nextPage++);
        }
    });
    // console.log("scrollTop = " + listElm.scrollTop + ", clientHeight = " + listElm.clientHeight + ", scrollHeight = " + listElm.scrollHeight);

    // Initially load some items.
    showInTheaterMovies(nextPage++);
})