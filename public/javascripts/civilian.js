// Document ready
$(document).ready(function () {
    
});

/**
 * Gets the steam id of the civilian
 */
function getSteamId() {
    // Make sure to remove the 'steam' prefix
    return extractSteam16Id($('#civid').html());
}

