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
    regCount:{
        type:Number,
        default: 0,
        required: true
    },
    regUsers: [{
        _id:{
            type:String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }],
    numTextBoxes:{
        type: Number,
        required: true,
        default: 0
    },
    numMultiChoice:{
        type: Number,
        required: true,
        default: 0
    },
    numFileUploads:{
        type: Number,
        required: true,
        default: 0
    },
    isFileUpload:{
        type: Boolean,
        required: true,
        default: false
    },
    isMultiChoice:{
        type: Boolean,
        required: true,
        default: false
    },
    isFileUpload:{
        type: Boolean,
        required: true,
        default: false
    },
    approved:{
        type:Boolean,
        required: true,
        default: false
    },
    dateCreated:{
        type: Date,
        default: Date.now
    },
    eventStart:{
        type: Date,
        default: Date.now
    },
    eventEnd:{
        type: Date,
        default: Date.now
    },
    regStart:{
        type: Date,
        default: Date.now
    },
    eventImg:{
        type: Buffer
    },
    createdBy: [{
        _id: {
            type: String,
        }, 
        name: {
            type: String,
        }
    }]

});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;