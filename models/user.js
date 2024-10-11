const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    teamName: 
    {
        type: String,
        required: true
    },
    teamLeaderEmail:
    {
        type: String,
        required: true,
        unique: true
    },
    name: 
    {
        type: String,
    },
    password:
    {
        type: String,
        required: true
    },
    points:
    {
        type: Number
    },
    cost:{
        type: Number
    },
    techStack:{
        type: Schema.Types.Mixed
    },
    selected:
    {
        type: Boolean,
        default:false
    }
})

module.exports = mongoose.model('User', UserSchema);