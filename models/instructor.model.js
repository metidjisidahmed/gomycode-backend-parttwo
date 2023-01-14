let mongoose=require('mongoose')
let Schema =mongoose.Schema

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};


var instructorSchema = new Schema({
    fullName : {
        firstName : {
            type : Schema.Types.String,
            required : true
        },
        lastName : {
            type : Schema.Types.String,
            required : true
        }
    },
    // source :  https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
    email: {
        type: Schema.Types.String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : Schema.Types.String
    },
    gender : {
        enum: ['M', 'F'],
    },
    birthday : {
        type : Schema.Types.Date,
        required : true
    }
}, {
    timestamps: true
})

module.exports= mongoose.model("Instructor"  , instructorSchema )
