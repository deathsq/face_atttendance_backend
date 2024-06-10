const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let facultySchema = new Schema({
    "id":{
        type:Number
    },
    "password":{
        type:Number
    },
    "name":{
        type:String
    }
},
{
    collection : 'facultyDetails'
}
)
module.exports = mongoose.model('facultyDetails',facultySchema)