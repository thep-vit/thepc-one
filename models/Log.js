const mongoose = require("mongoose")

const logSchema = new mongoose.Schema({
    userEmail: {
        type: String
    },
    logs: [{
        route: {
            type: String,
        }, 
        method: {
            type: String,
        },
        date: {
            type: Date,
        }
    }],
    startTime: {
        type: Date,
        default: Date.now()
    },
    startToken: {
        type: String
    }
})

const Log = mongoose.model("Log", logSchema)

module.exports = Log