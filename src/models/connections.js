const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        enum : ['interested','ignored','accepted','rejected'],
        message : '{VALUE} is not valid'
    }
}, { timestamps : true})

connectionRequestSchema.pre('save', async function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()){
        throw new Error('From and to user cannot be same');
    }
    next();
})

const ConnectionRequestModel = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;

