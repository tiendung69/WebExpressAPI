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



function jsonEscape(str) {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
function jsonEscape(str)  {
    return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
}
router.post("/json", async (req, res, next) => {

    // console.log(req.body);
    console.log( req.body.json);
    // var a = 5;

    var data = req.body.json;
    var b = JSON.stringify(data);
  

    var a = "";
    console.log(b.replace(/(\r\n|\n|\r|\t)/gm,""));
    


    var url = "mongodb://localhost:27017/manage_student";


    await MongoClient.connect(url, { useNewUrlParser: true }, async (err, db) => {

        var dbo = db.db("manage_student");
        // var result = await dbo.collection("student").insertOne(
        //    {data: req.body.json} 
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
