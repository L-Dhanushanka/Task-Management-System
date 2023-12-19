const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const taskSchema = new Schema({
    taskName : {
        type : String,
        required: true
    },

    description: {
        type : String,
        required: true
    },

    estimatedTime: {
        type: Number,
        required: true
    },

    priority: {
        type: String,
        required: true
    },

    completion: {
        type: String,
        required: true,
        default: "no"
    },
    cookie: {
        type: String,
        required: true,
    },

})

const task = mongoose.model("task", taskSchema);

module.exports = task;  