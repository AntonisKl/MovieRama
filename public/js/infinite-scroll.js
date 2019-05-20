let nextPage = 1;
let infiniteScrollEnabled = true;

$(document).ready(function startInfiniteScroll() {
    let listElm = document.getElementById('moviesList');

    // Add 20 items.
    // var loadMore = function() {
    //     showInTheaterMovies()
    // }

    // Detect when scrolled to bottom.
    listElm.addEventListener('scroll', function() {
        // console.log("scrollTop = " + listElm.scrollTop + ", clientHeight = " + listElm.clientHeight + ", scrollHeight = " + listElm.scrollHeight + ", SUM = " + (listElm.scrollTop + listElm.clientHeight) + ", SUB = " + (listElm.scrollHeight - (0.1 * listElm.scrollHeight)));
        if (infiniteScrollEnabled === true && listElm.scrollTop !== 0 && listElm.scrollTop + listElm.clientHeight >= listElm.scrollHeight - (0.1 * listElm.scrollHeight)) {
            // $('.collapse').each(function() {
            //     $(this).on('shown.bs.collapse', function() {
            //         console.log("collapsed");
            //         // window.location = "#" + $(this).attr("id");
            //         document.getElementById($(this).attr("id")).scrollIntoView({
            //             block: 'start',
            //             behavior: 'smooth'
            //         });
            //         // document.getElementById($(this).attr("id")).scrollTop -= 60;
            //         // window.scrollBy(0, 10);
            //         // do something…
            //     });
            //     $(this).on('hidden.bs.collapse', function() {
            //         console.log("collapsed");
            //         let videoContainer = $("#" + $(this).attr("id") + " #videoContainer");
            //         videoContainer.attr("src", "");
            //         console.log("hidden");
            //         // window.location = "#" + $(this).attr("id");
            //         document.getElementById($(this).attr("id")).scrollIntoView({
            //             block: 'start',
            //             behavior: 'smooth'
            //         });
            //         // document.getElementById($(this).attr("id")).scrollTop -= 60;
            //         // window.scrollBy(0, 10);
            //         // do something…
            //     });
            // });
            // $('.collapse').collapse('hide');

            showMovies(curSearchText);
            console.log("heeey1");
        }
    });
    // console.log("scrollTop = " + listElm.scrollTop + ", clientHeight = " + listElm.clientHeight + ", scrollHeight = " + listElm.scrollHeight);
    // console.log("heeey");
    // Initially load some items.
    showMovies(null);
});