var express = require('express');
var bcrypt = require('bcrypt');

var router = express.Router();
var studentSchema = require('../models/student.model')
let jwt = require('jsonwebtoken')
let utils = require('../utils')
let authentificateToken = utils.authentificateToken

/* POST /students to create student */
router.post('/signup', function(req, res, next) {
    const newStudent = new studentSchema()
    newStudent.fullName= req.body.fullName
    newStudent.email= req.body.email
    newStudent.gender= req.body.gender
    newStudent.groups= []
    newStudent.birthday= req.body.birthday

    bcrypt.hash(req.body.password  , 12)
        .then(hashedPassword=>{
            newStudent.password= hashedPassword
            console.log("req body Name =", req.body.name)
            return  newStudent.save()
        })
        .then(student=>{
            delete student.password
            console.log("ACCESS_TOKEN_SECRET = " ,process.env.ACCESS_TOKEN_SECRET )
            const token = jwt.sign(student.toJSON() , process.env.ACCESS_TOKEN_SECRET )
            res.json({ success : true , error : null , data : { accountDetail : student , token : token } })
        })
        .catch(err=>{
            res.json({ success : false,  error : err.message , data : null})
        })

})
router.post('/login', function(req, res, next) {
    // const email = req.body.email
    // const password = req.body.password
    const {email , password} = req.body
    let global_foundStudent

    studentSchema.findOne({email  : email})
        .then(foundStudent=>{
            global_foundStudent = foundStudent
            delete global_foundStudent.password
            // confirm that we have already a CREATED student with this mail
            if(foundStudent != null){
                return bcrypt.compare(password ,foundStudent.password )
            }else{
                // go to catch
                throw new Error("unexisted user with this mail , please signup ")
            }
        })
        .then(bool=>{
            //  he writes the correct password
            if(bool===true){
                console.log("ACCESS_TOKEN_SECRET = " ,process.env.ACCESS_TOKEN_SECRET )
                const token = jwt.sign( global_foundStudent.toJSON(), process.env.ACCESS_TOKEN_SECRET)
                res.json({ success : true , error : null , data : token})
            }else{
                // go to catch
                // res.sendStatus(400)
                res.statusCode = 400;

                throw new Error("wrong password")
            }
        })

        .catch(err=>{
            // res.sendStatus(500)
            res.statusCode = 500;

            res.json({ success : false,  error : err.message , data : null})

        })

})

    .get('/' , authentificateToken, function (req , res){
        console.log("REQ QUERY =", req.query)
        console.log("CONNECTED USER IS :", req.user)
        studentSchema.find(req.query , function (err , students){
            if(err){
                res.json({ success : false,  error : err.message , data : null})
            }else{
                res.json({ success : true , error : null , data : students})
            }
        })
    });

router.get('/profile' , authentificateToken, function (req , res){
    console.log("REQ QUERY =", req.query)
    console.log("CONNECTED USER IS :", req.user)
    studentSchema.findOne({_id : req.user._id})
        .then(searchedUser=>{
            res.json({ success : true,  error : null , data : searchedUser})
        })
        .catch(err=>{
            res.statusCode=500
            res.json({ success : false,  error : err.message , data : null})

        })

});


router.get('/:id' , function (req , res){
    studentSchema.findOne({_id :  req.params.id} , function (err , student){
        if(err){
            res.statusCode=200
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
    .put('/:id' , function (req , res){
    studentSchema.findOneAndUpdate({_id :  req.params.id} , {$set : req.body } , { new : true} , function (err , student){
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
    .delete('/:id' , function (req , res){
        studentSchema.findOneAndDelete({_id : req.params.id} , (err , student)=>{
            if(err){
                res.json({success : false, error : err.message , data : student})
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
