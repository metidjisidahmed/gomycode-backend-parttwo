let mongoose=require('mongoose')
let Schema =mongoose.Schema



var courseSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true
    }
}, {
    timestamps: true
})

module.exports= mongoose.model("Course"  , courseSchema )
