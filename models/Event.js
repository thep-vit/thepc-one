const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDesc:{
        type: String,
        required: true
    },
    eventLink:{
        type:String,
        required: true
    },
    approved:{
        type:Boolean,
        required: true,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;