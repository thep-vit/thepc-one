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
    },
    ccsDoc: {
        type: Buffer
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
    },
    entryType: {
        type: String
    }
})

const CCS = mongoose.model("CCS", CCSSchema);

module.exports = CCS