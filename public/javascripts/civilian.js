// Document ready
$(document).ready(function () {
    // Assign click handlers
    $('#licenses li .button').click(removeLicense);
    $('#record li .button').click(removeRecord);
});

function removeLicense(e) {
    var parent = $(this).parent('li');    
    del('license', parent.attr('oid')).then(parent.remove());
}

function removeRecord(e) {
    var parent = $(this).parent('li');    
    del('record', parent.attr('oid')).then(parent.remove());
}

/**
 * Makes a DELETE request to the api to remove at an endpoint
 * 
 * @param {string} type Type to remove (ex: license)
 * @param {*} id The id
 */
async function del(type, id) {
    await $.ajax({
        url: API_PATH + type, type: 'DELETE', data: { id },
        success: result => result
    });
}

/**
 * Gets the steam id of the civilian
 */
function getSteamId() {
    return $('#civid');
}

