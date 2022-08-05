var mongoose = require('mongoose') 

/* GET users listing. */
const userSchema = new mongoose.Schema({

heading: {
    type:String,
    unique:true
},
value: Number,
region:String,
about:String,
deadline:Date,
eligibilityCard: String,
eligibilityPage: Array,
desirableQualifications: Array,
benifits:Array,
documents:Array,
link:String,
weblink:String,
tags:Array,
})

const scholarship= mongoose.model("scholarship",userSchema)
module.exports = scholarship;


