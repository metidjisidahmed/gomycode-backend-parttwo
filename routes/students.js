var express = require('express');
var router = express.Router();
var studentSchema = require('../models/student.model')


/* POST /students to create student */
router.post('/', function(req, res, next) {
    const newStudent = new studentSchema()
    newStudent.fullName= req.body.fullName
    newStudent.email= req.body.email
    newStudent.gender= req.body.gender
    newStudent.groups= []
    newStudent.birthday= req.body.birthday
    newStudent.save(function (err , student){
        if(err){
            res.json({ success : false,  error : err.message , data : null})
        }else{
            res.json({ success : true , error : null , data : student})
        }
    })
    console.log("req body Name =", req.body.name)

})
    .get('/' , function (req , res){
        console.log("REQ QUERY =", req.query)
        studentSchema.find(req.query , function (err , students){
            if(err){
                res.json({ success : false,  error : err.message , data : null})
            }else{
                res.json({ success : true , error : null , data : students})
            }
        })
    });

router.get('/:id' , function (req , res){
    studentSchema.findOne({_id :  req.params.id} , function (err , student){
        if(err){
            res.json({ success : false,  error : err.message , data : null})
        }else{
            if(student==null){
                res.json({ success : false , error : "unexisted student", data : student})

            }else{
                res.json({ success : true , error : null , data : student})

            }
        }
    })
} )

module.exports = router;
