var express = require('express');
var router = express.Router();

// Database
const pool = require('./lib/database');

/* GET civilians by search query. */
router.get('/civs/:query', function (req, res, next) {
    // The query
    var query = req.params.query.toLowerCase();

    // Perform sql on query
    var sql = `SELECT * FROM characters WHERE (LOWER(firstname) LIKE '%${query}%' OR LOWER(lastname) LIKE '%${query}%')`;
    pool.query(sql).then(results => res.json(results));
});

/* DELETE license. */
router.delete('/license', function (req, res, next) {
    // License id
    var id = parseInt(req.body.id);

    // Remove from database and notify sender
    var query = pool.query(`DELETE FROM user_licenses WHERE id=${id}`);
    query.then(res.json({}));
});

/* DELETE record. */
router.delete('/record', function (req, res, next) {
    // License id
    var id = parseInt(req.body.id);

    // Remove from database and notify sender
    var query = pool.query(`DELETE FROM qalle_brottsregister WHERE id=${id}`);
    query.then(res.json({}));
});

module.exports = router;
