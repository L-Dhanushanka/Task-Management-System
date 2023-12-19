const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    customername : {
        type : String,
        required: true
    },

    company: {
        type : String,
        required: true
    },

    contact: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    country : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    }, 
    address3: {
        type: String,
    },

})

const user = mongoose.model("user", userSchema);

module.exports = user;  
