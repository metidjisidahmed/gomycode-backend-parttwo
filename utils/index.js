const jwt = require('jsonwebtoken')

function authentificateToken(req , res , next){
    let bearerPlusToken = req.headers['authorization']
    let token=null;
    if(bearerPlusToken!= null){
        token = bearerPlusToken.split(' ')[1]
    }
    if(token != null){
        jwt.verify(token , process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
            //the user object is the same in jwt.sign {username , email}
            if(err){
                res.setHeader('Content-Types', 'application/json');
                res.statusCode = 403;
                res.json({status : false , data: 'Unauthenticated !'})
            }else{
                req.user = user;
                next();

            }
        })
    }else{
        // res.sendStatus(401)
        res.statusCode = 401;

        res.json({ success : false , error : "unauthenticated" , data : null})
    }


}
module.exports= {
    authentificateToken : authentificateToken
}
