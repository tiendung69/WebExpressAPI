var express = require('express');
var router = express.Router();
var Student = require('../model/student');
var mongoose = require('mongoose');
/* GET home page. */
router.get('/', async (req, res, next) => {
    await Student.find({}, (err, data) => {
        if (err) {
            res.json({
                status: 400,
                msg: 'fail'
            });
        }
        res.json({
            status: 200,
            data: data,
            msg: 'success'
        });
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
