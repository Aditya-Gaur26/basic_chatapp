const mongoose = require('mongoose')
const {Schema} = mongoose;

const messageSchema = new Schema({
    message:String,
    timestamp:{
        type:Date,
        default:Date.now
    },
    receiver:String,
    sender:String

})

module.exports = mongoose.model('messages',messageSchema);