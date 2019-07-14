var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.json({
        msg:"GET / running"
    });
});


module.exports = router;
