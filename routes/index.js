var express = require('express');
var router = express.Router();

// Database
const pool = require('./lib/database');

/* Handle all requests here */
router.use('/', function (req, res, next) {
  return next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
  return res.render('index');
});

/* GET civilian page. */
router.get('/civilian/:name/:birth/:id', function (req, res, next) {
  // Get steam64 and lower it
  var id = req.params.id.toLowerCase();

  // Render civilian
  getData(id, req.params.name, req.params.birth)
    .then(civ => res.render('civilian', { civ }))
    .catch(err => res.render('error', { message: err }));
});

/**
 * Gets an user by their id
 * 
 * @param {string} id The identifier
 * @param {string} name Full name
 * @param {string} birth Birth date
 */
async function getData(id, name, birth) {
  // Make a civ object
  var civ = await getCiv(id);
  civ.name = name;
  civ.birth = birth;

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
  if (civs.length == 0) {
    throw new Error('Civilian not found');
  }
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
 * @param {string} type The type
 */
async function getLicenseFriendly(type) {
  var res = await pool.query(`SELECT * FROM licenses WHERE type = '${type}'`);
  return res[0];
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
