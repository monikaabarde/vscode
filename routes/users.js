var mongoose = require('mongoose') 
const passport=require('passport')
var plm =require('passport-local-mongoose')
var findOrCreate=require("mongoose-find-or-create")
var GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
mongoose.connect(process.env.DATABASE_LINK)

/* GET users listing. */
const personalSchema = new mongoose.Schema({
    username:{
      type:String,
      unique:true
    },
    fname: String,
    lname: String,
    email: String,
    googleId: String,
    mnum: Number,
    dob: Date,
    wnum: Number,
    gender:String,
    state: String,
    district:String,
    religion:String,
    category:String,
    class:String,
    course:String,
    income:Number,
    pc:String,
    studyabroad:Boolean,
    password:String
})

personalSchema.plugin(plm)
personalSchema.plugin(findOrCreate)
const pinfo= mongoose.model("pi",personalSchema)


passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
    pinfo.findOrCreate({ 
      googleId: profile.id,
      username:profile.displayName,
      fname:profile.name.familyName,
      lname:profile.name.givenName

     }, function (err, user) {
      return cb(err, user);
    });
  }
));


module.exports = pinfo;
