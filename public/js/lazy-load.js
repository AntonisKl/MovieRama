const config = {
    root: $("#moviesList").get(0),
    rootMargin: '50px',
    threshold: 0
};

let observer = null,
    isLeaving = {};

function startObjerving() {
    // register the config object with an instance
    // of intersectionObserver
    if (!observer) {
        observer = new IntersectionObserver(function(entries, self) {
            // iterate over each entry
            entries.forEach(entry => {
                // console.log(entry.intersectionRatio);

                // process just the images that are intersecting.
                // isIntersecting is a property exposed by the interface
                let entryJquery = $(entry.target);
                if (entry.isIntersecting) {
                    // custom function that copies the path to the img
                    // from data-src to src
                    // console.log(entryJquery);
                    entryJquery.attr("src", entryJquery.attr("data-src"));
                    // isLeaving[entryJquery.attr("id")] = true;
                    // the image is now in place, stop watching
                    // self.unobserve(entry.target);
                }
                // else if (entry.intersectionRatio <= 0) {
                //     entryJquery.removeAttr("src");
                // }
                // else if (isLeaving[entryJquery.attr("id")]) {
                //     // entryJquery.attr("data-src", entryJquery.attr("src"));
                //     entryJquery.attr("src", "");
                //     isLeaving[entryJquery.attr("id")] = false;
                // }
            });
        }, config);
    }

    const imgs = document.querySelectorAll('[data-src]');
    imgs.forEach(img => {
        // console.log("hoyyy");
        observer.observe(img);
    });
}