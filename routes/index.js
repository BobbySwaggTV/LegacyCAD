var express = require('express');
var router = express.Router();

// Database
const pool = require('./lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET civilian page. */
router.get('/:steam16', function (req, res, next) {
  // Get steam64 and lower it
  var steam16 = req.params.steam16.toLowerCase();

  // Render civilian
  getData(steam16)
    .then(data => res.render('civilian', { data }))
    .catch(err => res.render('error', { message: err }));
});

/**
 * Gets an user by their steam16
 * 
 * @param {*} steam16 The steam16 id
 */
async function getData(steam16) {
  // Append the steam id and make a civ object
  var id = 'steam:' + steam16;
  var data = {};

  // Data
  data.civ = await getCiv(id);
  data.record = await getRecord(id);
  data.licenses = await getLicenses(id);

  // Finally return the civ
  return data;
}

/**
 * Gets civ for id
 * 
 * @param {*} id Identifier
 */
async function getCiv(id) {
  var civs = await pool.query(`SELECT * FROM characters WHERE identifier = '${id}'`);
  if (civs.length == 0) throw new Error('Civilian not found');
  return civs[0];
}

/**
 * Gets the criminal record for id
 * 
 * @param {*} id Identifier
 */
async function getRecord(id) {
  return await pool.query(`SELECT * FROM qalle_brottsregister WHERE identifier = '${id}'`);
}

/**
 * Gets a lisence name from type
 * 
 * @param {*} license The type
 */
async function getLicenseName(license) {
  var licenses = await pool.query(`SELECT * FROM licenses WHERE type = '${license}'`);
  return licenses[0];
}

/**
 * Gets all the licenses that belong to an id
 * 
 * @param {*} id Identifier
 */
async function getLicenses(id) {
  var licenses = [];
  var res = await pool.query(`SELECT * FROM user_licenses WHERE owner = '${id}'`);
  for (const license of res) {
    licenses.push(await getLicenseName(license.type));
  }
  return licenses;
}

module.exports = router;
