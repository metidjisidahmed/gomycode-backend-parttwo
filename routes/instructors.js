var express = require('express');
const instructorSchema = require("../models/instructor.model");
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    const newInstructor = new instructorSchema()
    newInstructor.fullName= req.body.fullName
    newInstructor.email= req.body.email
    newInstructor.gender= req.body.gender
    newInstructor.groups= []
    newInstructor.birthday= req.body.birthday
    newInstructor.save(function (err , instructor){
        if(err){
            res.json({ success : false,  error : err.message , data : null})
        }else{
            res.json({ success : true , error : null , data : instructor})
        }
    })
    console.log("req body Name =", req.body.name)
});

module.exports = router;
