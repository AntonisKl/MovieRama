let language, // default: english
    // locale strings map
    strings = {
        "el": {
            "no_results": "Δεν βρέθηκαν αποτελέσματα",
            "overview": "Περιγραφή",
            "genres": "Κατηγορίες",
            "genre": "Κατηγορία",
            "reviews": "Κριτικές",
            "trailer": "Trailer",
            "similar_movies": "Παρόμοιες ταινίες",
            "rating": "Βαθμολογία",
            "release_year": "Έτος κυκολφορίας",
            "by_user": "Από τον χρήστη",
            "read_more": "ΠΕΡΙΣΣΟΤΕΡΑ",
            "search": "Αναζήτηση"
        },
        "en": {
            "no_results": "No results",
            "overview": "Overview",
            "genres": "Genres",
            "genre": "Genre",
            "reviews": "Reviews",
            "trailer": "Trailer",
            "similar_movies": "Similar movies",
            "rating": "Rating",
            "release_year": "Release year",
            "by_user": "By",
            "read_more": "READ MORE",
            "search": "Search"
        }
    },
    languageImgElem,
    // Keep flag icons local (data URI) so they always load without third-party dependencies.
    engImgUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 45'%3E%3CclipPath id='s'%3E%3Cpath d='M0,0 v45 h60 v-45 z'/%3E%3C/clipPath%3E%3Cpath d='M0,0 v45 h60 v-45 z' fill='%23012169'/%3E%3Cpath d='M0,0 L60,45 M60,0 L0,45' stroke='%23fff' stroke-width='9'/%3E%3Cpath d='M0,0 L60,45 M60,0 L0,45' clip-path='url(%23s)' stroke='%23c8102e' stroke-width='6'/%3E%3Cpath d='M30,0 v45 M0,22.5 h60' stroke='%23fff' stroke-width='15'/%3E%3Cpath d='M30,0 v45 M0,22.5 h60' stroke='%23c8102e' stroke-width='9'/%3E%3C/svg%3E",
    grImgUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 18'%3E%3Crect width='27' height='18' fill='%230d5eaf'/%3E%3Cg fill='%23fff'%3E%3Crect y='2' width='27' height='2'/%3E%3Crect y='6' width='27' height='2'/%3E%3Crect y='10' width='27' height='2'/%3E%3Crect y='14' width='27' height='2'/%3E%3C/g%3E%3Crect width='10' height='10' fill='%230d5eaf'/%3E%3Crect x='4' width='2' height='10' fill='%23fff'/%3E%3Crect y='4' width='10' height='2' fill='%23fff'/%3E%3C/svg%3E";

$(document).ready(function() {
    languageImgElem = $("#languageImg");
    searchBarElem = $("#searchBar");

    setLanguage(sessionStorage.getItem('lang')); // set language to the previously preferred one
});


// getString: returns the correct string according to the current locale
function getString(key) {
    return strings[language][key];
}

// setLanguage: sets the language to the desired one (English or Greek)
function setLanguage(langS) {
    if (langS === "el") {
        languageImgElem.attr("src", grImgUrl);
        language = "el";
        searchBarElem.attr("placeholder", getString("search"));
        sessionStorage.setItem('lang', 'el'); // store language choice
    } else { // default 
        languageImgElem.attr("src", engImgUrl);
        language = "en";
        searchBarElem.attr("placeholder", getString("search"));
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
