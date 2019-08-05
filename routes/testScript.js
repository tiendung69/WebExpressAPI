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

var ObjectId = require('mongodb').ObjectID;


router.get('/:id', async (req, res) => {

    var url = "mongodb://localhost:27017/";

    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_testscript");
        var id = req.params.id;

        var listTestScript;
        await dbo.collection("TestScript").find({}).toArray(async (err, data) => {

            listTestScript = data;

        });


        var listTestClassSelected = [];

        dbo.collection("TestTemplate").findOne({ _id: new ObjectId(id) }, async (err, template) => {


            await initListTestClassAvailable(template['testcases'], listTestScript);

            var listTestClassAvailable = JSON.parse(JSON.stringify(listTestScript).split('"_id":').join('"testscript-id":'));


            for (var i = 0; i < template.testcases.length; i++) {
                item = template.testcases[i];

                var test = {
                    "run": item['run'],
                    "testscript-id": item['testscript-id'],
                    "testclass-name": item['testclass-name'],
                    "test-methods": [
                        {
                            "testmethod-id": item['testmethod-id'],
                            "testmethod-name": item['testmethod-name'],
                            "test-type": item['test-type'],
                            "testcases": [
                                {
                                    "testcase-id": item['testcase-id'],
                                    "testcase-name": item['testcase-name'],
                                }
                            ]
                        }
                    ]
                };
                if (listTestClassSelected.length === 0) {
                    listTestClassSelected.push(test);
                    continue;
                } else {
                    var check = await checkTestClassExist(item, listTestClassSelected);
                    if (check === false) {
                        listTestClassSelected.push(test);
                    }
                }
            }

            db.close();

            res.json({
                status: 200,
                msg: 'ok',
                listTestClassSelected: listTestClassSelected,
                listTestClassAvailable: listTestClassAvailable,
            })

        });





    });
});



initListTestClassAvailable = async (listTestCase, listTestScript) => {

    for (var i = 0; i < listTestCase.length; i++) {
        for (var j = 0; j < listTestScript.length; j++) {
            if (listTestCase[i]['testscript-id'].equals(listTestScript[j]['_id'])) {
                for (k = 0; k < listTestScript[j]['test-methods'].length; k++) {
                    if (listTestCase[i]['testmethod-id'].equals(listTestScript[j]['test-methods'][k]['testmethod-id'])) {
                        for (var m = 0; m < listTestScript[j]['test-methods'][k]['testcases'].length; m++) {
                            if (listTestCase[i]['testcase-id'].equals(listTestScript[j]['test-methods'][k]['testcases'][m]['testcase-id'])) {
                                // pop 
                                listTestScript[j]['test-methods'][k]['testcases'].splice(m, 1);
                            }
                        }
                    }
                }
            }
        }
    }
}



checkTestClassExist = (item, listTestClassSelected) => {

    for (var i = 0; i < listTestClassSelected.length; i++) {

        if (listTestClassSelected[i]['testscript-id'].equals(item['testscript-id'])) {

            for (var j = 0; j < listTestClassSelected[i]['test-methods'].length; j++) {

                if (item['testmethod-id'].equals(listTestClassSelected[i]['test-methods'][j]['testmethod-id'])) {
                    var testCase = {
                        "testcase-id": item['testcase-id'],
                        "testcase-name": item['testcase-name'],
                    }
                    listTestClassSelected[i]['test-methods'][j]['testcases'].push(testCase);
                    return true;
                }
            }

            var method = {

                "testmethod-id": item['testmethod-id'],
                "testmethod-name": item['testmethod-name'],
                "test-type": item['test-type'],
                "testcases": [{
                    "testcase-id": item['testcase-id'],
                    "testcase-name": item['testcase-name'],
                }],

            };
            listTestClassSelected[i]['test-methods'].push(method);

            return true;
        }
    }
    return false;
}

module.exports = router;
