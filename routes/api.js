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

module.exports = router;
