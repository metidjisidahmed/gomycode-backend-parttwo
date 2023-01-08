var express = require('express');
const groupSchema = require("../models/group.model");
var router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
    groupSchema.create(req.body , function (err , group){
        if(err){
            res.json({ success : false,  error : err.message , data : null})
        }else{
            res.json({ success : true , error : null , data : group})
        }
    } )

});

module.exports = router;
