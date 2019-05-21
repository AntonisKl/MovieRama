const config = {
    rootMargin: '50px',
    threshold: 0
};

let observer = null;

// startObserving: starts observing all the images that can be lazy-loaded
function startObserving() {
    if (!observer) { // if observer is not initialized, initialize it
        observer = new IntersectionObserver(function(entries, self) {
            // iterate over each entry
            entries.forEach(entry => {

                let entryJquery = $(entry.target);
                // process just the images that are in the viewport
                if (entry.isIntersecting) {
                    // start loading image
                    entryJquery.attr("src", entryJquery.attr("data-src"));
                    // the image is now in place, stop watching
                    self.unobserve(entry.target);
                }
                // else if (entry.intersectionRatio <= 0) {
                //     entryJquery.removeAttr("src");
                // }
            });
        }, config);
    }

    // get all images that can be lazy-loaded
    const imgs = document.querySelectorAll('[data-src]');
    imgs.forEach(img => {
        // start observing each image
        observer.observe(img);
    });
}