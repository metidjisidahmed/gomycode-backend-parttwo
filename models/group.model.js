let mongoose=require('mongoose')
let Schema =mongoose.Schema
require('mongoose-type-url')


var groupSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true
    },
    studentsId : [
        {
            type : Schema.Types.ObjectId,
            ref : "Student"
        }
    ],
    instructorId : {
        type : Schema.Types.ObjectId,
        ref : "Instructor"
    },
    courseId : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    },
    discordLink : {
        type : mongoose.SchemaTypes.Url,
        default : ""
    }
}, {
    timestamps: true
})

module.exports= mongoose.model("Group"  , groupSchema )
