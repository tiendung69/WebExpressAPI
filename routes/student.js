var express = require('express');
var router = express.Router();
var Student = require('../model/student');
var mongoose = require('mongoose');
/* GET home page. */

var MongoClient = require('mongodb').MongoClient;
router.get('/', async (req, res, next) => {

    console.log("start debug");
    var a = 10;
    var b = 100;

    var url = "mongodb://localhost:27017/manage_student";

    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_student");
        console.log("connect")
        /*Return only the documents where the address starts with an "S":*/
        await dbo.collection("student").find({}).toArray(function (err, result) {
            console.log("query");
            if (err) throw err;
            console.log(result);

            db.close();
            res.json({
                data: result
            })
        });
    });





    // await Student.find({}, (err, data) => {
    //     if (err) {
    //         res.json({
    //             status: 400,
    //             msg: 'fail'
    //         });
    //     }
    //     res.json({
    //         status: 200,
    //         data: data,
    //         msg: 'success'
    //     });
    // });

});


// insert list school of student
var ObjectId = require('mongodb').ObjectID;
router.get('/student/:idStudent', async (req, res, next) => {

    var url = "mongodb://localhost:27017/manage_student";

    var idStudent = req.params.idStudent;
    console.log(idStudent);
    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_student");
        var result = await dbo.collection("student").updateOne(
            { _id: new ObjectId(idStudent) },
            {
                $push: {
                    "schools": {
                        "school-id": new ObjectId(),
                        "nameSchool": "UIT 3",
                        "subject": []
                    }

                }
            }
        )
        res.json({
            data: result
        });
    });



});


// insert subject of student study in school

router.get('/student/:idStudent/school/:idSchool', async (req, res, next) => {

    var url = "mongodb://localhost:27017/manage_student";

    var idStudent = req.params.idStudent;
    var idSchool = req.params.idSchool;
    console.log(idStudent);
    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_student");
        var result = await dbo.collection("student").updateOne(
            { _id: new ObjectId(idStudent) },
            {
                $push: {
                    "schools.$[school].subject": {
                        "subject-id": new ObjectId(),
                        "nameSubject": "OOP",
                        "scores": []
                    }

                }
            },
            {
                arrayFilters: [
                    {
                        "school.school-id": new ObjectId(idSchool)
                    }
                ]
            }
        )
        res.json({
            data: result
        });
    });



});

// insert score
router.get('/student/:idStudent/school/:idSchool/subject/:idSubject', async (req, res, next) => {

    var url = "mongodb://localhost:27017/manage_student";

    var idStudent = req.params.idStudent;
    var idSchool = req.params.idSchool;
    var idSubject = req.params.idSubject;
    console.log(idStudent);
    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_student");
        var result = await dbo.collection("student").updateOne(
            { _id: new ObjectId(idStudent) },
            {
                $push: {
                    "schools.$[schoolFiller].subject.$[subjectFiller].scores": {
                        "score-id": new ObjectId(),
                        "nameScore": "midterm score",
                        "score": 10
                    }

                }
            },
            {
                arrayFilters: [
                    {
                        "schoolFiller.school-id": new ObjectId(idSchool)

                    },
                    {
                        "subjectFiller.subject-id": new ObjectId(idSubject)
                    }
                ]
            }
        )
        res.json({
            data: result
        });
    });



});








router.get('/student/:idStudent/school/:idSchool/update-subject/:idSubject', async (req, res, next) => {

    var url = "mongodb://localhost:27017/manage_student";

    var idStudent = req.params.idStudent;
    var idSchool = req.params.idSchool;
    var idSubject = req.params.idSubject;
    console.log(idStudent);
    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {
        if (err) throw err;
        var dbo = db.db("manage_student");
        var result = await dbo.collection("student").updateOne(
            { _id: new ObjectId(idStudent) },
            {
                $set: {
                    "schools.$[schoolFiller].subject.$[subjectFiller]": {

                        "nameSubject": "Math",
                        "teacher": "teacher update new",
                        "scores": [
                            {
                                "score-id": new ObjectId("5d39ef3dab63dd2b085a400e"),
                                "nameScore": "midterm score",
                                "score": 10
                            }
                        ]
                    }

                }
            },
            {
                arrayFilters: [
                    {
                        "schoolFiller.school-id": new ObjectId(idSchool)

                    },
                    {
                        "subjectFiller.subject-id": new ObjectId(idSubject)
                    }
                ]
            }
        )
        res.json({
            data: result
        });
    });



});



function escapeSpecialChars(jsonString) {

    return jsonString
        .replace(/\n/g, "")
        .replace(/\r/g, "")
        .replace(/\\t/g, "")
        .replace(/"  "/g, "")
        .replace(/\f/g, "");

}
router.post("/json", async (req, res, next) => {

    // console.log(req.body);
    // console.log( req.body.json);
    // var a = 5;

    var data = req.body.json;
    console.log(data);
   var b=  JSON.stringify(data, null, '  ').replace(/: "(?:[^"]+|\\")*"$/, ' $&');
    var a = escapeSpecialChars(data);
    console.log(b);
   // console.log(JSON.parse(a));
    //     var b = JSON.stringify(data);
    //     var c = b.replace(/\\n/g, "");
    //     var d = c.replace(/\\t/g, "");
    //     var e = d.replace(/\\/g, "");
    //     var f = e.replace(/ /g, "");
    //     var x = f.replace(/\\/g,"");
    //     var m = x.replace(/\'/g,"'");

    //     var k = m.substring(1, m.length-1);
    //     var l = k.substring(0, m.length-1);
    //     var n = l.replace(/\\/g,"");

    //    // console.log(JSON.stringify(l));
    //     for(var i= 0; i< l.length;i++){
    //         if(l[i] == "'"){
    //             l[i] = '"';
    //         }
    //     }
    //     console.log(JSON.stringify(l));

    // console.log(JSON.parse(l));
    //console.log(JSON.parse('{"name":"John", "age":30, "city":"New York"}'));


    var url = "mongodb://localhost:27017/manage_student";


    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {

        var dbo = db.db("manage_student");
        // var result = await dbo.collection("student").insertOne(
        //    {data:n} 
        // )
        res.json({
            status: 200,
            msg: 'ok',
            data: "result"
        })
    });

});















router.post('/', async (req, res, next) => {
    var student = new Student({
        name: req.body.name,
        age: req.body.age,
        address: req.body.address
    });

    student.save((err, data) => {
        if (err) {
            res.json({
                status: 400,
                msg: 'Insert fail'
            });
        }
        res.json({
            status: 200,
            data: data,
            msg: 'success'
        });

    });
});


router.put('/:id', async (req, res, next) => {
    try {

        await Student.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.id), req.body, { new: true }, (err, data) => {
            if (err) {
                res.json({
                    status: 400,
                    msg: 'Insert fail'
                });
            }

            res.json({
                status: 200,
                data: data,
                msg: 'success'
            });
        });
    } catch (error) {
        res.json({
            status: 400,
            msg: 'Insert fail'
        });
    }


});


router.delete('/:id', async (req, res, next) => {
    try {

        await Student.findByIdAndDelete(mongoose.Types.ObjectId(req.params.id), (err, data) => {
            if (err) {
                res.json({
                    status: 400,
                    msg: 'Insert fail'
                });
            }
            res.json({
                status: 200,
                data: data,
                msg: 'success'
            });
        });
    } catch (error) {
        res.json({
            status: 400,
            msg: 'Insert fail'
        });
    }

});




module.exports = router;
