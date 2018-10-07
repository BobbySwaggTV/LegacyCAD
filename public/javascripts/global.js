/**
 * Extracts the steam16 from an identifier
 * 
 * @param {string} identifier Identifier to extract from
 */
function extractSteam16Id(identifier) {
    return identifier.split(':')[1];
}