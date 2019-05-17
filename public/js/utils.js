function httpGet(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

// function getDate(daysAgo) {
//     var today = new Date();

//     if (daysAgo > 0) {
//         today.setDate(today.getDate() - daysAgo);
//     }

//     var dd = today.getDate();
//     var mm = today.getMonth() + 1; //January is 0!
//     var yyyy = today.getFullYear();

//     if (dd < 10) {
//         dd = '0' + dd
//     }

//     if (mm < 10) {
//         mm = '0' + mm
//     }

//     return yyyy + '-' + mm + '-' + dd;
// }