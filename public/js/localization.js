let language, // default: english
    // locale strings map
    strings = {
        "el": {
            "no_results": "Δεν βρέθηκαν αποτελέσματα",
            "overview": "Περιγραφή",
            "genres": "Κατηγορίες",
            "reviews": "Κριτικές",
            "trailer": "Trailer",
            "similar_movies": "Παρόμοιες ταινίες",
            "rating": "Βαθμολογία",
            "release_year": "Έτος κυκολφορίας",
            "by_user": "Από τον χρήστη",
            "read_more": "ΠΕΡΙΣΣΟΤΕΡΑ"
        },
        "en": {
            "no_results": "No results",
            "overview": "Overview",
            "genres": "Genres",
            "reviews": "Reviews",
            "trailer": "Trailer",
            "similar_movies": "Similar movies",
            "rating": "Rating",
            "release_year": "Release year",
            "by_user": "By",
            "read_more": "READ MORE"
        }
    },
    languageImgElem;

$(document).ready(function() {
    languageImgElem = $("#languageImg");

    setLanguage(sessionStorage.getItem('lang')); // set language to the previously preferred one
})

// setLanguage: sets the language to the desired one (English or Greek)
function setLanguage(langS) {
    if (langS === "el") {
        languageImgElem.attr("src", grImgUrl);
        language = "el";
        sessionStorage.setItem('lang', 'el'); // store language choice
    } else { // default 
        languageImgElem.attr("src", engImgUrl);
        language = "en";
        sessionStorage.setItem('lang', 'en'); // store language choice
    }
}

// toggleLanguage: handles the change of language
function toggleLanguage() {
    setLanguage(language === "en" ? "el" : "en");

    getAndStoreAllGenres(function() { // fetch genres of the current language
        searchBarElem.keyup(); // trigger search
    });
}

// getString: returns the correct string according to the current locale
function getString(key) {
    return strings[language][key];
}