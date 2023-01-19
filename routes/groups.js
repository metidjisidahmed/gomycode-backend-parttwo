var express = require('express');
const { Storage } = require("@google-cloud/storage");

const UUID = require("uuid-v4");
const formidable = require("formidable-serverless");


const storage = new Storage({
    keyFilename: "admin.json",
});

const groupSchema = require("../models/group.model");
const studentSchema = require("../models/student.model")
var router = express.Router();




const axios= require('axios')

router.post('/', function(req, res, next) {
    const form = new formidable.IncomingForm({ multiples: true });
    let uuid = UUID();

    form.parse(req ,(err, fields, files) => {
        console.log("FILES = ", files)
        console.log("FILEDS =", fields)
        const file = files.file;
        if (err || file.size==0) {
            throw new Error("There was an error parsing the files")

        }
        // url of the uploaded image

        // const docID = userRef.doc().id;
        const bucket = storage.bucket(process.env.BUCKET_STORAGE);
        const timestamp = Date.now();
        const name = file.name.split(".")[0];
        const type = file.name.split(".")[1];
        const fileName = `${name}_${timestamp}.${type}`;
        bucket.upload(file.path, {
            destination: `groups/avatars/${fileName}`,
            resumable: true,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: uuid,
                },
            },
        })
            .then(imageResponse=>{
                let imageUrl;
                var downLoadPath =
                    "https://firebasestorage.googleapis.com/v0/b/go-my-code-code-managment.appspot.com/o/";
                imageUrl =
                    downLoadPath +
                    encodeURIComponent(imageResponse[0].name) +
                    "?alt=media&token=" +
                    uuid;
                return groupSchema.create({...fields , avatarUrl : imageUrl })

            })
            .then(group=>{
                res.json({ success : true , error : null , data : group})

            })
            .catch(err=>{
                console.log("error =", err)
                res.status(500).json({ success : false,  error : err.message , data : null})

            })
    })


    const file = req.file;
    console.log("file =", file)

    // const timestamp = Date.now();
    // const name = file.originalname.split(".")[0];
    // const type = file.originalname.split(".")[1];
    // const fileName = `${name}_${timestamp}.${type}`;
    // Step 1. Create reference for file name in cloud storage
    // const imageRef = firebaseStorage.child(fileName);
    // Step 2. Upload the file in the bucket storage
    // const snapshot = await imageRef.put(file.buffer);
    axios.post("http://127.0.0.1:5000/groups/avatar-image", req)
    // bucket.upload( file.path, {
    //     destination: `${fileName}`,
    //     resumable: true,
    //     metadata: {
    //         metadata: {
    //             firebaseStorageDownloadTokens: fileName,
    //         },
    //     },
    // })
    // imageRef.put(file)

        // Step 3. Grab the public url
        .then(downloadUrl=>{
            return groupSchema.create({...req.body , avatarUrl : downloadUrl })
        })
        .then(group=>{
            res.json({ success : true , error : null , data : group})

        })
        .catch(err=>{
            console.log("error =", err)
            res.status(500).json({ success : false,  error : err.message , data : null})

        })



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

// COPY-PASTE code from
router.post("/avatar-image", async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    let uuid = UUID();

    form.parse(req ,(err, fields, files) => {
        console.log("FILE IN FIREBASE = ", files)
        const file = files.file;
        if (err || file.size==0) {
            throw new Error("There was an error parsing the files")

        }
        // url of the uploaded image

        // const docID = userRef.doc().id;
        const bucket = storage.bucket(process.env.BUCKET_STORAGE);
        const timestamp = Date.now();
        const name = file.name.split(".")[0];
        const type = file.name.split(".")[1];
        const fileName = `${name}_${timestamp}.${type}`;
        bucket.upload(file.path, {
            destination: `groups/avatars/${fileName}`,
            resumable: true,
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: uuid,
                },
            },
        })
            .then(imageResponse=>{
                let imageUrl;
                var downLoadPath =
                    "https://firebasestorage.googleapis.com/v0/b/go-my-code-code-managment.appspot.com/o/";
                imageUrl =
                    downLoadPath +
                    encodeURIComponent(imageResponse[0].name) +
                    "?alt=media&token=" +
                    uuid;
                res.status(200).json({
                    err : null,
                    success : true,
                    data : imageUrl
                })

            })
            .catch(err=>{
                res.status(500).json({
                    err : err.message,
                    success : false,
                    data : null
                })
            })
    })


});


module.exports = router;
