const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let imageSchema = new Schema({
    "name":{
        type:String
    }
},
{
    collection : 'imageDetails'
}
)
module.exports = mongoose.model('imageDetails',imageSchema)
