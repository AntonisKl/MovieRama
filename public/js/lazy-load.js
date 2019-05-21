const config = {
    rootMargin: '50px',
    threshold: 0
};

// placeholder SVG images to prevent content reflow caused by lazy-loading
let imgPlaceholder1x1 = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22 /%3E",
    imgPlaceholder2x3 = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 2 3%22 /%3E";
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
                    // self.unobserve(entry.target);
                } else if (entry.intersectionRatio <= 0) {
                    // entryJquery.removeAttr("src");
                    if (entryJquery.hasClass("card-icon"))
                        entryJquery.attr("src", imgPlaceholder1x1);
                    else
                        entryJquery.attr("src", imgPlaceholder2x3);
                }
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