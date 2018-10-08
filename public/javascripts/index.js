// On document ready
$(document).ready(function () {

    // Set click events
    $('#searchBtn').click(onSearchClick);

});

/**
 * Handles click on the search button
 * 
 * @param {*} e Event
 */
function onSearchClick(e) {
    // Results div and make sure to clear it
    var results = $('#results');
    results.children('a').remove();

    // Collect users
    getUsers($("#civSearch").val(), function (data) {
        // Append results and show them
        data.forEach(user => {
            var name = cleanString(user.firstname + ' ' + user.lastname);
            var birth = cleanString(user.dateofbirth);
            results.append(
                `<a href="/civ/${name}/${birth}/${user.identifier}">
                    <li>
                        <span>${name} (${parseSex(user.sex)}, ${birth})</span>
                    </li>
                </a>`
            )
        });
        results.show();
    });
}

/**
 * Makes a call to the api to obtain users from a query
 * 
 * @param {string} query Query to make
 * @param {function} callback Callback when results are receieved
 */
function getUsers(query, callback) {
    $.getJSON(API_PATH + 'civs/' + query.toLowerCase(), data => callback(data));
}

/**
 * Cleans string for putting in an url
 * 
 * @param {*} str String to clean
 */
function cleanString(str) {
    str = str.replace(new RegExp('/', 'g'), '-');
    return str;
}

function parseSex(sex) {
    sex = sex.toLowerCase();
    return sex === 'm' ? 'male' : 'female';
}