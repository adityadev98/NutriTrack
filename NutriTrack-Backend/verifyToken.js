import jwt from 'jsonwebtoken';

//custom middleware for token based model for pages after login 
function verifyToken(req,res,next){
    if(req.headers.authorization!==undefined)
    {
        let token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,"nutritrackapp",(err,data)=>{
            if(!err){
               next();
            }
            else{
                res.status(403).send({message:"Invalid token"})
            }
        })
    }
    else{
        res.send({message: "Token not sent"});
    }
   

}

export default verifyToken;