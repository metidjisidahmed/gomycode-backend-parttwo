var express = require('express');
const groupSchema = require("../models/group.model");
const studentSchema = require("../models/student.model")
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

})
    .get('/' , function (req ,res ){
        groupSchema.find({})
            .populate("studentsId")
            .then(groups=>{
                res.json({ success : true , error : null , data : groups})
            })
            .catch(err=>{
                res.json({ success : false,  error : err.message , data : null})

            })
    })

router.post('/add-student/:groupId' , function (req , res){
    let studentId = req.body.studentId
    let groupId = req.params.groupId
    // find the targeted group
    groupSchema.findOne({_id : groupId } , (err , group)=>{
        if(err){
            res.json({ success : false,  error : err.message , data : null})
        }else{
            if(err){
                res.json({ success : false,  error : err.message , data : null})
            }else{
                let newstudentsGroup = [...group.studentsId]
                newstudentsGroup.push(studentId);
                // find the targeted student
                studentSchema.findOne({_id : studentId} , (err , student)=>{
                    if(err){
                        res.json({ success : false,  error : err.message , data : null})
                    }else{
                        let newgroupsStudent = [...student.groups]
                        newgroupsStudent.push(groupId)
                        // update student
                        studentSchema.findOneAndUpdate({_id : student} , {$set : {groups : newgroupsStudent} } , {new : true} , function (err , updatedStudent){
                            if(err){
                                res.json({ success : false,  error : err.message , data : null})
                            }else{
                                //update group
                                groupSchema.findOneAndUpdate({_id :groupId } , {$set : { studentsId : newstudentsGroup}  } , {new : true} , function (err , updatedGroup){
                                        if(err){
                                            res.json({ success : false,  error : err.message , data : null})
                                        }else{
                                            res.json({ success : true , error : null , data : {group : updatedGroup , student : updatedStudent }})

                                        }
                                })
                            }

                        })
                    }
                } )
            }

        }

    })
})

router.post('/add-student-v2/:groupId' , function (req , res){
    let studentId = req.body.studentId
    let groupId = req.params.groupId
    let global_updatedStudent= null;
    let newstudentsGroup=null;
    // find the targeted group
    groupSchema.findOne({_id : groupId })
        .then(group=>{
            newstudentsGroup = [...group.studentsId]
            newstudentsGroup.push(studentId);
                    // find the targeted student
            return studentSchema.findOne({_id : studentId} )
        })
        .then( student=>{
                let newgroupsStudent = [...student.groups]
                newgroupsStudent.push(groupId)
                // update student
                return studentSchema.findOneAndUpdate({_id : student} , {$set : {groups : newgroupsStudent} } , {new : true})
        })
        .then(updatedStudent=>{
            global_updatedStudent = updatedStudent
                //update group
                return groupSchema.findOneAndUpdate({_id :groupId } , {$set : { studentsId : newstudentsGroup}  } , {new : true} )

        })
        .then(updatedGroup=>{
                return res.json({ success : true , error : null , data : {group : updatedGroup , student : global_updatedStudent }})
        })
        .catch(err=>{
            res.json({ success : false,  error : err.message , data : null})

        })

})


router.post('/add-student-v3/:groupId' , function (req , res){
    let studentId = req.body.studentId
    let groupId = req.params.groupId
    let global_group= null;
    let global_student = null
    let newstudentsGroup=null;
    // find the targeted group
    groupSchema.findOne({_id : groupId })
        .then(group=>{
            global_group=group
            global_group.studentsId.push(studentId)
            // find the targeted student
            return studentSchema.findOne({_id : studentId} )
        })
        .then( student=>{
            global_student=student
            global_student.groups.push(groupId)
            // update student
            return global_student.save()
            // return studentSchema.findOneAndUpdate({_id : student} , {$set : {groups : newgroupsStudent} } , {new : true})
        })
        .then(updatedStudent=>{
            // global_updatedStudent = updatedStudent
            //update group
            return global_group.save()
            // return groupSchema.findOneAndUpdate({_id :groupId } , {$set : { studentsId : newstudentsGroup}  } , {new : true} )

        })
        .then(updatedGroup=>{
            return res.json({ success : true , error : null , data : {group : updatedGroup , student : global_student }})
        })
        .catch(err=>{
            res.json({ success : false,  error : err.message , data : null})

        })

})

router.post('/add-student-v4/:groupId' , function (req , res){
    let studentId = req.body.studentId
    let groupId = req.params.groupId
    let global_group= null;
    let global_student = null
    let newstudentsGroup=null;
    // find the targeted group
    groupSchema.findOne({_id : groupId })
        .then(group=>{
            global_group=group
            console.log("the group =", global_group)
            global_group.studentsId.push(studentId)
            // find the targeted student
            return studentSchema.findOne({_id : studentId} )
        })
        .then( student=>{
            global_student=student
            console.log("the student =", global_student)

            global_student.groups.push(groupId)
            // update student
            let promise1 = Promise.resolve(global_student.save())
            let promise2 = Promise.resolve(global_group.save())
            return Promise.all([ promise1, promise2])
            // return studentSchema.findOneAndUpdate({_id : student} , {$set : {groups : newgroupsStudent} } , {new : true})
        })
        .then(updatedGroupAndStudent=>{
            return res.json({ success : true , error : null , data : {group : updatedGroupAndStudent[1] , student : updatedGroupAndStudent[0] }})
        })
        .catch(err=>{
            res.json({ success : false,  error : err.message , data : null})

        })

})


module.exports = router;
