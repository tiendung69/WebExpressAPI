var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
/* GET home page. */

var MongoClient = require('mongodb').MongoClient;
router.get('/', async (req, res) => {

    var url = "mongodb://localhost:27017/";

    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_testscript");
        await dbo.collection("TestTemplate").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json({
                data: result,
                status: 200,
                msg: 'ok',
            });
            db.close();
        });


    });
});



router.get('/:id', async (req, res) => {

    var url = "mongodb://localhost:27017/";

    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_testscript");
        var id = req.params.id;
        console.log(id);
        await dbo.collection("TestTemplate").find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json({
                data: result,
                status: 200,
                msg: 'ok',
            });
            db.close();
        });


    });
});

module.exports = router;
