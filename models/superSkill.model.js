let mongoose=require('mongoose')
let Schema =mongoose.Schema




var superSkillSchema = new Schema({
    name : {
        type : Schema.Types.String,
        required : true
    },
    courseId : {
        type : Schema.Types.ObjectId,
        ref : "Course"
    }
}, {
    timestamps: true
})

module.exports= mongoose.model("SuperSkill"  , superSkillSchema )
