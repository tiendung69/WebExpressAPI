var mongoose = require('mongoose');
var StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        default: "",
        required: true
    },
    age: {
        type: Number,
        required: false,
    },
    address: {
        type: String,
        default: "",
    },
    createdDate: {
        type: Date,
        default: Date.now,
    }


},
    {
        collection: 'student',
    });
module.exports = mongoose.model('Student', StudentSchema);