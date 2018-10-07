/**
 * The path to the site's api
 */
const API_PATH = '/api/';

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
        data.forEach(user => results.append(
            '<a href="/' + extractSteam16Id(user.identifier) + '">' + user.firstname + ' ' + user.lastname + ' (' + user.dateofbirth + ')</a>'
        ));
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