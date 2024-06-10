const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let attendSchema = new Schema({
    totalAttendance:{
        type:Number
    },
    studentsAttendance:[
        {
            id:{
                type:Number
            },
            name:{
                type:String
            },
            department:{
                type:String
            },
            sem:{
                type:Number
            },
            totalAttendance:{
                type:Number
            },
                dates:{
                    type:Array
                }
        }
    ]
},
{
    collection : 'attendDetails'
}
)
module.exports = mongoose.model('attendDetails',attendSchema)