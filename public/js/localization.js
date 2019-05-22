let language, // default: english
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
            "read_more": "Περισσότερα"
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
            "read_more": "Read more"
        }
    },
    languageImgElem;

$(document).ready(function() {
    languageImgElem = $("#languageImg");

    setLanguage(sessionStorage.getItem('lang'));
})

function setLanguage(langS) {
    if (langS === "el") {
        languageImgElem.attr("src", grImgUrl);
        language = "el";
        sessionStorage.setItem('lang', 'el');
    } else { // default 
        languageImgElem.attr("src", engImgUrl);
        language = "en";
        sessionStorage.setItem('lang', 'en');
    }
}

function toggleLanguage() {
    if (language === "en") {
        setLanguage("el");
    } else {
        setLanguage("en");
    }
    getAndStoreAllGenres(function() { // fetch genres of the current language
        searchBarElem.keyup(); // trigger search
    });
}

function getString(key) {
    return strings[language][key];
}