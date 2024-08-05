const mongoose = require("mongoose");
const schema = mongoose.Schema
const reviewSchema = new schema({
	body: String ,
	author : {
        type :mongoose.Schema.Types.ObjectId , ref : "User"},
	rating :  Number 

});

module.exports = mongoose.model("Review" ,reviewSchema )
