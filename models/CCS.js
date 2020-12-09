const mongoose = require('mongoose')

const CCSSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    whatsapp: {
        type: String
    },
    regNum: {
        type: String
    },
    depts: {
        type: Array
    },
    strengths: {
        type: String
    },
    weaknesses: {
        type: String
    },
    whyDoYouJoin: {
        type: String
    }
})

const CCS = mongoose.model("CCS", CCSSchema);

module.exports = CCS