var express = require('express');
var router = express.Router();

// Database
const pool = require('./lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET civilian page. */
router.get('/:id', function (req, res, next) {
  // Get steam64 and lower it
  var id = req.params.id.toLowerCase();

  // Render civilian
  getData(id)
    .then(civ => res.render('civilian', { civ }))
    .catch(err => res.render('error', { message: err }));

  
});

/**
 * Gets an user by their id
 * 
 * @param {string} id The identifier
 */
async function getData(id) {
  // Make a civ object
  var civ = await getCiv(id);

  // Data
  civ.record = await getRecord(id);
  civ.licenses = await getLicenses(id);

  // Finally return the civ
  return civ;
}

/**
 * Gets civ for id
 * 
 * @param {string} id Identifier
 */
async function getCiv(id) {
  var civs = await pool.query(`SELECT * FROM characters WHERE identifier = '${id}'`);
  if (civs.length == 0) throw new Error('Civilian not found');
  return civs[0];
}

/**
 * Gets the criminal record for id
 * 
 * @param {string} id Identifier
 */
async function getRecord(id) {
  return await pool.query(`SELECT * FROM qalle_brottsregister WHERE identifier = '${id}'`);
}

/**
 * Gets a friendly version of license 
 * 
 * @param {string} license The type
 */
async function getLicenseFriendly(license) {
  var licenses = await pool.query(`SELECT * FROM licenses WHERE type = '${license}'`);
  return licenses[0];
}

/**
 * Gets all the licenses that belong to an id
 * 
 * @param {string} id Identifier
 */
async function getLicenses(id) {
  var licenses = [];
  var res = await pool.query(`SELECT * FROM user_licenses WHERE owner = '${id}'`);
  for (const raw of res) {
    // Push the raw and a friendly version
    licenses.push({ raw, friendly: await getLicenseFriendly(raw.type) });
  }
  return licenses;
}

module.exports = router;
